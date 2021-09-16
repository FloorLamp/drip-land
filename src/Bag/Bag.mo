import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Drip "./DripTypes";
import HashMap "mo:base/HashMap";
import Http "./Http";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Svg "./Svg";
import T "./Types";
import Text "mo:base/Text";
import Nat32Helper "./Nat32";
import Time "mo:base/Time";
import TrieSet "mo:base/TrieSet";

shared actor class Bag() = this {
  // ---- Constants
  let drip : Drip.Self = actor "prees-saaaa-aaaai-qanqa-cai";


  // ---- State
  var ledger: T.PrincipalToPlayerData = HashMap.HashMap<Principal, T.PlayerData>(1, Principal.equal, Principal.hash);
  stable var ledgerEntries: [T.PrincipalToPlayerDataEntry] = [];

  stable var nextItemId : Nat32 = 0;
  var allItems: T.IdsToItem = HashMap.HashMap<Nat32, T.Item>(1, Nat32.equal, Nat32Helper.id);
  stable var allItemEntries: [T.IdsToItemEntry] = [];

  stable var dripsBurned : Nat = 0;

  // ---- Queries

  public query func name() : async Text {
    "DRIP.LAND"
  };

  public query func symbol() : async Text {
    "DRIP.LAND"
  };

  public query func dripsBurnedCount() : async Nat {
    dripsBurned
  };

  public query func totalSupply() : async Nat {
    allItems.size()
  };

  public query({caller}) func userTokens(user: ?Principal) : async [Nat32] {
    inventoryOf(Option.get(user, caller))
  };

  public query func ownerOf(ids: [Nat32]) : async [?Principal] {
    Array.map<Nat32, ?Principal>(ids, func (i) {
      switch (allItems.get(i)) {
        case (?{owner}) { ?owner };
        case _ { null }
      }
    })
  };

  public query func dataOf(ids: [Nat32]) : async [?T.Item] {
    Array.map<Nat32, ?T.Item>(ids, func (i) { allItems.get(i) })
  };

  /* Serve svg */
  public query func http_request(req: Http.HttpRequest): async (Http.HttpResponse) {
    let path = Http.removeQuery(req.url);

    switch (Text.stripStart(path, #char('/'))) {
      case (?token_id) {
        try {
          let idx = Nat32Helper.fromText(token_id);
          switch (allItems.get(idx)) {
            case (?item) {
              let children = Array.mapFilter<Nat32, T.Item>(item.children, func (id) {
                allItems.get(id)
              });
              return Http.svg(Svg.renderItemWithChildren(item, children))
            };
            case _ {}
          }
        } catch (err) {}
      };
      case _ {}
    };

    {
      body = Text.encodeUtf8("Not found: " # path);
      headers = [];
      status_code = 404;
      streaming_strategy = null;
    };
  };

  public query({caller}) func playerData(user: ?Principal): async ?T.PlayerData {
    ledger.get(Option.get(user, caller))
  };

  // ---- Updates

  /*
    Equip an Item
  */
  public shared({caller}) func equip(ids: [Nat32]) : async Result.Result<(), Text> {
    // TODO
    #ok()
  };

  /*
    Create a new item from a set of items.
    Items cannot already be part of another bundle.
    Bundles can contain other bundles.
  */
  public shared({caller}) func bundle(request: T.BundleRequest) : async Result.Result<Nat32, Text> {
    let uniqueIds = uniq(request.ids);
    if (uniqueIds.size() < 2) {
      return #err("Bundle must include 2 or more items!");
    };

    let inventory = inventoryOf(caller);

    let children = Array.mapFilter<Nat32, (Nat32, T.Item)>(uniqueIds, func (id) {
      switch (allItems.get(id), Array.find<Nat32>(inventory, func (i) { i == id })) {
        case (?item, ?_) {
          assert(Option.isNull(item.childOf));
          ?(id, item)
        };
        case _ {
          assert(false);
          null
        }
      }
    });

    // Create new item
    let newId = nextItemId;
    allItems.put(newId, {
      id = newId;
      name = request.name;
      owner = caller;
      properties = [];
      children = uniqueIds;
      childOf = null;
      state = null;
      dripProperties = null;
    });

    // Add to owner ledger
    updateInventory(caller, Array.append(
      Array.filter<Nat32>(inventory, func (i) { not Nat32Helper.contains(uniqueIds, i) }),
      [newId]
    ));

    // Transfer children to self and point to parent
    for ((id, item) in children.vals()) {
      allItems.put(id, {
        id = item.id;
        name = item.name;
        owner = thisPrincipal();
        properties = item.properties;
        children = item.children;
        childOf = ?newId;
        state = null;
        dripProperties = null;
      })
    };

    nextItemId += 1;

    #ok(newId)
  };

  /*
    Destroy a bundle for its constituents
  */
  public shared({caller}) func unbundle(id: Nat32) : async Result.Result<[Nat32], Text> {
    let inventory = inventoryOf(caller);

    if (Array.find<Nat32>(inventory, func (i) { i == id }) == null) {
      return #err("Token " # Nat32.toText(id) # " not found!")
    };
    switch (allItems.get(id)) {
      case (?parent) {
        switch (parent.childOf) {
          case (?parentId) {
            return #err("Token " # Nat32.toText(id) # " is part of " # Nat32.toText(parentId) # ", cannot unbundle!");
          };
          case _ {}
        };
        if (parent.children.size() == 0) {
          return #err("Token " # Nat32.toText(id) # " is not a bundle!");
        };

        // Set children free
        let childrenIds = Array.mapFilter<Nat32, Nat32>(parent.children, func(id) {
          do ? {
            // Why would child not exist?
            let item = allItems.get(id)!;
            allItems.put(id, {
              id = item.id;
              name = item.name;
              owner = caller;
              properties = item.properties;
              children = item.children;
              childOf = null;
              state = null;
              dripProperties = null;
            });
            id
          };
        });

        // Delete parent forever
        ignore allItems.remove(id);

        // Add to owner ledger
        updateInventory(caller, Array.append(
          Array.filter<Nat32>(inventory, func (i) { i != id }),
          childrenIds
        ));
        #ok(childrenIds)
      };
      case _ {
        #err("Token " # Nat32.toText(id) # " not found!")
      }
    };
  };

  public shared({caller}) func transferTo(receiver: Principal, id: Nat32, notify: ?Bool) : async Result.Result<(), Text> {
    let senderInventory = inventoryOf(caller);

    switch (allItems.get(id), Array.find<Nat32>(senderInventory, func (i) { i == id })) {
      case (?item, ?_) {
        switch (item.childOf) {
          case (?parentId) {
            return #err("Token " # Nat32.toText(id) # " is part of " # Nat32.toText(parentId) # ", cannot unbundle!");
          };
          case _ {}
        };

        // Move to receiver ledger
        let receiverInventory = inventoryOf(receiver);
        updateInventory(caller, Array.filter<Nat32>(senderInventory, func (i) { i != id }));
        updateInventory(receiver, Array.append(receiverInventory, [id]));

        // Set new owner
        allItems.put(id, {
          id = item.id;
          name = item.name;
          owner = receiver;
          properties = item.properties;
          children = item.children;
          childOf = item.childOf;
          state = null;
          dripProperties = null;
        });

        if (notify == ?true) {
          let ns : T.NotifyService = actor(Principal.toText(receiver));
          try {
            let r = await ns.transfer_notification({
              to = receiver;
              token_id = id;
              from = caller;
              amount = 1;
            });
            if (Option.isNull(r)) {
              // Not notified!
              return #err("Notification rejected!")
            };
          } catch (error) {
            return #err("Failed to notify!")
          };
        };

        #ok()
      };
      case _ {
        #err("Token " # Nat32.toText(id) # " not found!")
      }
    }
  };

  // Notified by drip
  public shared({ caller }) func transfer_notification({to; from; token_id; amount}: Drip.TransferNotification): async Result.Result<(), Text> {
    Debug.print("transfer_notification " # debug_show({to; from; token_id; amount}));
    assert(caller == Principal.fromActor(drip) and to == thisPrincipal());

    // Fetch data
    let data = await drip.data_of(token_id);

    let memo = "equip";
    switch(memo) {
      case "unbundle" {
        // Create constituents
        let count = data.size();
        let idx = nextItemId;
        let newItemIds = Array.tabulate<Nat32>(count, func (i) {
          let id = Nat32.fromNat(i) + idx;
          let item = {
            id = id;
            name = data[i].name;
            owner = from;
            properties = [{
              name = "slot";
              value = #Text(switch (data[i].slot) {
                case "weapon" { "hand" };
                case t { t };
              });
            }, {
              name = "prefix";
              value = #Text(data[i].prefix);
            }, {
              name = "name_prefix";
              value = #Text(data[i].name_prefix);
            }, {
              name = "name_suffix";
              value = #Text(data[i].name_suffix);
            }, {
              name = "special";
              value = #Bool(data[i].special);
            }];
            children = [];
            childOf = null;
            state = null;
            dripProperties = null;
          };
          allItems.put(id, item);
          id
        });

        nextItemId += Nat32.fromNat(count);

        // Add to item ledger
        let newId = nextItemId;
        allItems.put(newId, {
          id = newId;
          dripProperties = ?{
            id = Nat32.fromNat(Nat64.toNat(token_id));
            isBurned = true;
          };
          name = "Drip " # Nat64.toText(token_id);
          owner = thisPrincipal();
          properties = [];
          children = newItemIds;
          childOf = null;
          state = null;
        });
        nextItemId += 1;
        dripsBurned += 1;

        // Add to receiver ledger
        let receiverInventory = inventoryOf(from);
        updateInventory(from, Array.append(receiverInventory, newItemIds));
      };
      case "equip" {
        // Add to item ledger
        let newId = nextItemId;
        allItems.put(newId, {
          id = newId;
          dripProperties = ?{
            id = Nat32.fromNat(Nat64.toNat(token_id));
            isBurned = false;
          };
          name = "Drip " # Nat64.toText(token_id);
          owner = from;
          properties = [];
          children = [];
          childOf = null;
          state = null;
        });
        nextItemId += 1;

        // Add to receiver ledger
        let playerData = Option.get(ledger.get(from), {
          name = "";
          equipped = #bundle(?newId);
          inventory = [];
          status = [];
        });
        ledger.put(from, {
          name = playerData.name;
          equipped = playerData.equipped;
          status = playerData.status;
          inventory = Array.append(playerData.inventory, [newId])
        });
      };
      case _ {
        return #err("Invalid memo");
      }
    };

    #ok(())
  };


  // ---- System

  system func preupgrade() {
    ledgerEntries := Iter.toArray(ledger.entries());
    allItemEntries := Iter.toArray(allItems.entries());
  };

  system func postupgrade() {
    ledger := HashMap.fromIter<Principal, T.PlayerData>(ledgerEntries.vals(), ledgerEntries.size(), Principal.equal, Principal.hash);
    allItems := HashMap.fromIter<Nat32, T.Item>(allItemEntries.vals(), allItemEntries.size(), Nat32.equal, Nat32Helper.id);
  };


  // ---- Helpers

  func thisPrincipal(): Principal { Principal.fromActor(this) };

  func uniq(ids: [Nat32]): [Nat32] {
    TrieSet.toArray(TrieSet.fromArray(ids, Nat32Helper.id, Nat32.equal))
  };

  func inventoryOf(user: Principal): [Nat32] {
    switch (ledger.get(user)) {
      case (?{inventory}) { inventory };
      case _ { [] }
    }
  };

  func updateInventory(user: Principal, inventory: [Nat32]): () {
    let data = Option.get(ledger.get(user), {
      name = "";
      equipped = #bundle(null);
      inventory = [];
      status = [];
    });
    ledger.put(user, {
      name = data.name;
      equipped = data.equipped;
      status = data.status;
      inventory = inventory
    });
  };
};
