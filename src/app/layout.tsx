import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Syne } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Epic Store | Metal Posters, Desk Pads & Signed Jersey Frames",
  description:
    "Premium HD metal posters, XXL micro-weave desk pads, and collector signed jersey frames.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${inter.variable} h-full antialiased`}
    >
      <body
        className={`${inter.className} min-h-full flex flex-col font-[family-name:var(--font-inter)]`}
      >
        {children}
      </body>
    </html>
  );
}
