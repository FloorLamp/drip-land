import { useQuery } from "react-query";
import {
  useBag,
  useDrip,
  useGlobalContext,
  useWrapper,
} from "../../components/Store/Store";
import { firstAccountOfPrincipal } from "../accounts";
import { ONE_MINUTES_MS } from "../constants";
import { TypedItem } from "../types";

export const useInventory = () => {
  const {
    state: { principal },
  } = useGlobalContext();
  const drip = useDrip();
  const bag = useBag();
  const wrapper = useWrapper();

  return useQuery(
    "inventory",
    async () => {
      const [dripTokens, bagTokens, wrappedTokens] = await Promise.all([
        drip.user_tokens(principal),
        bag.userTokens([]),
        wrapper.tokens(firstAccountOfPrincipal(principal)),
      ]);
      const wrappedTokenIds = "ok" in wrappedTokens ? wrappedTokens.ok : [];
      console.log(wrappedTokenIds);

      const [rawDripItems, rawBagItems] = await Promise.all([
        drip.data_of_many({
          List: dripTokens.concat(wrappedTokenIds.map(BigInt)),
        }),
        bag.dataOf(bagTokens),
      ]);
      console.log(rawDripItems);

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
            console.error(`bag: missing item ${bagTokens[i]}`);
            return false;
          }

          return { ...item[0], type: "Bag" };
        })
        .filter(Boolean) as TypedItem[];
      return dripItems.concat(bagItems);
    },
    {
      enabled: !!principal && !principal.isAnonymous(),
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
