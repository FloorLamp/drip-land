import type { Principal } from '@dfinity/principal';
export interface Item {
  'id' : bigint,
  'owner' : Principal,
  'name' : string,
  'properties' : Array<Property>,
}
export interface Property { 'value' : string, 'name' : string }
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface Unbundler {
  'data_of' : (arg_0: bigint) => Promise<Item>,
  'name' : () => Promise<string>,
  'owner_of' : (arg_0: bigint) => Promise<[] | [Principal]>,
  'symbol' : () => Promise<string>,
  'total_supply' : () => Promise<bigint>,
  'transfer_to' : (arg_0: Principal, arg_1: bigint) => Promise<boolean>,
  'unbundle' : (arg_0: bigint) => Promise<Result>,
  'user_tokens' : (arg_0: Principal) => Promise<Array<bigint>>,
}
export interface _SERVICE extends Unbundler {}
