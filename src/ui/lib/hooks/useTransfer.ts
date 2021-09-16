import { Principal } from "@dfinity/principal";
import { useMutation, useQueryClient } from "react-query";
import {
  useBag,
  useDrip,
  useGlobalContext,
  useWrapper,
} from "../../components/Store/Store";
import { canisterId } from "../../declarations/Wrapper";
import { tokenIdentifier } from "../ext";
import { TypedItem } from "../types";

export const useTransfer = (item: TypedItem) => {
  const queryClient = useQueryClient();
  const {
    state: { principal },
  } = useGlobalContext();
  const drip = useDrip();
  const bag = useBag();
  const wrapper = useWrapper();

  return useMutation(
    ["transfer", item.id],
    async ({ recipient }: { recipient: Principal }) => {
      if (item.type === "Bag") {
        return await bag.transferTo(recipient, item.id, []);
      } else {
        if (item.extWrapped) {
          const tokenId = tokenIdentifier(canisterId, item.id);
          return await wrapper.transfer({
            to: { principal: recipient },
            token: tokenId,
            notify: false,
            from: { principal },
            memo: [],
            subaccount: [],
            amount: BigInt(1),
          });
        } else {
          return await drip.transfer_to(recipient, BigInt(item.id));
        }
      }
    },
    {
      onSuccess() {
        queryClient.refetchQueries("inventory");
      },
    }
  );
};
