import HashMap "mo:base/HashMap";

module {
  public type Item = {
    id: Nat64;
    owner: Principal;
    name: Text;
    properties: [Property];
  };

  public type Property = {
    name: Text;
    value: {
      #Text: Text;
      #Bool: Bool;
      #Int: Int64;
    };
  };

  public type PrincipalToIdsEntry = (Principal, [Nat64]);
  public type PrincipalToIds = HashMap.HashMap<Principal, [Nat64]>;

  public type NotifyService = actor { transfer_notification : shared {
    to : Principal;
    token_id : Nat64;
    from : Principal;
    amount : Nat64;
  } -> async ?Nat64};
};
