import { useAtom } from "jotai";
import React from "react";
import { authedAtom } from "../atoms/actorsAtom";
import { Inventory } from "../components/Inventory/Inventory";
import { MetaTags } from "../components/MetaTags";

export default function Bag() {
  const [isAuthed] = useAtom(authedAtom);

  if (!isAuthed)
    return <h1 className="text-2xl mt-4">Log in to see your bag!</h1>;

  return (
    <>
      <MetaTags title="Bag" description="Check out your Drip" />
      <Inventory />
    </>
  );
}
