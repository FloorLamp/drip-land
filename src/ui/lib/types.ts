import { ActorSubclass } from "@dfinity/agent";
import Bag, { Item } from "../declarations/Bag/Bag.did";
import Drip from "../declarations/Drip/Drip.did";

export type Modify<T, R> = Omit<T, keyof R> & R;
export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type BagService = ActorSubclass<Bag._SERVICE>;
export type DripService = ActorSubclass<Drip>;

export type TypedItem = Item & {
  type: "Drip" | "Bag";
};
