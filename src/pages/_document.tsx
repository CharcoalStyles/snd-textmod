import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const umamiKey = process.env.NEXT_PUBLIC_UMAMI_ID;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          async
          defer
          data-website-id={umamiKey}
          src="https://umami.charcoalstyles.com/script.js"></Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
