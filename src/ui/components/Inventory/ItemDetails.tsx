import React from "react";
import { Item } from "../../declarations/Bag/Bag.did";
import { useItemData } from "../../lib/hooks/useItemData";
import { useUnwrap } from "../../lib/hooks/useUnwrap";
import { TypedItem } from "../../lib/types";
import { bagUrl, dripUrl } from "../../lib/url";
import SpinnerButton from "../Buttons/SpinnerButton";
import TransferModal from "./TransferModal";

export function getPropertyValue({ name, item }: { name: string; item: Item }) {
  const value = item.properties.find((prop) => prop.name === name)?.value;

  if (!value) return null;

  if ("Int" in value) {
    return value.Int.toString();
  } else if ("Bool" in value) {
    return value.Bool.toString();
  } else {
    return value.Text;
  }
}

export function ItemDetails({ item }: { item: TypedItem }) {
  const childData = useItemData(item.children);
  const unwrap = useUnwrap(item.id);

  const handleUnwrap = async () => {
    if (!(await unwrap.mutateAsync())) {
      console.warn("error unwrapping");
    }
  };

  return (
    <div className="">
      <div className="w-64 h-64 bg-black">
        <img
          key={item.id}
          src={item.type === "Bag" ? bagUrl(item.id) : dripUrl(item.id)}
        />
      </div>
      <h2 className="font-bold mt-4">
        {item.name}{" "}
        {item.extWrapped && (
          <label className="px-1 py-0.5 text-xs uppercase bg-green-700 rounded-md">
            Wrapped
          </label>
        )}
      </h2>
      <ul>
        {item.type === "Drip"
          ? item.lootData?.map((data) => {
              return (
                <li key={data.slot}>
                  <label className="px-1 py-0.5 text-xs uppercase bg-drip-purple-500 text-drip-purple-100">
                    {data.slot === "weapon" ? "hand" : data.slot}
                  </label>{" "}
                  {!!data.name_prefix && `"${data.name_prefix}" `}
                  {!!data.prefix && `${data.prefix} `}
                  {data.name}
                  {!!data.name_suffix && ` (${data.name_suffix})`}
                  {!!data.special && ` 🔥`}
                </li>
              );
            })
          : childData.data?.map((item) => {
              const name_prefix = getPropertyValue({
                name: "name_prefix",
                item,
              });
              const prefix = getPropertyValue({ name: "prefix", item });
              const name_suffix = getPropertyValue({
                name: "name_suffix",
                item,
              });
              const special = getPropertyValue({ name: "special", item });
              return (
                <li key={item.id}>
                  <label className="px-1 py-0.5 text-xs uppercase bg-drip-purple-500 text-drip-purple-100">
                    {getPropertyValue({ name: "slot", item })}
                  </label>{" "}
                  {!!name_prefix && `"${name_prefix}" `}
                  {!!prefix && `${prefix} `}
                  {item.name}
                  {!!name_suffix && ` (${name_suffix})`}
                  {special === "true" && ` 🔥`}
                </li>
              );
            })}
      </ul>

      <div className="border-t border-drip-purple-500 mt-4 pt-4 pb-2">
        <ul className="flex flex-row-wrap gap-2">
          <li>
            <TransferModal item={item} />
          </li>
          {item.extWrapped && (
            <li>
              <SpinnerButton
                activeClassName="btn-inventory"
                onClick={handleUnwrap}
                isLoading={unwrap.isLoading}
              >
                Unwrap
              </SpinnerButton>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
