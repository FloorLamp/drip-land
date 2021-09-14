import React from "react";
import { FaGithub, FaTelegram } from "react-icons/fa";
import { canisterId } from "../../declarations/Bag";

export default function Footer() {
  return (
    <footer className="py-8 flex items-center justify-center gap-4 transition-opacity text-white">
      <a
        href={`https://ic.rocks/principal/${canisterId}`}
        className="opacity-50 hover:opacity-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/img/vendor/ic.rocks-logo.svg" className="w-4" />
      </a>
      <a
        href="https://github.com/FloorLamp/drip-land"
        className="opacity-50 hover:opacity-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub />
      </a>
      <a
        href="https://t.me/icdrip"
        className="opacity-50 hover:opacity-100"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTelegram />
      </a>
    </footer>
  );
}
