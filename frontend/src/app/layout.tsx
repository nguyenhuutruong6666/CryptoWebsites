import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TCrypto",
  description: "Track cryptocurrency prices in real-time with live updates from Binance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
