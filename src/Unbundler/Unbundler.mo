import Array "mo:base/Array";
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
  let drip : Drip.Self = actor "d3ttm-qaaaa-aaaai-qam4a-cai";


  // ---- State
  var ledger: T.PrincipalToIds = HashMap.HashMap<Principal, [Nat64]>(1, Principal.equal, Principal.hash);
  stable var ledgerEntries: [T.PrincipalToIdsEntry] = [];
  stable var allItems: [T.Item] = [];


  // ---- Queries

  public query func name() : async Text {
    "IC_DRIP Item"
  };

  public query func symbol() : async Text {
    "IC_DRIP_ITEM"
  };

  public query func total_supply() : async Nat {
    allItems.size()
  };

  public query func user_tokens(user: Principal) : async [Nat64] {
    Option.get(ledger.get(user), [])
  };

  public query func owner_of(id: Nat64) : async (?Principal) {
    ?allItems[Nat64.toNat(id)].owner
  };

  public query func data_of(id: Nat64) : async T.Item {
    allItems[Nat64.toNat(id)]
  };


  // ---- Updates

  public shared({caller}) func transfer_to(receiver: Principal, id: Nat64) : async Bool {
    let senderIds = Option.get(ledger.get(receiver), []);

    switch (Array.find<Nat64>(senderIds, func (i) { i == id })) {
      case (?found) {
        let receiverIds = Option.get(ledger.get(receiver), []);
        ledger.put(caller, Array.filter<Nat64>(senderIds, func (i) { i != id }));
        ledger.put(receiver, Array.append(receiverIds, [id]));
        true
      };
      case _ {
        false;
      }
    }
  };

  public shared({ caller }) func unbundle(id: Nat64): async Result.Result<(), Text> {
    let drips = await drip.user_tokens(caller);
    switch (Array.find<Nat64>(drips, func (i) { i == id })) {
      case (?found) {
        let data = await drip.get_token_properties(id);
        if (not (await drip.transfer_to(Principal.fromText("aaaaa-aa"), id))) {
          return #err("Burn failed!");
        };
        let idx = data.size();
        allItems := Array.append(allItems, Array.tabulate<T.Item>(data.size(), func (i) {
          {
            id = Nat64.fromNat(i + idx);
            name = data[i].1;
            owner = caller;
            properties = [{
              name = "slot";
              value = data[i].0;
            }]
          }
        }));

        #ok(())
      };
      case _ {
        #err("Token " # Nat64.toText(id) # " not found!")
      }
    }
  };


  // ---- System

  system func preupgrade() {
    ledgerEntries := Iter.toArray(ledger.entries());
  };

  system func postupgrade() {
    ledger := HashMap.fromIter<Principal, [Nat64]>(ledgerEntries.vals(), ledgerEntries.size(), Principal.equal, Principal.hash);
  };
};
