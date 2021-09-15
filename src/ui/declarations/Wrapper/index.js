import { Actor } from "@dfinity/agent";
import { idlFactory } from "./Wrapper.did.js";

export const canisterId = "3db6u-aiaaa-aaaah-qbjbq-cai";

/**
 * @param {{agent: import("@dfinity/agent").HttpAgent}} [options]
 * @return {import("@dfinity/agent").ActorSubclass<import("./Wrapper.did.js")._SERVICE>}
 */
export const createActor = (agent) => {
  // Fetch root key for certificate validation during development
  if (process.env.NEXT_PUBLIC_DFX_NETWORK === "local") {
    agent.fetchRootKey();
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};
