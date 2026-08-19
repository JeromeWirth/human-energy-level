import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Energy Level",
  description: "Track what charges and drains your energy — together.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Energy Level",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          id="umami-analytics"
          src="https://stats.jeromewirth.de/script.js"
          data-website-id="7faf77a9-c471-4499-bfa8-d41df1e2a859"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
