// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type AddressBook = {
    controllers : [Principal];
    tokens : [(Nat64, Principal)];
    claim_index : Nat64;
    token_seeds : [(Nat64, Nat64)];
    total_supply : Nat64;
  };
  public type ClaimResult = { #Ok : Nat64; #Err : Text };
  public type DataOfQuery = { #List : [Nat64]; #Range : (Nat64, Nat64) };
  public type HeaderField = (Text, Text);
  public type HttpRequest = {
    url : Text;
    method : Text;
    body : [Nat8];
    headers : [HeaderField];
  };
  public type HttpResponse = {
    body : [Nat8];
    headers : [HeaderField];
    status_code : Nat16;
  };
  public type LootData = {
    name : Text;
    slot : Text;
    name_suffix : Text;
    prefix : Text;
    name_prefix : Text;
    special : Bool;
  };
  public type TransferNotification = {
    to : Principal;
    token_id : Nat64;
    from : Principal;
    amount : Nat64;
    memo : Blob;
  };
  public type Self = actor {
    add_airdrops : shared [Principal] -> async Bool;
    add_controller : shared Principal -> async Bool;
    claim : shared () -> async ClaimResult;
    data_of : shared query Nat64 -> async [LootData];
    data_of_many : shared query DataOfQuery -> async [(Nat64, [LootData])];
    get_address_book : shared query () -> async AddressBook;
    get_airdrops : shared query () -> async [(Nat64, Bool)];
    get_controllers : shared query () -> async [Principal];
    get_cycles : shared () -> async Int64;
    get_token_properties : shared query Nat64 -> async [(Text, Text)];
    get_token_properties_range : shared query (Nat64, Nat64) -> async [
        [(Text, Text)]
      ];
    http_request : shared query HttpRequest -> async HttpResponse;
    name : shared query () -> async Text;
    owner_of : shared query Nat64 -> async ?Principal;
    remaining : shared () -> async Nat64;
    remove_controller : shared Principal -> async Bool;
    supply : shared () -> async Nat64;
    symbol : shared query () -> async Text;
    transfer_to : shared (Principal, Nat64) -> async Bool;
    transfer_with_notify : shared (Principal, Nat64) -> async Bool;
    user_tokens : shared query Principal -> async [Nat64];
  }
}
