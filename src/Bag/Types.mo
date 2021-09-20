import HashMap "mo:base/HashMap";

module {
  public type PlayerData = {
    name: Text;
    inventory: [Nat32];
    equipped: {
      #bundle: ?Nat32;
      #items: {
        hand: ?Nat32;
        chest: ?Nat32;
        head: ?Nat32;
        waist: ?Nat32;
        foot: ?Nat32;
        pants: ?Nat32;
        underwear: ?Nat32;
        accessory: ?Nat32;
      };
    };
    status: [PlayerStatus];
  };

  public type PlayerStatus = {};

  public type ItemState = {
    #equipped;
  };

  // Represents any drip.land item, including Drips
  public type Item = {
    id: Nat32;
    dripProperties: ?{
      id: Nat32;
      isBurned: Bool;
    };
    owner: Principal;
    name: Text;
    state: ?ItemState;
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

  public type PrincipalToPlayerDataEntry = (Principal, PlayerData);
  public type PrincipalToPlayerData = HashMap.HashMap<Principal, PlayerData>;

  public type IdsToItemEntry = (Nat32, Item);
  public type IdsToItem = HashMap.HashMap<Nat32, Item>;

  public type EquipRequest = {
    #ids: [Nat32];
    #drip: Nat64;
  };
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
