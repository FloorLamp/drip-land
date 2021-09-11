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
    value: Text;
  };

  public type PrincipalToIdsEntry = (Principal, [Nat64]);
  public type PrincipalToIds = HashMap.HashMap<Principal, [Nat64]>;
};
