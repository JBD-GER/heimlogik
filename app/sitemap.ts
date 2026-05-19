import type { MetadataRoute } from "next";
import { localPages, servicePages } from "@/lib/content";
import { guideArticles } from "@/lib/ratgeber";
import { siteConfig } from "@/site.config";

const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");

const staticRoutes = [
  "/",
  "/leistungen",
  "/kontakt",
  "/faq",
  "/ueber-uns",
  "/fachpartner",
  "/impressum",
  "/datenschutz",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const indexableRoutes = [
    ...staticRoutes,
    "/ratgeber",
    ...guideArticles.map((article) => article.path),
    ...Object.keys(servicePages),
    ...Object.keys(localPages),
  ];
  const uniqueRoutes = Array.from(new Set(indexableRoutes)).sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });

  return uniqueRoutes.map((route) => ({
    url: `${baseUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/smart-home-") ? 0.8 : 0.7,
  }));
}
