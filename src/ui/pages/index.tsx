import React from "react";
import { homeDescription, MetaTags } from "../components/MetaTags";
import { useInventory } from "../lib/hooks/useInventory";
import { bagUrl, dripUrl } from "../lib/url";

const MINIMUM_ITEMS = 8;

export default function Home() {
  const inventory = useInventory();

  return (
    <>
      <MetaTags
        title="drip.land | mane my outfit is dripping right now"
        suffix={false}
        image="hero"
        description={homeDescription}
      />

      <div className="flex flex-wrap items-stretch gap-4 pt-8">
        {!inventory.isSuccess ? (
          <div className="text-white text-center">
            Getting your things together...
          </div>
        ) : (
          inventory.data.map(({ id, type, name }) => {
            return (
              <div
                key={id}
                className="bg-black hover:ring-2 ring-pink-500 cursor-pointer"
              >
                <img
                  className="w-64"
                  src={
                    type === "Bag"
                      ? bagUrl(id.toString())
                      : dripUrl(id.toString())
                  }
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
