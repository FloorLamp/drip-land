import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { DateTime } from "luxon";
import React, { createContext, useContext, useReducer } from "react";
import BagService from "../../declarations/Bag/Bag.did";
import * as Bag from "../../declarations/Bag/index";
import DripService from "../../declarations/Drip/Drip.did";
import * as Drip from "../../declarations/Drip/index";
import * as Wrapper from "../../declarations/Wrapper/index";
import WrapperService from "../../declarations/Wrapper/Wrapper.did";
import { defaultAgent } from "../../lib/canisters";
import {
  NewNotification,
  NotificationType,
} from "../Notifications/Notifications";

export type State = {
  agent: HttpAgent;
  drip: ActorSubclass<DripService>;
  bag: ActorSubclass<BagService._SERVICE>;
  wrapper: ActorSubclass<WrapperService>;
  isAuthed: boolean;
  principal: Principal | null;
  showLoginModal: boolean;
  notifications: NotificationType[];
};

const createActors = (agent: HttpAgent = defaultAgent) => ({
  drip: Drip.createActor(agent),
  bag: Bag.createActor(agent),
  wrapper: Wrapper.createActor(agent),
});

const initialState: State = {
  ...createActors(),
  agent: defaultAgent,
  isAuthed: false,
  principal: null,
  showLoginModal: false,
  notifications: [],
};

type Action =
  | {
      type: "SET_AGENT";
      agent: HttpAgent | null;
      isAuthed?: boolean;
    }
  | {
      type: "SET_PRINCIPAL";
      principal: Principal;
    }
  | {
      type: "SET_LOGIN_MODAL";
      open: boolean;
    }
  | {
      type: "ADD_NOTIFICATION";
      payload: NewNotification;
    }
  | {
      type: "REMOVE_NOTIFICATION";
      id: string;
    }
  | {
      type: "REMOVE_ALL_NOTIFICATION";
    };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_AGENT":
      const agent = action.agent || defaultAgent;
      return {
        ...state,
        ...createActors(agent),
        agent,
        isAuthed: !!action.isAuthed,
      };
    case "SET_PRINCIPAL":
      return {
        ...state,
        principal: action.principal,
      };
    case "SET_LOGIN_MODAL":
      return {
        ...state,
        showLoginModal: action.open,
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.concat({
          ...action.payload,
          id: `${DateTime.utc().toMillis()}-${Math.random()}`,
        }),
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(({ id }) => id !== action.id),
      };
    case "REMOVE_ALL_NOTIFICATION":
      return {
        ...state,
        notifications: [],
      };
  }
};

const Context = createContext({
  state: initialState,
  dispatch: (_: Action) => null,
});

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a CountProvider");
  }
  return context;
};

export const useLoginModal = () => {
  const context = useGlobalContext();
  return [
    context.state.showLoginModal,
    (open: boolean) => context.dispatch({ type: "SET_LOGIN_MODAL", open }),
  ] as const;
};

export const useDrip = () => {
  const context = useGlobalContext();
  return context.state.drip;
};

export const useBag = () => {
  const context = useGlobalContext();
  return context.state.bag;
};
export const useWrapper = () => {
  const context = useGlobalContext();
  return context.state.wrapper;
};

export const useNotifications = () => {
  const context = useGlobalContext();
  return {
    list: context.state.notifications,
    add: (payload: NewNotification) =>
      context.dispatch({ type: "ADD_NOTIFICATION", payload }),
    remove: (id: string) =>
      context.dispatch({ type: "REMOVE_NOTIFICATION", id }),
    clear: () => context.dispatch({ type: "REMOVE_ALL_NOTIFICATION" }),
  };
};

export const useSetAgent = () => {
  const { dispatch } = useGlobalContext();

  return async ({
    agent,
    isAuthed,
  }: {
    agent: HttpAgent;
    isAuthed?: boolean;
  }) => {
    dispatch({ type: "SET_AGENT", agent, isAuthed });
    if (isAuthed) {
      const principal = await agent.getPrincipal();
      console.log("authed", principal.toText());

      dispatch({
        type: "SET_PRINCIPAL",
        principal,
      });
    } else {
      dispatch({ type: "SET_PRINCIPAL", principal: null });
    }
  };
};

export default Store;
