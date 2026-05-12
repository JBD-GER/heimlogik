import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { localPages } from "@/lib/content";

const content = localPages["/smart-home-wunstorf"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-wunstorf" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-wunstorf" },
};

export default function Page() {
  return <LandingPage content={{ ...content, path: "/smart-home-wunstorf", breadcrumbs: [{ label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" }] }} />;
}
