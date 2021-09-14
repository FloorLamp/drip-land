import classNames from "classnames";
import { useRouter } from "next/dist/client/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import IdentifierLabelWithButtons from "../Buttons/IdentifierLabelWithButtons";
import { useGlobalContext } from "../Store/Store";

const LoginButton = dynamic(() => import("../Buttons/LoginButton"), {
  ssr: false,
});

function ActiveLink({
  children,
  href,
  exact = true,
  className = "px-4 flex items-center h-full leading-none",
  linkClassName = "hover:bg-drip-pink transition-colors",
  activeClassName = "bg-drip-pink text-white cursor-default",
}) {
  const router = useRouter();
  const active = exact
    ? router.asPath === href
    : router.asPath.startsWith(href);

  return active ? (
    <span
      className={classNames(className, {
        [activeClassName]: active,
      })}
    >
      {children}
    </span>
  ) : (
    <Link href={href}>
      <a className={classNames(className, linkClassName)}>{children}</a>
    </Link>
  );
}

export default function Nav() {
  const {
    state: { principal },
  } = useGlobalContext();

  return (
    <nav className="w-full">
      <div className="py-6 flex justify-center leading-none">
        <Link href="/">
          <a>
            <img src="/img/logo/drip-land-text.svg" className="h-8" />
          </a>
        </Link>
      </div>
      <div className="border-t-2 border-b-2 border-drip-pink flex justify-center">
        <div className="w-full h-8 sm:max-w-screen-xl flex justify-between">
          <div className="flex">
            <ActiveLink href="/">Home</ActiveLink>
            <ActiveLink href="/bag">Bag</ActiveLink>
            <ActiveLink href="/info">Info</ActiveLink>
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
      </div>
    </nav>
  );
}
