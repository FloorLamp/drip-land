import { useMutation, useQueryClient } from "react-query";
import { useWrapper } from "../../components/Store/Store";
import { canisterId } from "../../declarations/Wrapper";
import { tokenIdentifier } from "../ext";

export const useUnwrap = (id: number) => {
  const wrapper = useWrapper();
  const queryClient = useQueryClient();

  const tokenId = tokenIdentifier(canisterId, id);

  return useMutation(
    ["unwrap", id],
    async () => {
      return await wrapper.unwrap(tokenId, []);
    },
    {
      onSuccess() {
        queryClient.refetchQueries("inventory");
      },
    }
  );
};
