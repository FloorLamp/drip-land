import React, { useState } from "react";
import { useInventory } from "../../lib/hooks/useInventory";
import { bagUrl, dripUrl } from "../../lib/url";

const MINIMUM_ITEMS = 8;

export function Inventory() {
  const inventory = useInventory();
  const count = inventory.data?.length;
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="flex flex-row-reverse md:flex-row py-4">
      <div className="flex flex-wrap items-stretch gap-4 pt-8">
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
                  className="w-32 h-32 border-2 border-black bg-black hover:ring-2 ring-pink-500 cursor-pointer"
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

      <div className="w-80">
        <div>
          {selectedItem && (
            <img
              src={
                selectedItem.type === "Bag"
                  ? bagUrl(selectedItem.id)
                  : dripUrl(selectedItem.id)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
