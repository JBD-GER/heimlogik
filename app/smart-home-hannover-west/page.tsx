import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { localPages } from "@/lib/content";

const content = localPages["/smart-home-hannover-west"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-hannover-west" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-hannover-west" },
};

export default function Page() {
  return <LandingPage content={{ ...content, path: "/smart-home-hannover-west", breadcrumbs: [{ label: "Smart Home Hannover West", href: "/smart-home-hannover-west" }] }} />;
}
