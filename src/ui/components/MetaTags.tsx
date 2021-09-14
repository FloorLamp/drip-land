import Head from "next/head";

export const TITLE = "drip.land";

export const TITLE_SUFFIX = "| " + TITLE;
export const homeDescription = "Home of the Drip universe";

export function MetaTags({
  title,
  description,
  image = "logo",
  suffix = true,
}: {
  title: string;
  description: string;
  image?: "logo" | "hero";
  suffix?: boolean;
}) {
  const fullTitle = suffix ? `${title} ${TITLE_SUFFIX}` : title;
  const imageUrl = `https://drip.land/img/drip-${image}.svg`;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="twitter:title" content={fullTitle} />

      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      <meta
        property="twitter:card"
        content={image === "hero" ? "summary_large_image" : "summary"}
      />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </Head>
  );
}
