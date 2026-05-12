import Link from "next/link";
import Image from "next/image";
import { Menu, Phone } from "lucide-react";
import { navItems } from "@/lib/content";
import { siteConfig } from "@/site.config";
import { ButtonLink } from "./ButtonLink";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex min-w-0 items-center rounded-md py-2">
          <Image
            src={siteConfig.logo.compact}
            alt={`${siteConfig.companyName} Logo`}
            width={258}
            height={65}
            priority
            className="h-12 w-auto max-w-[188px] object-contain xl:max-w-[230px]"
          />
          <span className="sr-only">
            {siteConfig.companyName} - {siteConfig.claim}
          </span>
        </Link>
        <nav className="hidden items-center gap-4 xl:flex" aria-label="Hauptnavigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-700 hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${siteConfig.phone}`}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink hover:bg-slate-100"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {siteConfig.phone}
          </a>
          <ButtonLink href="/kontakt" className="min-h-11 px-4 py-2">
            Projekt-Check
          </ButtonLink>
        </div>
        <details className="group relative xl:hidden">
          <summary className="focus-ring list-none rounded-md p-2 text-ink marker:hidden">
            <Menu className="h-6 w-6" aria-label="Menü öffnen" />
          </summary>
          <div className="absolute right-0 mt-3 max-h-[80vh] w-80 overflow-y-auto rounded-md border border-slate-200 bg-white p-3 shadow-soft">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <a href={`tel:${siteConfig.phone}`} className="mt-2 block rounded-md bg-slate-100 px-3 py-3 text-sm font-semibold text-ink">
              {siteConfig.phone}
            </a>
            <ButtonLink href="/kontakt" className="mt-2 w-full">
              Projekt-Check vereinbaren
            </ButtonLink>
          </div>
        </details>
      </div>
    </header>
  );
}
