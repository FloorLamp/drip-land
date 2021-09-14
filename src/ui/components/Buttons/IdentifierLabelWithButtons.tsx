import { Principal } from "@dfinity/principal";
import classNames from "classnames";
import React from "react";
import useNames from "../../lib/hooks/useNames";
import { shortAccount, shortPrincipal } from "../../lib/utils";
import CopyButton from "./CopyButton";
import ExternalLinkButton from "./ExternalLinkButton";

export type IdentifierRenderProps = {
  rawId: string;
  shortId?: string;
  displayId: string;
  name?: string;
};

const defaultRender = ({ rawId, displayId, name }: IdentifierRenderProps) => {
  const display = name ?? displayId;
  // Show raw id as title when using name or short id
  const showTitle = rawId !== display;
  return showTitle ? <span title={rawId}>{display}</span> : <>{display}</>;
};

export const renderResponsiveShortId = ({
  rawId,
  shortId,
  displayId,
  name,
}: IdentifierRenderProps) => {
  const display = name ?? displayId;
  return (
    <>
      <span className="hidden sm:inline" title={rawId}>
        {display}
      </span>
      <span className="inline sm:hidden" title={rawId}>
        {name ?? shortId}
      </span>
    </>
  );
};

/**
 * @param showName - Show or hide the name, if available
 */
export default function IdentifierLabelWithButtons({
  className,
  type,
  id,
  isShort = false,
  showName = true,
  showButtons = true,
  render = defaultRender,
}: {
  className?: string;
  type: "Principal" | "Account";
  id: Principal | string | bigint;
  forceShowId?: boolean;
  showName?: boolean;
  isShort?: boolean;
  showButtons?: boolean;
  render?: (arg: IdentifierRenderProps) => JSX.Element;
}) {
  const { principalName } = useNames();
  const rawId =
    typeof id === "object" && "_isPrincipal" in id
      ? id.toText()
      : typeof id === "bigint"
      ? id.toString()
      : id;

  let link: string;
  switch (type) {
    case "Principal":
      link = `https://ic.rocks/principal/${rawId}`;
      break;
    case "Account":
      link = `https://ic.rocks/account/${rawId}`;
      break;
  }

  let name: string;
  if (showName) {
    if (type === "Principal") name = principalName(rawId);
  }

  let shortId: string;
  if (type === "Principal" || type === "Account") {
    if (type === "Principal") shortId = shortPrincipal(rawId);
    else if (type === "Account") shortId = shortAccount(rawId);
  }

  const displayId = isShort ? shortId ?? rawId : rawId;

  return (
    <span className={classNames("break-all leading-tight", className)}>
      {render({ rawId, shortId, displayId, name })}
      {showButtons && (
        <>
          <CopyButton text={rawId} title={`Copy ${type}`} />
          {!!link && (
            <ExternalLinkButton link={link} title="View on ic.rocks" />
          )}
        </>
      )}
    </span>
  );
}
