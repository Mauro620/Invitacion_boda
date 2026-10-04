import type { Metadata } from "next";
import { Alegreya, Mrs_Saint_Delafield } from "next/font/google";
import "./globals.css";

// Boho direction (see DESIGN.md). Each exposes a CSS variable consumed by src/styles/tokens.css.

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});
const mrsSaintDelafield = Mrs_Saint_Delafield({
  variable: "--font-mrs-saint-delafield",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const fontVariables = [alegreya, mrsSaintDelafield].map((font) => font.variable).join(" ");

export const metadata: Metadata = {
  title: "Nuestra boda",
  description: "Una invitación hecha para ti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CO" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
