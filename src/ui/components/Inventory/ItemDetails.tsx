import React from "react";
import { Item } from "../../declarations/Bag/Bag.did";
import { useItemData } from "../../lib/hooks/useItemData";
import { useUnwrap } from "../../lib/hooks/useUnwrap";
import { TypedItem } from "../../lib/types";
import { bagUrl, dripUrl } from "../../lib/url";
import SpinnerButton from "../Buttons/SpinnerButton";

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
    <div>
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
                  <label className="px-1 py-0.5 text-xs uppercase bg-gray-600 rounded-md">
                    {data.slot === "weapon" ? "Hand" : data.slot}
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
                  <label className="px-1 py-0.5 text-xs uppercase bg-gray-600 rounded-md">
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
      <ul>
        <li>
          {item.extWrapped && (
            <SpinnerButton
              className="bg-drip-pink w-24 py-2 rounded-md"
              onClick={handleUnwrap}
              isLoading={unwrap.isLoading}
            >
              Unwrap
            </SpinnerButton>
          )}
        </li>
      </ul>
    </div>
  );
}
