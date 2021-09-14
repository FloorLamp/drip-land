import { canisterId as BagCanisterId } from "../declarations/Bag";
import { canisterId as DripCanisterId } from "../declarations/Drip";

export const dripUrl = (id: number | bigint | string) =>
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? `http://localhost:8000/?id=${id.toString()}&canisterId=${DripCanisterId}`
    : `https://${DripCanisterId}.raw.ic0.app/?id=${id.toString()}`;

export const bagUrl = (id: number | bigint | string) =>
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? `http://localhost:8000/${id.toString()}?canisterId=${BagCanisterId}`
    : `https://${BagCanisterId}.raw.ic0.app/${id.toString()}`;
