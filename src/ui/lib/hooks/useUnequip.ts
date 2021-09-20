import { useMutation, useQueryClient } from "react-query";
import { useBag } from "../../atoms/actorsAtom";
import { TypedItem } from "../types";

export const useUnequip = () => {
  const queryClient = useQueryClient();
  const bag = useBag();

  return useMutation(
    "unequip",
    async (item: TypedItem) => {
      console.log(`unequip ${item.id}: ${await bag.unequip([item.id])}`);
    },
    {
      onSuccess() {
        queryClient.refetchQueries("player");
        queryClient.refetchQueries("inventory");
      },
    }
  );
};
