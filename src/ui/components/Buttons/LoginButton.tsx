import { HttpAgent, Identity, SignIdentity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import PlugConnect from "@psychedelic/plug-connect";
import { StoicIdentity } from "ic-stoic-identity";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import React, { useEffect, useState } from "react";
import { agentAtom, authedAtom } from "../../atoms/actorsAtom";
import { canisterId as BagCanisterId } from "../../declarations/Bag";
import { canisterId as DripCanisterId } from "../../declarations/Drip";
import { canisterId as WrapperCanisterId } from "../../declarations/Wrapper";
import { HOST, IDENTITY_PROVIDER } from "../../lib/canisters";
import { ONE_WEEK_NS } from "../../lib/constants";
import Modal from "../Layout/Modal";
import { useLoginModal } from "../Store/Store";

declare global {
  interface Window {
    ic: {
      plug: {
        agent: any;
        isConnected: () => Promise<boolean>;
        createAgent: (args?: {
          whitelist: string[];
          host?: string;
        }) => Promise<undefined>;
        requestBalance: () => Promise<
          Array<{
            amount: number;
            canisterId: string | null;
            image: string;
            name: string;
            symbol: string;
            value: number | null;
          }>
        >;
        requestTransfer: (arg: {
          to: string;
          amount: number;
          opts?: {
            fee?: number;
            memo?: number;
            from_subaccount?: number;
            created_at_time?: {
              timestamp_nanos: number;
            };
          };
        }) => Promise<{ height: number }>;
      };
    };
  }
}

const WHITELIST = [BagCanisterId, DripCanisterId, WrapperCanisterId].filter(
  Boolean
);

export default function LoginButton() {
  const [isOpen, setIsOpen] = useLoginModal();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [_, setAgent] = useAtom(agentAtom);
  const resetAgent = useResetAtom(agentAtom);
  const [isAuthed] = useAtom(authedAtom);
  const [authClient, setAuthClient] = useState<AuthClient>(null);

  const handleAuthenticated = async (authClient: AuthClient) => {
    const identity: Identity = authClient.getIdentity();
    setAgent(
      new HttpAgent({
        identity,
        host: HOST,
      })
    );
    closeModal();
  };

  const [showIILogin, setShowIILogin] = useState(false);
  const handleIILogin = async () => {
    authClient.login({
      identityProvider: IDENTITY_PROVIDER,
      maxTimeToLive: ONE_WEEK_NS,
      onSuccess: () => handleAuthenticated(authClient),
    });
  };

  const handleIILogout = async () => {
    await authClient.logout();
    resetAgent();
  };

  const handlePlugLogin = async () => {
    setAgent(await window?.ic?.plug?.agent);
    closeModal();
  };

  const [showStoicLogin, setShowStoicLogin] = useState(false);
  const handleStoicLogin = async () => {
    StoicIdentity.load().then(async (identity: SignIdentity) => {
      // It seems like some login methods (eg. password) require connecting every time
      identity = await StoicIdentity.connect();
      setAgent(
        new HttpAgent({
          identity,
          host: HOST,
        })
      );
      closeModal();
    });
  };

  const handleLogout = async () => {
    if (await window?.ic?.plug?.isConnected()) {
      window.ic.plug.agent = null;
      resetAgent();
    } else {
      handleIILogout();
    }
  };

  // Auth on refresh
  useEffect(() => {
    (async () => {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);

      if (await window?.ic?.plug?.isConnected()) {
        if (!window.ic.plug.agent) {
          await window.ic.plug.createAgent({
            whitelist: WHITELIST,
            host: HOST,
          });
        }
        handlePlugLogin();
      } else {
        if (await authClient.isAuthenticated()) {
          handleAuthenticated(authClient);
        }
      }
    })();
  }, []);

  return (
    <>
      <button
        className="px-3 h-full hover:bg-drip-pink-400 transition-colors"
        onClick={isAuthed ? handleLogout : openModal}
      >
        {isAuthed ? "Logout" : "Login"}
      </button>
      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title="Login"
        className="max-w-xs w-full"
      >
        <div className="flex flex-col items-stretch gap-4 py-4">
          {showIILogin && (
            <div className="text-sm">
              Internet Identity is not recommended due to difficulty in holding
              balances across different apps.
              <div className="flex mt-4 gap-2 leading-none">
                <button
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-200 border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                  onClick={() => setShowIILogin(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 flex justify-center items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                  onClick={handleIILogin}
                >
                  <img src="/img/dfinity.png" className="w-4 mr-2" /> Login
                </button>
              </div>
            </div>
          )}

          {showStoicLogin && (
            <div className="text-sm">
              Stoic requires third-party cookies to connect.
              <ul className="list-disc mt-2 pl-5">
                <li>
                  <strong>Brave</strong> — Disable shields for drip.land
                </li>
                <li>
                  <strong>Safari</strong> — Enable cross-site tracking
                </li>
              </ul>
              <div className="flex mt-4 gap-2 leading-none">
                <button
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-200 border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                  onClick={() => setShowStoicLogin(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 flex justify-center items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                  onClick={handleStoicLogin}
                >
                  <img src="/img/vendor/stoic.png" className="w-4 mr-2" /> Login
                </button>
              </div>
            </div>
          )}

          {!showIILogin && !showStoicLogin && (
            <>
              <PlugConnect
                whitelist={WHITELIST}
                host={HOST}
                onConnectCallback={handlePlugLogin}
              />

              <button
                className="flex items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                onClick={() => setShowStoicLogin(!showStoicLogin)}
              >
                <img src="/img/vendor/stoic.png" className="w-4 mr-2" /> Stoic
              </button>

              {/* <button
                className="flex items-center px-3 py-2 rounded-lg bg-white border-gray-300 border-2 hover:ring-2 hover:ring-opacity-50 hover:ring-indigo-500 hover:border-indigo-500"
                onClick={() => setShowIILogin(!showIILogin)}
              >
                <img src="/img/vendor/dfinity.png" className="w-4 mr-2" />{" "}
                Internet Identity
              </button> */}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
