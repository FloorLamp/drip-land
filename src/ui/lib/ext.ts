import { Principal } from "@dfinity/principal";

export const to32bits = (num: number) => {
  let b = new ArrayBuffer(4);
  new DataView(b).setUint32(0, num);
  return Array.from(new Uint8Array(b));
};

export const tokenIdentifier = (principal: string, index: number) => {
  const padding = Buffer.from("\x0Atid");

  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principal).toUint8Array(),
    ...to32bits(index),
  ]);
  return Principal.fromUint8Array(array).toText();
};
