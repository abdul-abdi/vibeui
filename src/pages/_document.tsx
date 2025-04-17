import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Supabase for faster connection establishment */}
        <link rel="preconnect" href="https://jhvuteawbvlkssznovxq.supabase.co" />
        <link rel="preconnect" href="https://supabase.co" crossOrigin="anonymous" />
        
        {/* REMOVED: Preload critical assets - Favicon preload is usually not needed */}
        {/* <link
          rel="preload"
          href="/favicon.svg"
          as="image"
          type="image/svg+xml"
        /> */}
        
        {/* PWA meta tags */}
        <meta name="application-name" content="VibeUI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VibeUI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#5E8AF7" />
        <meta name="msapplication-tap-highlight" content="no" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 