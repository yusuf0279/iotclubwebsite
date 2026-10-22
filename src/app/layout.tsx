import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Instrument_Sans } from "next/font/google";

import "../styles/global.css";
import { Providers } from "./providers";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const display = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-display-face",
  adjustFontFallback: false,
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-face",
  display: "swap",
});

const siteDescription =
  "AUS IoT Club: a student community building connected systems through embedded hardware, software, and intelligent automation.";

export const metadata: Metadata = {
  metadataBase: new URL("https://iotclubwebsite.vercel.app"),
  title: {
    default: "AUS IoT Club",
    template: "%s · AUS IoT Club",
  },
  description: siteDescription,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "AUS IoT Club",
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AUS IoT Club",
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#070b12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />

            <div className="flex flex-1 flex-col lg:pl-[80px]">
              <main id="content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
