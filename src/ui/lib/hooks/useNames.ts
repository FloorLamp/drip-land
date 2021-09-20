import { useAtom } from "jotai";
import { principalAtom } from "../../atoms/actorsAtom";

/** Stub for address book */
export default function useNames() {
  const [principal] = useAtom(principalAtom);
  const principals = {
    ...(principal
      ? {
          [principal.toText()]: "You",
        }
      : {}),
  };

  const principalName = (id: string): string | undefined => principals[id];
  return { principalName };
}
