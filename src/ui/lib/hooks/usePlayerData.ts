import { Principal } from "@dfinity/principal";
import { useAtom } from "jotai";
import { useQuery } from "react-query";
import { principalAtom, useBag } from "../../atoms/actorsAtom";
import { ONE_MINUTES_MS } from "../constants";

export const usePlayerData = (id?: string) => {
  const [principal] = useAtom(principalAtom);
  const bag = useBag();

  return useQuery(
    id ? ["player", id] : "player",
    async () => {
      const result = await bag.playerData(id ? [Principal.fromText(id)] : []);
      console.log("playerData", result);

      return result[0] || null;
    },
    {
      enabled: !!principal && !principal.isAnonymous(),
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
