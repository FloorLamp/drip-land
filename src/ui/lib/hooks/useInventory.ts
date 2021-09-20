import { useAtom } from "jotai";
import { useQuery } from "react-query";
import { actorsAtom, principalAtom } from "../../atoms/actorsAtom";
import { firstAccountOfPrincipal } from "../accounts";
import { ONE_MINUTES_MS } from "../constants";
import { TypedItem } from "../types";
import { usePlayerData } from "./usePlayerData";
import { useReclaim } from "./useReclaim";

export const useInventory = () => {
  const [principal] = useAtom(principalAtom);
  const [{ drip, bag, wrapper }] = useAtom(actorsAtom);
  const playerData = usePlayerData();
  const reclaim = useReclaim();

  return useQuery(
    "inventory",
    async () => {
      const [dripTokens, wrappedTokens] = await Promise.all([
        drip.user_tokens(principal),
        process.env.NEXT_PUBLIC_DFX_NETWORK !== "local" &&
          process.env.NEXT_PUBLIC_DFX_NETWORK !== "staging" &&
          wrapper.tokens(firstAccountOfPrincipal(principal)),
      ]);
      const wrappedTokenIds =
        wrappedTokens && "ok" in wrappedTokens ? wrappedTokens.ok : [];

      const [rawDripItems, rawBagItems] = await Promise.all([
        drip.data_of_many({
          List: dripTokens.concat(wrappedTokenIds.map(BigInt)),
        }),
        bag.dataOf(playerData.data?.inventory ?? []),
      ]);
      console.log({ rawDripItems, rawBagItems });

      if (
        rawBagItems.find(([item]) => item?.dripProperties[0] && !item.state[0])
      ) {
        reclaim.mutate();
      }

      const dripItems: TypedItem[] = rawDripItems.map(([id_, data]) => {
        const id = Number(id_);
        return {
          id,
          type: "Drip",
          owner: principal,
          name: `Drip ${id}`,
          properties: [],
          children: [],
          childOf: [],
          lootData: data,
          extWrapped: wrappedTokenIds.includes(id),
          state: [],
          dripProperties: [],
        };
      });
      const bagItems = rawBagItems
        .map((item, i) => {
          if (!item[0]) {
            console.error(`bag: missing item ${playerData.data.inventory[i]}`);
            return false;
          }

          return { ...item[0], type: "Bag" };
        })
        .filter(Boolean) as TypedItem[];
      return dripItems.concat(bagItems);
    },
    {
      enabled: !!principal && !principal.isAnonymous() && playerData.isSuccess,
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
