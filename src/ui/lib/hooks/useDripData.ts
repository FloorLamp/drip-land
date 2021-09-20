import { useQuery } from "react-query";
import { useDrip } from "../../atoms/actorsAtom";
import { TypedItem } from "../types";

export const useDripData = (ids: number[]) => {
  const drip = useDrip();

  return useQuery(
    ["drips", ids],
    async () => {
      return (await drip.data_of_many({ List: ids.map(BigInt) })).map(
        ([id, data]): TypedItem => {
          return {
            id: null,
            type: "Drip",
            owner: null,
            name: `Drip ${id}`,
            properties: [],
            children: [],
            childOf: [],
            lootData: data,
            state: [],
            dripProperties: [],
          };
        }
      );
    },
    { enabled: ids.length > 0 }
  );
};
