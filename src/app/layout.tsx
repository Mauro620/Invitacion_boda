import type { Metadata } from "next";
import {
  Alegreya,
  EB_Garamond,
  Hanken_Grotesk,
  Italiana,
  Mrs_Saint_Delafield,
  Pinyon_Script,
} from "next/font/google";
import "./globals.css";

// Two families per direction (see DESIGN.md). Each exposes a CSS variable
// consumed by src/styles/tokens.css.
// ponytail: all six load while the couple picks a direction; drop the other four after the checkpoint.

// Romántico clásico
const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});
const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

// Jardín boho
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

// Minimal editorial
const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const fontVariables = [
  ebGaramond,
  pinyonScript,
  alegreya,
  mrsSaintDelafield,
  italiana,
  hankenGrotesk,
]
  .map((font) => font.variable)
  .join(" ");

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
