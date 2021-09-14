import { useQuery } from "react-query";
import {
  useBag,
  useDrip,
  useGlobalContext,
} from "../../components/Store/Store";
import { ONE_MINUTES_MS } from "../constants";
import { TypedItem } from "../types";

export const useInventory = () => {
  const {
    state: { principal },
  } = useGlobalContext();
  const drip = useDrip();
  const bag = useBag();

  return useQuery(
    "inventory",
    async () => {
      const dripTokens = await drip.user_tokens(principal);
      const bagTokens = await bag.user_tokens([]);
      const dripItems: TypedItem[] = (
        await drip.data_of_many({ List: dripTokens })
      ).map(([id, data]) => {
        return {
          type: "Drip",
          id: Number(id),
          owner: principal,
          name: `Drip ${id}`,
          properties: [],
          children: [],
          childOf: [],
          lootData: data,
        };
      });
      const bagItems = (await bag.data_of(bagTokens))
        .map((item) => {
          if (!item[0]) {
            console.error(
              `bag: got ${bagTokens.length} items, want ${bagItems.length}`
            );
            return false;
          }

          return { ...item[0], type: "Bag" };
        })
        .filter(Boolean) as TypedItem[];
      return dripItems.concat(bagItems);
    },
    {
      enabled: !!principal && !principal.isAnonymous(),
      placeholderData: [],
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
