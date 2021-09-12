import Array "mo:base/Array";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Nat64 "mo:base/Nat64";
import Result "mo:base/Result";
import Time "mo:base/Time";

import Drip "./DripTypes";
import T "./Types";

shared actor class Unbundler() = this {
  // ---- Constants
  let drip : Drip.Self = actor "prees-saaaa-aaaai-qanqa-cai";


  // ---- State
  var ledger: T.PrincipalToIds = HashMap.HashMap<Principal, [Nat64]>(1, Principal.equal, Principal.hash);
  stable var ledgerEntries: [T.PrincipalToIdsEntry] = [];
  stable var allItems: [T.Item] = [];
  stable var dripsBurned: [Nat64] = [];


  // ---- Queries

  public query func name() : async Text {
    "IC_DRIP Item"
  };

  public query func symbol() : async Text {
    "IC_DRIP_ITEM"
  };

  public query func drips_burned_count() : async Nat {
    dripsBurned.size()
  };

  public query func total_supply() : async Nat {
    allItems.size()
  };

  public query({caller}) func user_tokens(user: ?Principal) : async [Nat64] {
    Option.get(ledger.get(caller), [])
  };

  public query func owner_of(ids: [Nat64]) : async [Principal] {
    Array.map<Nat64, Principal>(ids, func (i) { allItems[Nat64.toNat(i)].owner })
  };

  public query func data_of(ids: [Nat64]) : async [T.Item] {
    Array.map<Nat64, T.Item>(ids, func (i) { allItems[Nat64.toNat(i)] })
  };


  // ---- Updates

  public shared({caller}) func transfer_to(receiver: Principal, id: Nat64, notify: ?Bool) : async Bool {
    let senderTokenIds = Option.get(ledger.get(caller), []);

    switch (Array.find<Nat64>(senderTokenIds, func (i) { i == id })) {
      case (?found) {
        let receiverTokenIds = Option.get(ledger.get(receiver), []);
        ledger.put(caller, Array.filter<Nat64>(senderTokenIds, func (i) { i != id }));
        ledger.put(receiver, Array.append(receiverTokenIds, [id]));

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
              return false;
            };
          } catch (error) {
            return false;
          };
        };

        true
      };
      case _ {
        false;
      }
    }
  };

  // Notified by drip
  public shared({ caller }) func transfer_notification({to; from; token_id; amount}: Drip.TransferNotification): async Result.Result<(), Text> {
    Debug.print("transfer_notification " # debug_show({to; from; token_id; amount}));
    assert(caller == Principal.fromActor(drip) and to == Principal.fromActor(this));

    // Send to burn address
    if (not (await drip.transfer_to(Principal.fromText("aaaaa-aa"), token_id))) {
      return #err("Burn failed!");
    };

    dripsBurned := Array.append(dripsBurned, [token_id]);

    // Create new constituent items
    let data = await drip.data_of(token_id);
    let idx = allItems.size();
    let newItems = Array.tabulate<T.Item>(data.size(), func (i) {
      {
        id = Nat64.fromNat(i + idx);
        name = data[i].name;
        owner = from;
        properties = [{
          name = "slot";
          value = #Text(data[i].slot);
        }, {
          name = "name";
          value = #Text(data[i].name);
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
        }]
      }
    });
    allItems := Array.append(allItems, newItems);

    // Add to receiver ledger
    let receiverTokenIds = Option.get(ledger.get(from), []);
    ledger.put(from, Array.append(receiverTokenIds, Array.map<T.Item, Nat64>(newItems, func ({id}) { id })));

    #ok(())
  };


  // ---- System

  system func preupgrade() {
    ledgerEntries := Iter.toArray(ledger.entries());
  };

  system func postupgrade() {
    ledger := HashMap.fromIter<Principal, [Nat64]>(ledgerEntries.vals(), ledgerEntries.size(), Principal.equal, Principal.hash);
  };
};
