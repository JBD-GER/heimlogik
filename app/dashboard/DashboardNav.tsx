"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FileText, Handshake, LayoutDashboard, LogOut, Menu, UserRound, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "@/app/admin/login/actions";
import { siteConfig } from "@/site.config";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/kunden", label: "Kunden", icon: Users },
  { href: "/dashboard/rechnungen", label: "Rechnungen", icon: FileText },
  { href: "/dashboard/mitarbeiter", label: "Mitarbeiter", icon: Users },
  { href: "/dashboard/fachpartner", label: "Fachpartner", icon: Handshake },
];

const customerNavItems = [
  { href: "", label: "Übersicht" },
  { href: "/projekte", label: "Projekte" },
  { href: "/angebote", label: "Angebote" },
  { href: "/rechnungen", label: "Rechnungen" },
];

const projectNavItems = [
  { href: "", label: "Projektübersicht" },
  { href: "/ansprechpartner", label: "Ansprechpartner" },
  { href: "/abrechnung", label: "Abrechnung" },
  { href: "/diagnostik", label: "Diagnostik" },
  { href: "/fernzugriff", label: "Fernzugriff" },
  { href: "/dokumentation", label: "Dokumentation" },
  { href: "/gebaeude", label: "Gebäude" },
  { href: "/planung", label: "Planung" },
  { href: "/betreuung", label: "Betreuung" },
];

type DashboardNavProps = {
  userEmail: string;
};

type CustomerNavContext = {
  name: string;
  email: string | null;
  status: string | null;
};

type ProjectNavContext = {
  name: string;
  status: string | null;
  customerName: string;
};

export function DashboardNav({ userEmail }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customerContext, setCustomerContext] = useState<CustomerNavContext | null>(null);
  const [projectContext, setProjectContext] = useState<ProjectNavContext | null>(null);
  const customerMatch = pathname.match(/^\/dashboard\/kunden\/([^/]+)/);
  const projectMatch = pathname.match(/^\/dashboard\/kunden\/([^/]+)\/projekte\/([^/]+)/);
  const customerId = customerMatch?.[1];
  const projectId = projectMatch?.[2];

  useEffect(() => {
    let cancelled = false;

    if (!customerId) {
      setCustomerContext(null);
      setProjectContext(null);
      return;
    }

    const url = projectId
      ? `/api/dashboard/customers/${customerId}/projects/${projectId}/nav`
      : `/api/dashboard/customers/${customerId}/nav`;

    fetch(url, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (projectId) {
          setProjectContext(data);
        } else {
          setCustomerContext(data);
          setProjectContext(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCustomerContext(null);
          setProjectContext(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [customerId, projectId]);

  const isCustomerArea = Boolean(customerId);
  const isProjectArea = Boolean(customerId && projectId);
  const customerBasePath = customerId ? `/dashboard/kunden/${customerId}` : "";
  const projectBasePath = customerId && projectId ? `/dashboard/kunden/${customerId}/projekte/${projectId}` : "";

  const nav = (
    <nav className="grid gap-1" aria-label="Admin Navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`focus-ring flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold ${
              isActive ? "bg-accent text-ink" : "text-slate-700 hover:bg-slate-100 hover:text-ink"
            }`}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const customerNav = customerId ? (
    <div>
      <Link href="/dashboard/kunden" onClick={() => setMobileOpen(false)} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Zurück zu Kunden
      </Link>
      <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-ink">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{customerContext?.name ?? "Kunde"}</p>
            <p className="truncate text-xs text-slate-500">{customerContext?.email ?? customerContext?.status ?? "Kundendetail"}</p>
          </div>
        </div>
      </div>
      <nav className="mt-5 grid gap-1" aria-label="Kundennavigation">
        {customerNavItems.map((item) => {
          const href = `${customerBasePath}${item.href}`;
          const isActive = item.href === "" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={item.label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`focus-ring flex min-h-10 items-center rounded-md px-3 text-sm font-semibold ${
                isActive ? "bg-accent text-ink" : "text-slate-700 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  ) : null;

  const projectNav = customerId && projectId ? (
    <div>
      <Link href={`${customerBasePath}/projekte`} onClick={() => setMobileOpen(false)} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Zurück zu Projekten
      </Link>
      <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
        <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">{projectContext?.customerName ?? customerContext?.name ?? "Kunde"}</p>
        <p className="mt-1 truncate text-sm font-bold text-ink">{projectContext?.name ?? "Projekt"}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{projectContext?.status ?? "Projektkontext"}</p>
      </div>
      <nav className="mt-5 grid gap-1" aria-label="Projektnavigation">
        {projectNavItems.map((item) => {
          const href = `${projectBasePath}${item.href}`;
          const isActive = pathname === href;
          return (
            <Link
              key={item.label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`focus-ring flex min-h-10 items-center rounded-md px-3 text-sm font-semibold ${
                isActive ? "bg-accent text-ink" : "text-slate-700 hover:bg-slate-100 hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  ) : null;

  const scopedNav = isProjectArea ? projectNav : customerNav;
  const desktopNav = isCustomerArea ? scopedNav : nav;
  const mobileNav = isCustomerArea ? scopedNav : nav;

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white p-5 xl:block">
        <Link href="/dashboard" className="focus-ring flex items-center gap-2 rounded-md">
          <Image src={siteConfig.logo.compact} alt={`${siteConfig.companyName} Logo`} width={258} height={65} className="h-12 w-auto object-contain" priority />
          <span className="sr-only">Dashboard</span>
        </Link>
        <div className="mt-8 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">{desktopNav}</div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="truncate text-xs font-semibold text-slate-500">{userEmail}</p>
          <form action={signOut} className="mt-3">
            <button className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink hover:bg-slate-100">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Abmelden
            </button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur xl:hidden">
        <div className="flex min-h-16 items-center justify-between px-4 sm:px-6 md:px-8">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="focus-ring flex items-center rounded-md">
            <Image src={siteConfig.logo.compact} alt={`${siteConfig.companyName} Logo`} width={258} height={65} className="h-10 w-auto object-contain" priority />
          </Link>
          <button
            type="button"
            className="focus-ring flex min-h-11 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-ink"
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-nav"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            Menü
          </button>
        </div>
        {mobileOpen ? (
          <div id="admin-mobile-nav" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-slate-200 p-4 sm:px-6 md:px-8">
            {mobileNav}
            <form action={signOut} className="mt-4">
              <button className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Abmelden
              </button>
            </form>
          </div>
        ) : null}
      </header>
    </>
  );
}
