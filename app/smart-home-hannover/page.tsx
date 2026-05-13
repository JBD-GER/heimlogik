import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { localPages } from "@/lib/content";

const content = localPages["/smart-home-hannover"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-hannover" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-hannover" },
};

export default function Page() {
  return <LandingPage content={{ ...content, path: "/smart-home-hannover", breadcrumbs: [{ label: "Smart Home Hannover", href: "/smart-home-hannover" }] }} />;
}
