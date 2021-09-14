import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useGlobalContext, useNotifications } from "../Store/Store";

export const Subscriptions = () => {
  const {
    state: { principal, isAuthed },
  } = useGlobalContext();
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
