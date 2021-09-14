import { Principal } from "@dfinity/principal";

export const pluralize = (str: string, n: number) =>
  n === 1 ? str : str + "s";

export const stringify = (data) =>
  JSON.stringify(
    data,
    (key, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value instanceof Principal
        ? value.toText()
        : Buffer.isBuffer(value)
        ? value.toString("hex")
        : value,
    2
  );

export const formatE8s = (number: any, digits?: number) => {
  let n = number;
  if (typeof number !== "number") {
    n = Number(n);
  }
  return formatNumber(n / 1e8, digits);
};

export const formatNumber = (number: any, digits?: number) => {
  let n = number;
  if (typeof number !== "number") {
    n = Number(n);
  }
  const maximumFractionDigits =
    typeof digits === "undefined" ? (number < 1 ? 8 : 4) : digits;
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(n);
};

type SignDisplay = "auto" | "never" | "always" | "exceptZero";
export const formatPercent = (
  number: number,
  digits: number = 2,
  signDisplay: SignDisplay = "auto"
) => {
  return Intl.NumberFormat("en-US", {
    style: "percent",
    signDisplay,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(number);
};

export const shortAccount = (accountId: string) =>
  `${accountId.slice(0, 4)}...${accountId.slice(-4)}`;

export const shortPrincipal = (principal: string | Principal) => {
  const parts = (
    typeof principal === "string" ? principal : principal.toText()
  ).split("-");
  return `${parts[0]}...${parts.slice(-1)[0]}`;
};

export const enumEntries = (enum_: Object): [string, number][] =>
  Object.entries(enum_).filter(([name, id]) => typeof id === "number");

export const principalIsEqual = (p1: Principal, p2: Principal) => {
  if (!p1 || !p2) return false;
  const a1 = p1.toUint8Array();
  const a2 = p2.toUint8Array();
  return (
    a1.length === a2.length && a1.every((value, index) => value === a2[index])
  );
};
