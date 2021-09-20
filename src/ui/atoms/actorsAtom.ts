import { HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { atom, useAtom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils";
import * as Bag from "../declarations/Bag/index";
import * as Drip from "../declarations/Drip/index";
import * as Wrapper from "../declarations/Wrapper/index";
import { defaultAgent } from "../lib/canisters";

const _agentAtom = atomWithReset(defaultAgent);
export const agentAtom = atom(
  (get) => get(_agentAtom),
  (_get, set, newValue: HttpAgent | typeof RESET) => {
    if (newValue === RESET) {
      set(actorsAtom, createActors());
      set(principalAtom, Principal.anonymous());
    } else {
      set(actorsAtom, createActors(newValue));
      (async () => {
        const principal = await newValue.getPrincipal();
        set(principalAtom, principal);
      })();
    }
  }
);

const createActors = (agent: HttpAgent = defaultAgent) => ({
  drip: Drip.createActor(agent),
  bag: Bag.createActor(agent),
  wrapper: Wrapper.createActor(agent),
});

export const actorsAtom = atom(createActors());
export const principalAtom = atom(Principal.anonymous());
export const authedAtom = atom((get) => !get(principalAtom).isAnonymous());

export const useDrip = () => {
  const [{ drip }] = useAtom(actorsAtom);
  return drip;
};
export const useBag = () => {
  const [{ bag }] = useAtom(actorsAtom);
  return bag;
};
export const useWrapper = () => {
  const [{ wrapper }] = useAtom(actorsAtom);
  return wrapper;
};
