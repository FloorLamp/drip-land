import type { Principal } from "@dfinity/agent";
export type AccountIdentifier = AccountIdentifier_2;
export type AccountIdentifier_2 = string;
export type AccountIdentifier_3 = AccountIdentifier;
export type Balance = bigint;
export type BalanceRequest = BalanceRequest_2;
export interface BalanceRequest_2 {
  token: TokenIdentifier_2;
  user: User;
}
export type BalanceResponse = BalanceResponse_2;
export type BalanceResponse_2 = Result_9;
export type Balance_2 = Balance;
export type CommonError = CommonError_2;
export type CommonError_2 =
  | { InvalidToken: TokenIdentifier_2 }
  | { Other: string };
export type Extension = Extension_2;
export type Extension_2 = string;
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
export interface ListRequest {
  token: TokenIdentifier;
  from_subaccount: [] | [SubAccount];
  price: [] | [bigint];
}
export interface Listing {
  locked: [] | [Time];
  seller: Principal;
  price: bigint;
}
export type Memo = Array<number>;
export type Metadata = Metadata_2;
export type Metadata_2 =
  | {
      fungible: {
        decimals: number;
        metadata: [] | [Array<number>];
        name: string;
        symbol: string;
      };
    }
  | { nonfungible: { metadata: [] | [Array<number>] } };
export type Result =
  | { ok: Balance }
  | {
      err:
        | { CannotNotify: AccountIdentifier }
        | { InsufficientBalance: null }
        | { InvalidToken: TokenIdentifier_2 }
        | { Rejected: null }
        | { Unauthorized: AccountIdentifier }
        | { Other: string };
    };
export type Result_2 =
  | {
      ok: Array<[TokenIndex, [] | [Listing], [] | [Array<number>]]>;
    }
  | { err: CommonError };
export type Result_3 = { ok: Array<TokenIndex> } | { err: CommonError };
export type Result_4 = { ok: Balance_2 } | { err: CommonError };
export type Result_5 = { ok: null } | { err: CommonError };
export type Result_6 = { ok: Metadata } | { err: CommonError };
export type Result_7 = { ok: AccountIdentifier_3 } | { err: CommonError };
export type Result_8 =
  | { ok: [AccountIdentifier_3, [] | [Listing]] }
  | { err: CommonError };
export type Result_9 = { ok: Balance } | { err: CommonError_2 };
export interface Settlement {
  subaccount: SubAccount;
  seller: Principal;
  buyer: AccountIdentifier_3;
  price: bigint;
}
export type SubAccount = SubAccount_2;
export type SubAccount_2 = SubAccount_3;
export type SubAccount_3 = Array<number>;
export type Time = Time_2;
export type Time_2 = bigint;
export type TokenIdentifier = TokenIdentifier_2;
export type TokenIdentifier_2 = string;
export type TokenIndex = TokenIndex_2;
export type TokenIndex_2 = number;
export interface Transaction {
  token: TokenIdentifier;
  time: Time;
  seller: Principal;
  buyer: AccountIdentifier_3;
  price: bigint;
}
export type TransferRequest = TransferRequest_2;
export interface TransferRequest_2 {
  to: User;
  token: TokenIdentifier_2;
  notify: boolean;
  from: User;
  memo: Memo;
  subaccount: [] | [SubAccount_2];
  amount: Balance;
}
export type TransferResponse = TransferResponse_2;
export type TransferResponse_2 = Result;
export type User = { principal: Principal } | { address: AccountIdentifier };
export default interface _SERVICE {
  TEMPaddPayment: (
    arg_0: string,
    arg_1: Principal,
    arg_2: SubAccount
  ) => Promise<undefined>;
  TEMPusedAddresses: (
    arg_0: string
  ) => Promise<Array<[AccountIdentifier_3, Principal, SubAccount]>>;
  acceptCycles: () => Promise<undefined>;
  allPayments: () => Promise<Array<[Principal, Array<SubAccount>]>>;
  allSettlements: () => Promise<Array<[TokenIndex, Settlement]>>;
  availableCycles: () => Promise<bigint>;
  balance: (arg_0: BalanceRequest) => Promise<BalanceResponse>;
  bearer: (arg_0: TokenIdentifier) => Promise<Result_7>;
  checkOwnership: () => Promise<bigint>;
  clearPayments: (
    arg_0: Principal,
    arg_1: Array<SubAccount>
  ) => Promise<undefined>;
  details: (arg_0: TokenIdentifier) => Promise<Result_8>;
  extensions: () => Promise<Array<Extension>>;
  getOutstanding: () => Promise<bigint>;
  getRegistry: () => Promise<Array<[TokenIndex, AccountIdentifier_3]>>;
  getTokens: () => Promise<Array<[TokenIndex, Metadata]>>;
  getTransactions: (arg_0: [] | [bigint]) => Promise<Array<Transaction>>;
  http_request: (arg_0: HttpRequest) => Promise<HttpResponse>;
  list: (arg_0: ListRequest) => Promise<Result_5>;
  listings: () => Promise<Array<[TokenIndex, Listing, Metadata]>>;
  lock: (
    arg_0: TokenIdentifier,
    arg_1: bigint,
    arg_2: AccountIdentifier_3,
    arg_3: SubAccount
  ) => Promise<Result_7>;
  metadata: (arg_0: TokenIdentifier) => Promise<Result_6>;
  mint: (arg_0: TokenIdentifier) => Promise<boolean>;
  mintOutstanding: () => Promise<bigint>;
  payments: () => Promise<[] | [Array<SubAccount>]>;
  refunds: () => Promise<[] | [Array<SubAccount>]>;
  removePayments: (arg_0: Array<SubAccount>) => Promise<undefined>;
  removeRefunds: (arg_0: Array<SubAccount>) => Promise<undefined>;
  settle: (arg_0: TokenIdentifier) => Promise<Result_5>;
  settlements: () => Promise<Array<[TokenIndex, AccountIdentifier_3, bigint]>>;
  supply: (arg_0: TokenIdentifier) => Promise<Result_4>;
  tokens: (arg_0: AccountIdentifier_3) => Promise<Result_3>;
  tokens_ext: (arg_0: AccountIdentifier_3) => Promise<Result_2>;
  transactions: () => Promise<Array<Transaction>>;
  transfer: (arg_0: TransferRequest) => Promise<TransferResponse>;
  unwrap: (
    arg_0: TokenIdentifier,
    arg_1: [] | [SubAccount]
  ) => Promise<boolean>;
  wrap: (arg_0: TokenIdentifier) => Promise<boolean>;
}
