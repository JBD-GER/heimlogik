import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { servicePages } from "@/lib/content";

const content = servicePages["/smart-home-installation"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: content.path },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: content.path },
};

export default function Page() {
  return <LandingPage content={content} />;
}
