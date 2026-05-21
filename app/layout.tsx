import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
