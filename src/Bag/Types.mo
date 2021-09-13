import HashMap "mo:base/HashMap";

module {
  public type Item = {
    id: Nat32;
    owner: Principal;
    name: Text;
    properties: [Property];
    children: [Nat32];
    childOf: ?Nat32;
  };

  public type Property = {
    name: Text;
    value: {
      #Text: Text;
      #Bool: Bool;
      #Int: Int64;
    };
  };

  public type PrincipalToIdsEntry = (Principal, [Nat32]);
  public type PrincipalToIds = HashMap.HashMap<Principal, [Nat32]>;

  public type IdsToItemEntry = (Nat32, Item);
  public type IdsToItem = HashMap.HashMap<Nat32, Item>;

  public type BundleRequest = {
    ids: [Nat32];
    name: Text;
  };

  public type NotifyService = actor { transfer_notification : shared {
    to : Principal;
    token_id : Nat32;
    from : Principal;
    amount : Nat32;
  } -> async ?Nat32};
};
