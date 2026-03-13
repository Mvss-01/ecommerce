import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Perle | Robes d'Exception en Algérie",
  description: "Découvrez La Perle, votre destination luxe pour des robes élégantes en Algérie. Des créations uniques pour mariages et soirées, alliant tradition et modernité avec une livraison rapide.",
  keywords: ["robes de soirée", "robes de mariée", "mode femme Algérie", "La Perle boutique", "robes luxe"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}