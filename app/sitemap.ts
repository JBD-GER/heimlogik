import type { MetadataRoute } from "next";
import { localPages, servicePages } from "@/lib/content";
import { siteConfig } from "@/site.config";

const staticRoutes = [
  "/",
  "/leistungen",
  "/kontakt",
  "/faq",
  "/ueber-uns",
  "/impressum",
  "/datenschutz",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...staticRoutes,
    ...Object.keys(servicePages),
    ...Object.keys(localPages),
  ];
  const uniqueRoutes = Array.from(new Set(routes));

  return uniqueRoutes.map((route) => ({
    url: `${siteConfig.siteUrl}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.startsWith("/smart-home-") ? 0.8 : 0.7,
  }));
}
