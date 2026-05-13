import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { localPages } from "@/lib/content";

const content = localPages["/smart-home-isernhagen"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-isernhagen" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-isernhagen" },
};

export default function Page() {
  return <LandingPage content={{ ...content, path: "/smart-home-isernhagen", breadcrumbs: [{ label: "Smart Home Isernhagen", href: "/smart-home-isernhagen" }] }} />;
}
