import React from "react";
import { FaGithub, FaTelegram } from "react-icons/fa";
import Panel from "../components/Containers/Panel";
import Footer from "../components/Layout/Footer";
import { homeDescription, MetaTags } from "../components/MetaTags";
import { canisterId } from "../declarations/Bag";

export default function InfoPage() {
  return (
    <>
      <MetaTags title="Info" image="hero" description={homeDescription} />
      <div className="p-8">
        <Panel className="w-full p-8 flex flex-col gap-6 text-black">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl">Welcome to drip.land</h1>
            <div>
              <h2 className="text-2xl">What is this?</h2>
              <p>
                The home of the{" "}
                <a
                  href="https://icdrip.io"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IC Drip
                </a>{" "}
                universe. Is your outfit drippin?
              </p>
            </div>

            <div>
              <h2 className="text-2xl">How do I contribute?</h2>
              <p>
                Come join us in the{" "}
                <a
                  href="https://t.me/icdrip"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>{" "}
                group where we actively discuss the latest ideas for the Drip
                universe. We're looking for graphic designers, game artists,
                storytellers, world builders, and of course, developers!
              </p>
            </div>

            <div>
              <h2 className="text-2xl">Links</h2>
              <ul className="">
                <li>
                  <a
                    href={`https://ic.rocks/principal/${canisterId}`}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/vendor/ic.rocks-logo.svg"
                      className="w-4 inline-block mr-2"
                    />{" "}
                    ic.rocks
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/FloorLamp/drip-land"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="inline-block mr-2" /> GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/icdrip"
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTelegram className="inline-block mr-2" /> Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Panel>
      </div>
      <Footer />
    </>
  );
}
