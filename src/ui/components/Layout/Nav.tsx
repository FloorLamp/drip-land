import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import IdentifierLabelWithButtons from "../Buttons/IdentifierLabelWithButtons";
import { useGlobalContext } from "../Store/Store";

const LoginButton = dynamic(() => import("../Buttons/LoginButton"), {
  ssr: false,
});

export default function Nav() {
  const {
    state: { principal },
  } = useGlobalContext();

  return (
    <nav className="py-4 flex flex-col gap-4 items-center justify-between border-b border-black border-opacity-10 text-gray-300">
      <div className="flex justify-center leading-none">
        <Link href="/">
          <a>
            <img src="/img/logo/drip-land-text.svg" className="h-12" />
          </a>
        </Link>
      </div>
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="hover:underline">Home</a>
          </Link>
          <Link href="/info">
            <a className="hover:underline">Info</a>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {principal && !principal.isAnonymous() && (
            <div className="flex flex-col">
              <IdentifierLabelWithButtons
                type="Principal"
                id={principal}
                isShort={true}
                showName={false}
                showButtons={false}
              />
            </div>
          )}
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}
