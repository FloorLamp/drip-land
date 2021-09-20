import { useQuery } from "react-query";
import { useWrapper } from "../../atoms/actorsAtom";
import { ONE_MINUTES_MS } from "../constants";

export const useRecentTransactions = () => {
  const wrapper = useWrapper();

  return useQuery(
    "recentTransactions",
    async () => {
      const txs = await wrapper.getTransactions([BigInt(5)]);
      console.log(txs);
      return txs;
    },
    {
      keepPreviousData: true,
      refetchInterval: ONE_MINUTES_MS,
    }
  );
};
