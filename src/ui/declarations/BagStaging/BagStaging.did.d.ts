import type { Principal } from '@dfinity/principal';
export interface Bag {
  'bundle' : (arg_0: BundleRequest) => Promise<Result_2>,
  'data_of' : (arg_0: Array<number>) => Promise<Array<[] | [Item]>>,
  'drips_burned_count' : () => Promise<bigint>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'name' : () => Promise<string>,
  'owner_of' : (arg_0: Array<number>) => Promise<Array<[] | [Principal]>>,
  'symbol' : () => Promise<string>,
  'total_supply' : () => Promise<bigint>,
  'transfer_notification' : (arg_0: TransferNotification) => Promise<Result_1>,
  'transfer_to' : (
      arg_0: Principal,
      arg_1: number,
      arg_2: [] | [boolean],
    ) => Promise<Result_1>,
  'unbundle' : (arg_0: number) => Promise<Result>,
  'user_tokens' : (arg_0: [] | [Principal]) => Promise<Array<number>>,
}
export interface BundleRequest { 'ids' : Array<number>, 'name' : string }
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface Item {
  'id' : number,
  'owner' : Principal,
  'name' : string,
  'properties' : Array<Property>,
  'childOf' : [] | [number],
  'children' : Array<number>,
}
export interface Property {
  'value' : { 'Int' : bigint } |
    { 'Bool' : boolean } |
    { 'Text' : string },
  'name' : string,
}
export type Result = { 'ok' : Array<number> } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = { 'ok' : number } |
  { 'err' : string };
export interface StreamingCallbackHttpResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Array<number>,
}
export interface StreamingCallbackToken {
  'key' : string,
  'sha256' : [] | [Array<number>],
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export interface TransferNotification {
  'to' : Principal,
  'token_id' : bigint,
  'from' : Principal,
  'amount' : bigint,
}
export interface _SERVICE extends Bag {}
