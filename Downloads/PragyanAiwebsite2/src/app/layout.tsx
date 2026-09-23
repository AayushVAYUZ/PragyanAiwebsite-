import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pragyan ai — Intelligence for Efficient Results",
  description:
    "Pragyan ai transforms enterprise operations through intelligent ai solutions. From strategy to deployment, we build ai that creates real business value.",
  keywords: [
    "enterprise ai",
    "artificial intelligence",
    "ai consulting",
    "data engineering",
    "intelligent applications",
  ],
};

export const viewport: Viewport = {
  themeColor: "#03040A",
  colorScheme: "dark",
};

// The cinematic opening always starts at the eye, so the browser must not
// restore a previous scroll position before the preloader runs.
const scrollRestorationScript =
  "try{if('scrollRestoration' in history){history.scrollRestoration='manual'}}catch(e){}";

// Applied only inside <noscript>: drops the eye preloader and reveals the header, which the
// cinematic timeline would otherwise do from JavaScript.
const noScriptFallback = `
[data-testid="eye-preloader"]{display:none!important}
[data-testid="site-header"]{visibility:visible!important;opacity:1!important;pointer-events:auto!important}
[data-testid="site-header"] *{opacity:1!important;visibility:visible!important;transform:none!important;pointer-events:auto!important}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scrollRestorationScript }} />
        {/* Without JavaScript the preloader never finishes and the header is never revealed,
            so the page would read as solid black. The content is already in the HTML: this
            uncovers it. It has no effect whenever scripting is available. */}
        <noscript>
          <style>{noScriptFallback}</style>
        </noscript>
      </head>
      <body className="bg-[var(--void-black)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
