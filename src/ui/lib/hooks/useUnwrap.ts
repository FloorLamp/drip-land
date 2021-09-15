import { Principal } from "@dfinity/principal";
import { useMutation, useQueryClient } from "react-query";
import { useWrapper } from "../../components/Store/Store";
import { canisterId } from "../../declarations/Wrapper";

const to32bits = (num: number) => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};
const tokenIdentifier = (principal: string, index: number) => {
  const padding = Buffer.from("\x0Atid");

  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principal).toUint8Array(),
    ...to32bits(index),
  ]);
  return Principal.fromUint8Array(array).toText();
};

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
