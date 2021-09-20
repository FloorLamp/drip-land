import { useAtom } from "jotai";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { authedAtom, principalAtom } from "../../atoms/actorsAtom";
import { useNotifications } from "../Store/Store";

export const Subscriptions = () => {
  const [principal] = useAtom(principalAtom);
  const [isAuthed] = useAtom(authedAtom);
  const queryClient = useQueryClient();

  const { add, clear } = useNotifications();
  useEffect(() => {
    // Clear cache when logging in or out
    queryClient.removeQueries();
    if (!isAuthed) {
      clear();
    }
  }, [isAuthed]);

  return null;
};
