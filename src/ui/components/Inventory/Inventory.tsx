import classNames from "classnames";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (selectedItem) {
      const newSelectedItem = inventory.data.find(
        ({ id }) => id === selectedItem.id
      );
      setSelectedItem(newSelectedItem);
    }
  }, [inventory.data]);

  return (
    <div className="w-full flex flex-col-reverse sm:flex-row">
      <div className="p-4">
        <div>
          My Bag
          {inventory.isSuccess && ` (${count} ${pluralize("item", count)})`}
          {inventory.isFetching && (
            <AiOutlineLoading className="ml-2 inline-block animate-spin" />
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-stretch gap-4">
          {!inventory.isSuccess ? (
            <div className="w-full text-white text-center">
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
                      "relative w-32 h-32 border-2 border-black bg-black hover:ring-2 ring-pink-500 cursor-pointer",
                      {
                        "ring-2 ring-pink-500": selectedItem?.id === item.id,
                      }
                    )}
                    onClick={() => setSelectedItem(item)}
                  >
                    <img
                      src={
                        item.type === "Bag" ? bagUrl(item.id) : dripUrl(item.id)
                      }
                    />
                    {item.extWrapped && (
                      <div className="absolute bg-green-800 opacity-70 right-0 bottom-0 px-2 py-1 text-xs uppercase">
                        Wrapped
                      </div>
                    )}
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

      <div className="w-full sm:flex-none sm:w-72 p-4 bg-drip-purple-400 shadow-md">
        <div>{selectedItem && <ItemDetails item={selectedItem} />}</div>
      </div>
    </div>
  );
}
