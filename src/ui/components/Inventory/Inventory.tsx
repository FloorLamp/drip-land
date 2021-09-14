import classNames from "classnames";
import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useInventory } from "../../lib/hooks/useInventory";
import { TypedItem } from "../../lib/types";
import { bagUrl, dripUrl } from "../../lib/url";
import { pluralize } from "../../lib/utils";
import { ItemDetails } from "./ItemDetails";

const MINIMUM_ITEMS = 8;

export function Inventory() {
  const inventory = useInventory();
  const count = inventory.data?.length;
  const [selectedItem, setSelectedItem] = useState<TypedItem>(null);

  return (
    <div className="flex flex-col-reverse md:flex-row py-4">
      <div>
        <div className="py-4">
          My Bag ({count} {pluralize("item", count)})
          {inventory.isFetching && (
            <AiOutlineLoading className="ml-2 inline-block animate-spin" />
          )}
        </div>
        <div className="flex flex-wrap items-stretch gap-4">
          {!inventory.isSuccess ? (
            <div className="text-white text-center">
              Getting your things together...
            </div>
          ) : (
            Array.from({ length: Math.max(count, MINIMUM_ITEMS) }, (_, i) => {
              if (i < count) {
                const item = inventory.data[i];
                return (
                  <div
                    key={i}
                    className={classNames(
                      "w-32 h-32 border-2 border-black bg-black hover:ring-2 ring-pink-500 cursor-pointer",
                      {
                        "ring-2 ring-pink-500": selectedItem.id === item.id,
                      }
                    )}
                    onClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={
                        item.type === "Bag" ? bagUrl(item.id) : dripUrl(item.id)
                      }
                    />
                  </div>
                );
              }
              return (
                <div key={i} className="border-2 border-black w-32 h-32">
                  <div className="bg-black opacity-10 w-full h-full" />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-none w-72 p-4">
        <div>{selectedItem && <ItemDetails item={selectedItem} />}</div>
      </div>
    </div>
  );
}
