import type { Principal } from '@dfinity/principal';
export interface Item {
  'id' : bigint,
  'owner' : Principal,
  'name' : string,
  'properties' : Array<Property>,
}
export interface Property {
  'value' : { 'Int' : bigint } |
    { 'Bool' : boolean } |
    { 'Text' : string },
  'name' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export interface TransferNotification {
  'to' : Principal,
  'token_id' : bigint,
  'from' : Principal,
  'amount' : bigint,
}
export interface Unbundler {
  'data_of' : (arg_0: Array<bigint>) => Promise<Array<Item>>,
  'drips_burned_count' : () => Promise<bigint>,
  'name' : () => Promise<string>,
  'owner_of' : (arg_0: Array<bigint>) => Promise<Array<Principal>>,
  'symbol' : () => Promise<string>,
  'total_supply' : () => Promise<bigint>,
  'transfer_notification' : (arg_0: TransferNotification) => Promise<Result>,
  'transfer_to' : (
      arg_0: Principal,
      arg_1: bigint,
      arg_2: [] | [boolean],
    ) => Promise<boolean>,
  'user_tokens' : (arg_0: [] | [Principal]) => Promise<Array<bigint>>,
}
export interface _SERVICE extends Unbundler {}
