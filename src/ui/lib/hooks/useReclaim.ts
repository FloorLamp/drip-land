import { useMutation, useQueryClient } from "react-query";
import { useBag } from "../../atoms/actorsAtom";

export const useReclaim = () => {
  const queryClient = useQueryClient();
  const bag = useBag();

  return useMutation(
    "reclaim",
    async () => {
      console.log("reclaimed", await bag.reclaim([]));
    },
    {
      onSuccess() {
        queryClient.refetchQueries("player");
        queryClient.refetchQueries("inventory");
      },
    }
  );
};
