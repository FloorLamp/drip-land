import React from "react";
import { Inventory } from "../components/Inventory/Inventory";
import { MetaTags } from "../components/MetaTags";
import { useGlobalContext } from "../components/Store/Store";

export default function Bag() {
  const {
    state: { isAuthed },
  } = useGlobalContext();

  if (!isAuthed)
    return <h1 className="text-2xl mt-4">Log in to see your bag!</h1>;

  return (
    <>
      <MetaTags title="Bag" description="Check out your Drip" />
      <Inventory />
    </>
  );
}
