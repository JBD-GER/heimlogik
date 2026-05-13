import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { localPages } from "@/lib/content";

const content = localPages["/smart-home-nienburg"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-nienburg" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-nienburg" },
};

export default function Page() {
  return <LandingPage content={{ ...content, path: "/smart-home-nienburg", breadcrumbs: [{ label: "Smart Home Nienburg", href: "/smart-home-nienburg" }] }} />;
}
