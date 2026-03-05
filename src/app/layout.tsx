import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import AppShell from "./AppShell";

export const metadata: Metadata = {
  title: "Protocol Dashboard",
  description: "Protocol Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts (Rubik / Inter / JetBrains Mono) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        {/* Font Awesome (CSS) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}