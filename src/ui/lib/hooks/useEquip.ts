import { Principal } from "@dfinity/principal";
import { useMutation, useQueryClient } from "react-query";
import { useBag, useDrip } from "../../atoms/actorsAtom";
import { canisterId } from "../../declarations/Bag";
import { TypedItem } from "../types";
import { useUnwrap } from "./useUnwrap";

export const useEquip = (item: TypedItem) => {
  const queryClient = useQueryClient();
  const drip = useDrip();
  const bag = useBag();
  const unwrap = useUnwrap(item.id);

  return useMutation(
    ["equip", item.id],
    async () => {
      if (item.type === "Bag") {
        return await bag.equip([item.id]);
      } else {
        if (item.extWrapped) {
          await unwrap.mutateAsync();
        }
        return await drip.transfer_with_notify({
          to: Principal.fromText(canisterId),
          token_id: BigInt(item.id),
          memo: [Array.from(Buffer.from("equip"))],
        });
      }
    },
    {
      onSuccess() {
        queryClient.refetchQueries("inventory");
        queryClient.refetchQueries("player");
      },
    }
  );
};
