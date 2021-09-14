import React from "react";
import { homeDescription, MetaTags } from "../components/MetaTags";

export default function Home() {
  return (
    <>
      <MetaTags
        title="drip.land | mane my outfit is dripping right now"
        suffix={false}
        image="hero"
        description={homeDescription}
      />
      <h1 className="text-center text-4xl mt-16 font-logo text-drip-pink">
        sup fam
      </h1>
    </>
  );
}
