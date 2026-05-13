import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/site.config";

type Crumb = {
  label: string;
  href: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ label: "Start", href: "/" }, ...items];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${siteConfig.siteUrl}${item.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="bg-white px-4 py-3 text-sm sm:px-6 lg:px-8">
        <ol className="container-page flex flex-wrap items-center gap-2 text-slate-500">
          {all.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : null}
              {index === all.length - 1 ? (
                <span className="font-medium text-slate-800">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
