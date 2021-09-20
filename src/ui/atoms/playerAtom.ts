import { atomWithQuery } from "jotai/query";
import { PlayerData } from "../declarations/Bag/Bag.did";
import { actorsAtom } from "./actorsAtom";

export const playerAtom = atomWithQuery<PlayerData, null>((get) => ({
  queryKey: ["player"],
  queryFn: async () => {
    const { bag } = get(actorsAtom);
    const result = await bag.playerData([]);
    console.log("playerData", result);

    return result[0] || null;
  },
  placeholderData: null,
  initialData: null,
}));
