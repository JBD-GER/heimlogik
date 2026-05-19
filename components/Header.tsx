"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { navItems } from "@/lib/content";
import { siteConfig } from "@/site.config";
import { ButtonLink } from "./ButtonLink";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const serviceItems = navItems.filter((item) => !["/kontakt", "/leistungen", "/ratgeber"].includes(item.href));

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  function closeMenus() {
    setServicesOpen(false);
    setMobileOpen(false);
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page relative flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 md:min-h-20 lg:px-8">
        <Link href="/" onClick={closeMenus} className="focus-ring flex min-w-0 items-center rounded-md py-2">
          <Image
            src={siteConfig.logo.compact}
            alt={`${siteConfig.companyName} Logo`}
            width={258}
            height={65}
            priority
            className="h-10 w-auto max-w-[168px] object-contain sm:h-12 lg:max-w-[210px] xl:max-w-[230px]"
          />
          <span className="sr-only">
            {siteConfig.companyName} - {siteConfig.claim}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex xl:gap-2" aria-label="Hauptnavigation">
          <Link href="/" onClick={closeMenus} className="focus-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">
            Smart Home
          </Link>
          <div className="relative">
            <button
              type="button"
              className="focus-ring flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              aria-expanded={servicesOpen}
              aria-controls="desktop-services-menu"
              onClick={() => setServicesOpen((open) => !open)}
            >
              Leistungen
              <ChevronDown className={`h-4 w-4 transition ${servicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {servicesOpen ? (
              <div id="desktop-services-menu" className="absolute left-0 top-full mt-2 grid w-[430px] grid-cols-2 gap-1 rounded-md border border-slate-200 bg-white p-3 shadow-soft">
                <Link href="/leistungen" onClick={closeMenus} className="col-span-2 rounded-md px-3 py-3 text-sm font-semibold text-ink hover:bg-slate-100">
                  Alle Leistungen
                </Link>
                {serviceItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={closeMenus} className="rounded-md px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-ink">
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href="/#servicegebiet" onClick={closeMenus} className="focus-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">
            Servicegebiet
          </Link>
          <Link href="/ratgeber" onClick={closeMenus} className="focus-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">
            Ratgeber
          </Link>
          <Link href="/kontakt" onClick={closeMenus} className="focus-ring inline-flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-slate-800 hover:bg-slate-100">
            Kontakt
          </Link>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <a href={`tel:${siteConfig.phone}`} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-ink hover:bg-slate-100">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {siteConfig.phone}
          </a>
          <ButtonLink href="/kontakt" className="min-h-11 px-4 py-2">
            Projekt-Check
          </ButtonLink>
        </div>

        <button
          type="button"
          className="focus-ring flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-ink md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          {mobileOpen ? "Schließen" : "Menü"}
        </button>

        {mobileOpen ? (
          <div id="mobile-menu" className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white p-4 shadow-soft md:hidden">
            <Link href="/" onClick={closeMenus} className="block rounded-md px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-100">
              Smart Home
            </Link>
            <Link href="/leistungen" onClick={closeMenus} className="block rounded-md px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-100">
              Leistungen
            </Link>
            <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Leistungsbereiche</p>
            <div className="mt-2 grid gap-1">
              {serviceItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMenus} className="block rounded-md px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-100">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="my-4 h-px bg-slate-200" />
            <Link href="/#servicegebiet" onClick={closeMenus} className="block rounded-md px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-100">
              Servicegebiet
            </Link>
            <Link href="/ratgeber" onClick={closeMenus} className="block rounded-md px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-100">
              Ratgeber
            </Link>
            <Link href="/kontakt" onClick={closeMenus} className="block rounded-md px-3 py-3 text-base font-semibold text-slate-800 hover:bg-slate-100">
              Kontakt
            </Link>
            <a href={`tel:${siteConfig.phone}`} onClick={closeMenus} className="mt-3 flex min-h-12 items-center gap-2 rounded-md bg-slate-100 px-3 text-base font-semibold text-ink">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <ButtonLink href="/kontakt" className="mt-2 w-full">
              Projekt-Check vereinbaren
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </header>
  );
}
