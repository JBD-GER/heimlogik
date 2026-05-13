import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { localPages } from "@/lib/content";

const content = localPages["/smart-home-leese"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-leese" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-leese" },
};

export default function Page() {
  return <LandingPage content={{ ...content, path: "/smart-home-leese", breadcrumbs: [{ label: "Smart Home Leese", href: "/smart-home-leese" }] }} />;
}
