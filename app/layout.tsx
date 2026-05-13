import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { TrackingManager } from "@/components/TrackingManager";
import { TrackingPlaceholders } from "@/components/TrackingPlaceholders";
import { siteConfig } from "@/site.config";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Smart Home Installateur Hannover | Heimlogik",
    template: "%s | Heimlogik",
  },
  description:
    "Heimlogik plant, integriert und programmiert Smart-Home-Systeme mit Hauptfokus auf Wunstorf, Isernhagen und Hannover.",
  icons: {
    icon: siteConfig.logo.favicon,
    apple: siteConfig.logo.mark,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.companyName,
    images: ["/images/heimlogik-smart-home-hero.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={`${inter.className} min-h-screen bg-paper antialiased`}>
        <TrackingPlaceholders />
        <TrackingManager />
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
