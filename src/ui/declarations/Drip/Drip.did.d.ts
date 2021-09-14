import type { Principal } from "@dfinity/agent";
export interface AddressBook {
  controllers: Array<Principal>;
  tokens: Array<[bigint, Principal]>;
  claim_index: bigint;
  token_seeds: Array<[bigint, bigint]>;
  total_supply: bigint;
}
export type ClaimResult = { Ok: bigint } | { Err: string };
export type DataOfQuery = { List: Array<bigint> } | { Range: [bigint, bigint] };
export type HeaderField = [string, string];
export interface HttpRequest {
  url: string;
  method: string;
  body: Array<number>;
  headers: Array<HeaderField>;
}
export interface HttpResponse {
  body: Array<number>;
  headers: Array<HeaderField>;
  status_code: number;
}
export interface LootData {
  name: string;
  slot: string;
  name_suffix: string;
  prefix: string;
  name_prefix: string;
  special: boolean;
}
export interface TransferNotification {
  to: Principal;
  token_id: bigint;
  from: Principal;
  amount: bigint;
}
export default interface _SERVICE {
  add_airdrops: (arg_0: Array<Principal>) => Promise<boolean>;
  add_controller: (arg_0: Principal) => Promise<boolean>;
  claim: () => Promise<ClaimResult>;
  data_of: (arg_0: bigint) => Promise<Array<LootData>>;
  data_of_many: (
    arg_0: DataOfQuery
  ) => Promise<Array<[bigint, Array<LootData>]>>;
  get_address_book: () => Promise<AddressBook>;
  get_airdrops: () => Promise<Array<[bigint, boolean]>>;
  get_controllers: () => Promise<Array<Principal>>;
  get_cycles: () => Promise<bigint>;
  get_token_properties: (arg_0: bigint) => Promise<Array<[string, string]>>;
  get_token_properties_range: (
    arg_0: bigint,
    arg_1: bigint
  ) => Promise<Array<Array<[string, string]>>>;
  http_request: (arg_0: HttpRequest) => Promise<HttpResponse>;
  name: () => Promise<string>;
  owner_of: (arg_0: bigint) => Promise<[] | [Principal]>;
  remaining: () => Promise<bigint>;
  remove_controller: (arg_0: Principal) => Promise<boolean>;
  supply: () => Promise<bigint>;
  symbol: () => Promise<string>;
  transfer_to: (arg_0: Principal, arg_1: bigint) => Promise<boolean>;
  transfer_with_notify: (arg_0: Principal, arg_1: bigint) => Promise<boolean>;
  user_tokens: (arg_0: Principal) => Promise<Array<bigint>>;
}
