import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MultiSig Wallet",
  description: "Frontend demo for a MultiSigWallet contract"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
