import React from "react";
import { FiExternalLink } from "react-icons/fi";

export default function ExternalLinkButton({
  link,
  title,
}: {
  link: string;
  title?: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      className="ml-2 inline-block align-middle cursor-pointer filter hover:drop-shadow opacity-70 hover:opacity-100 transition-all"
      title={title}
    >
      <FiExternalLink />
    </a>
  );
}
