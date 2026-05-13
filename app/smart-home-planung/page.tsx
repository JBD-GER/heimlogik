import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { servicePages } from "@/lib/content";

const content = servicePages["/smart-home-planung"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-planung" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-planung" },
};

export default function Page() {
  return <LandingPage content={content} />;
}
