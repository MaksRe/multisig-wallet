import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif"
});

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
      <body className={`${sans.variable} ${serif.variable}`}>
        {children}
      </body>
    </html>
  );
}
