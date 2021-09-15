import { Item } from "../declarations/Bag/Bag.did";
import { LootData } from "../declarations/Drip/Drip.did";

export type Modify<T, R> = Omit<T, keyof R> & R;
export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type TypedItem = Item & {
  type: "Drip" | "Bag";
  extWrapped?: boolean;
  lootData?: LootData[];
};
