import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Nikah Yuk by Ratna Offset – Undangan Pernikahan Online",
    template: "%s | Nikah Yuk by Ratna Offset",
  },
  description:
    "Undangan pernikahan online, simpel dan elegan. Buat undangan digital pernikahan Anda dengan mudah dan bagikan kepada tamu undangan.",
  keywords: [
    "undangan pernikahan online",
    "undangan digital",
    "nikah",
    "wedding invitation",
    "Ratna Offset",
  ],
  authors: [{ name: "Nikah Yuk by Ratna Offset" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nikahyuk.id",
    siteName: "Nikah Yuk by Ratna Offset",
    title: "Nikah Yuk by Ratna Offset – Undangan Pernikahan Online",
    description:
      "Undangan pernikahan online, simpel dan elegan. Buat undangan digital pernikahan Anda dengan mudah.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikah Yuk by Ratna Offset",
    description: "Undangan pernikahan online, simpel dan elegan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
