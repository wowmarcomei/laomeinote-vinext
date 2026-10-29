import type { Metadata } from "next";
import type { ReactNode } from "react";
import { site } from "../lib/site";

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s – ${site.title}`,
  },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    images: ["/images/whoami/avatar.webp"],
    type: "website",
  },
};

const FAVICONS = [57, 60, 72, 76, 114, 120, 144, 152, 180];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh" dir="ltr">
      <head prefix="og: http://ogp.me/ns#">
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="stylesheet" href="/css/main.min.css" />
        <link rel="stylesheet" href="/css/font.min.css" />
        <link rel="stylesheet" href="/css/custom.min.css" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        {FAVICONS.map((s) => (
          <link key={s} rel="apple-touch-icon" sizes={`${s}x${s}`} href={`/favicon/apple-icon-${s}x${s}.png`} />
        ))}
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title={site.title} href="/index.xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NNWMB4S');`,
          }}
        />
      </head>
      <body id="root" className="theme__dark">
        <script
          dangerouslySetInnerHTML={{
            __html: `var localTheme = localStorage.getItem('theme'); if (localTheme) { document.getElementById('root').className = 'theme__' + localTheme; }`,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NNWMB4S"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div id="container">{children}</div>
      </body>
    </html>
  );
}
