import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { localPages } from "@/lib/content";

const content = localPages["/smart-home-stolzenau"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-stolzenau" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-stolzenau" },
};

export default function Page() {
  return <LandingPage content={{ ...content, path: "/smart-home-stolzenau", breadcrumbs: [{ label: "Smart Home Stolzenau", href: "/smart-home-stolzenau" }] }} />;
}
