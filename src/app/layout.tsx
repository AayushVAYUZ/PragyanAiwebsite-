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
  title: "Pragyan AI — Intelligence for Efficient Results",
  description:
    "Pragyan AI transforms enterprise operations through intelligent AI solutions. From strategy to deployment, we build AI that creates real business value.",
  keywords: [
    "enterprise AI",
    "artificial intelligence",
    "AI consulting",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scrollRestorationScript }} />
      </head>
      <body className="bg-[var(--void-black)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
