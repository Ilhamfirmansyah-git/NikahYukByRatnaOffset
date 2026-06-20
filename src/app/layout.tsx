import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond, Great_Vibes, Lora } from "next/font/google";
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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: ["400"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nikahyuk.id"),
  title: {
    default: "Nikah Yuk by Ratna Offset – Undangan Pernikahan Online",
    template: "%s | Nikah Yuk by Ratna Offset",
  },
  description:
    "Buat undangan pernikahan digital yang elegan dalam hitungan menit. Pilih template premium, tambahkan musik, aktifkan RSVP, dan bagikan ke semua tamu. Mulai dari Rp99.000.",
  keywords: [
    "undangan pernikahan online",
    "undangan pernikahan digital",
    "undangan nikah online",
    "buat undangan pernikahan",
    "undangan digital pernikahan",
    "undangan pernikahan islami",
    "undangan pernikahan elegan",
    "undangan pernikahan murah",
    "template undangan pernikahan",
    "undangan nikah digital",
    "wedding invitation online indonesia",
    "Ratna Offset",
  ],
  authors: [{ name: "Nikah Yuk by Ratna Offset" }],
  creator: "Nikah Yuk by Ratna Offset",
  publisher: "Ratna Offset",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://nikahyuk.id",
    siteName: "Nikah Yuk by Ratna Offset",
    title: "Nikah Yuk by Ratna Offset – Undangan Pernikahan Online",
    description:
      "Buat undangan pernikahan digital yang elegan dalam hitungan menit. Template premium, musik latar, RSVP, dan buku tamu. Mulai Rp99.000.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Nikah Yuk by Ratna Offset — Undangan Pernikahan Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikah Yuk by Ratna Offset – Undangan Pernikahan Online",
    description:
      "Buat undangan pernikahan digital elegan dalam hitungan menit. Mulai Rp99.000.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://nikahyuk.id",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nikah Yuk by Ratna Offset",
  url: "https://nikahyuk.id",
  description:
    "Platform undangan pernikahan digital online terpercaya di Indonesia. Template elegan, harga terjangkau mulai Rp99.000.",
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nikah Yuk by Ratna Offset",
  url: "https://nikahyuk.id",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://nikahyuk.id/template?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfairDisplay.variable} ${cormorant.variable} ${greatVibes.variable} ${lora.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
