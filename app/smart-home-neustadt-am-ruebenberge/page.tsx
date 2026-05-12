import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { localPages } from "@/lib/content";

const content = localPages["/smart-home-neustadt-am-ruebenberge"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/smart-home-neustadt-am-ruebenberge" },
  openGraph: { title: content.metaTitle, description: content.metaDescription, url: "/smart-home-neustadt-am-ruebenberge" },
};

export default function Page() {
  return <LandingPage content={{ ...content, path: "/smart-home-neustadt-am-ruebenberge", breadcrumbs: [{ label: "Smart Home Neustadt am Rübenberge", href: "/smart-home-neustadt-am-ruebenberge" }] }} />;
}
