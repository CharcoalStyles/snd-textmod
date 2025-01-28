import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

const umamiKey = process.env.NEXT_PUBLIC_UMAMI_ID;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          src="https://umami.charcoalstyles.com/script.js"
          data-website-id="331d8223-22e2-47a0-8aad-ffc166bdd915"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
