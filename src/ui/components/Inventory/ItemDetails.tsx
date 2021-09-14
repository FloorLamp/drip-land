import React from "react";
import { TypedItem } from "../../lib/types";
import { bagUrl, dripUrl } from "../../lib/url";

export function ItemDetails({ item }: { item: TypedItem }) {
  return (
    <div>
      <div className="w-64 h-64 bg-black">
        <img
          key={item.id}
          src={item.type === "Bag" ? bagUrl(item.id) : dripUrl(item.id)}
        />
      </div>
      <h2 className="font-bold mt-4">{item.name}</h2>
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
          : item.children.map((id) => {
              return <li key={id}>Item {id}</li>;
            })}
      </ul>
    </div>
  );
}
