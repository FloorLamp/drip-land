import { useQuery } from "react-query";
import { useBag } from "../../components/Store/Store";
import { TypedItem } from "../types";

export const useItemData = (ids: number[]) => {
  const bag = useBag();

  return useQuery(
    ["items", ids],
    async () => {
      return (await bag.dataOf(ids))
        .map((item, i) => {
          if (!item[0]) {
            console.error(`bag: missing item ${ids[i]}`);
            return false;
          }

          return { ...item[0], type: "Bag" };
        })
        .filter(Boolean) as TypedItem[];
    },
    {}
  );
};
