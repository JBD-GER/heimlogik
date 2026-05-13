import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CookieSettingsButton } from "./CookieSettingsButton";
import { footerServices, serviceAreaLinks } from "@/lib/content";
import { siteConfig } from "@/site.config";

export function Footer() {
  return (
    <footer className="bg-ink pb-24 text-white md:pb-0">
      <div className="container-page grid gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="inline-flex rounded-md bg-white px-3 py-2">
            <Image
              src={siteConfig.logo.compact}
              alt={`${siteConfig.companyName} Logo`}
              width={258}
              height={65}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">{siteConfig.claim}</p>
          <p className="mt-5 rounded-md border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
            {siteConfig.electricianPartnerText}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Leistungen</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {footerServices.map(([label, href]) => (
              <li key={`${label}-${href}`}>
                <Link href={href} className="text-slate-300 hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Servicegebiet</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {serviceAreaLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-slate-300 hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-slate-400">{siteConfig.serviceRadius}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Kontakt</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li className="flex gap-2">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a href={`tel:${siteConfig.phone}`} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{siteConfig.addressLine}</span>
            </li>
          </ul>
          <h2 className="mt-8 text-sm font-semibold uppercase tracking-wide text-slate-400">Rechtliches</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/impressum" className="text-slate-300 hover:text-white">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="text-slate-300 hover:text-white">
                Datenschutz
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-slate-300 hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <CookieSettingsButton />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
