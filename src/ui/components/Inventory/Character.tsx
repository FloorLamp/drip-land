import classNames from "classnames";
import { useAtom } from "jotai";
import React from "react";
import { playerAtom } from "../../atoms/playerAtom";
import { useDripData } from "../../lib/hooks/useDripData";
import { useItemData } from "../../lib/hooks/useItemData";
import { useUnequip } from "../../lib/hooks/useUnequip";
import { TypedItem } from "../../lib/types";
import SpinnerButton from "../Buttons/SpinnerButton";

type Slots = {
  accessory: ItemWithProperties | null;
  foot: ItemWithProperties | null;
  hand: ItemWithProperties | null;
  head: ItemWithProperties | null;
  pants: ItemWithProperties | null;
  chest: ItemWithProperties | null;
  underwear: ItemWithProperties | null;
  waist: ItemWithProperties | null;
};
type ItemWithProperties = {
  id?: number;
  name: string;
  name_prefix: string;
  name_suffix: string;
  prefix: string;
  slot: string;
  special: boolean;
};

const slotsFromItems = (items: TypedItem[]): Slots => {
  const slots = {
    accessory: null,
    chest: null,
    foot: null,
    hand: null,
    head: null,
    pants: null,
    underwear: null,
    waist: null,
  };
  if (items.length === 1) {
    if (items[0].type === "Drip") {
      slots.accessory = items[0].lootData.find(
        ({ slot }) => slot === "accessory"
      );
      slots.chest = items[0].lootData.find(({ slot }) => slot === "chest");
      slots.foot = items[0].lootData.find(({ slot }) => slot === "foot");
      slots.hand = items[0].lootData.find(({ slot }) => slot === "weapon");
      slots.head = items[0].lootData.find(({ slot }) => slot === "head");
      slots.pants = items[0].lootData.find(({ slot }) => slot === "pants");
      slots.underwear = items[0].lootData.find(
        ({ slot }) => slot === "underwear"
      );
      slots.waist = items[0].lootData.find(({ slot }) => slot === "waist");
    }
  }
  return slots;
};

export function Character() {
  console.log("render Character");

  const [playerData] = useAtom(playerAtom);
  console.log({ playerData });

  const equippedItemIds =
    playerData && "items" in playerData.equipped
      ? Object.values(playerData.equipped.items)
          .filter(([id]) => !!id)
          .flat()
      : [];
  const equippedBundleIds =
    playerData && "bundle" in playerData.equipped
      ? playerData.equipped.bundle
      : [];
  const equippedItemData = useItemData(equippedItemIds);
  const equippedBundleData = useItemData(equippedBundleIds);
  const equippedDripData = useDripData(
    equippedBundleData.data && equippedBundleData.data[0]?.dripProperties[0]
      ? [equippedBundleData.data[0].dripProperties[0].id]
      : []
  );

  const unequip = useUnequip();
  const slots = slotsFromItems(
    (equippedItemData.data ?? [])
      .concat(
        equippedDripData.data
          ? equippedDripData.data
          : equippedBundleData.data ?? []
      )
      .filter(Boolean)
  );

  return (
    <div className="">
      {/* <div className="w-24 h-24 bg-black flex items-center justify-center">
        <h1 className="text-3xl text-center">🤠</h1>
      </div> */}
      <div className="flex gap-2">
        <div className="relative w-20 h-24 mt-24 border-2 border-black">
          <div className="absolute bg-black opacity-10 w-full h-full" />
          {slots.hand ? (
            <div
              className={classNames("text-xs uppercase", {
                "bg-drip-pink-800": slots.hand.special,
              })}
            >
              {slots.hand.name}
            </div>
          ) : (
            <div className="opacity-70 flex items-center justify-center h-full">
              👋
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 w-20">
          <div className="relative h-12 border-2 border-black">
            <div className="absolute bg-black opacity-10 w-full h-full" />
            {slots.head ? (
              <div
                className={classNames("text-xs uppercase", {
                  "bg-drip-pink-800": slots.head.special,
                })}
              >
                {slots.head.name}
              </div>
            ) : (
              <div className="opacity-70 flex items-center justify-center h-full">
                🧢
              </div>
            )}
          </div>
          <div className="relative h-16 border-2 border-black">
            <div className="absolute bg-black opacity-10 w-full h-full" />
            {slots.chest ? (
              <div
                className={classNames("text-xs uppercase", {
                  "bg-drip-pink-800": slots.chest.special,
                })}
              >
                {slots.chest.name}
              </div>
            ) : (
              <div className="opacity-70 flex items-center justify-center h-full">
                👕
              </div>
            )}
          </div>
          <div className="relative h-5 border-2 border-black">
            <div className="absolute bg-black opacity-10 w-full h-full" />
            {slots.waist ? (
              <div
                className={classNames("text-xs uppercase", {
                  "bg-drip-pink-800": slots.waist.special,
                })}
              >
                {slots.waist.name}
              </div>
            ) : (
              <div className="opacity-70 flex items-center justify-center h-full">
                🪢
              </div>
            )}
          </div>
          <div className="relative h-8 border-2 border-black">
            <div className="absolute bg-black opacity-10 w-full h-full" />
            {slots.underwear ? (
              <div
                className={classNames("text-xs uppercase", {
                  "bg-drip-pink-800": slots.underwear.special,
                })}
              >
                {slots.underwear.name}
              </div>
            ) : (
              <div className="opacity-70 flex items-center justify-center h-full">
                🩲
              </div>
            )}
          </div>
          <div className="relative h-16 border-2 border-black">
            <div className="absolute bg-black opacity-10 w-full h-full" />
            {slots.pants ? (
              <div
                className={classNames("text-xs uppercase", {
                  "bg-drip-pink-800": slots.pants.special,
                })}
              >
                {slots.pants.name}
              </div>
            ) : (
              <div className="opacity-70 flex items-center justify-center h-full">
                👖
              </div>
            )}
          </div>
          <div className="relative h-12 border-2 border-black">
            <div className="absolute bg-black opacity-10 w-full h-full" />
            {slots.foot ? (
              <div
                className={classNames("text-xs uppercase", {
                  "bg-drip-pink-800": slots.foot.special,
                })}
              >
                {slots.foot.name}
              </div>
            ) : (
              <div className="opacity-70 flex items-center justify-center h-full">
                👟
              </div>
            )}
          </div>
        </div>
      </div>
      <h2 className="font-bold mt-4"></h2>

      <div className="border-t border-drip-purple-500 mt-4 pt-4 pb-2">
        <ul className="flex flex-row-wrap gap-2">
          {equippedBundleData.data?.length > 0 && (
            <li>
              <SpinnerButton
                className="w-28 py-2"
                onClick={() => unequip.mutate(equippedBundleData.data[0])}
                isLoading={unequip.isLoading}
              >
                Unequip All
              </SpinnerButton>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
