"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  Calculator,
  ClipboardList,
  FileArchive,
  FileText,
  Handshake,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Router,
  UserRound,
  Users,
  Wifi,
  X,
} from "lucide-react";
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
  { href: "", label: "Übersicht", icon: LayoutDashboard },
  { href: "/projekte", label: "Projekte", icon: ClipboardList },
  { href: "/angebote", label: "Angebote", icon: FileText },
  { href: "/rechnungen", label: "Rechnungen", icon: ReceiptText },
];

const projectNavItems = [
  { href: "", label: "Projektübersicht", icon: LayoutDashboard },
  { href: "/ansprechpartner", label: "Ansprechpartner", icon: UserRound },
  { href: "/abrechnung", label: "Abrechnung", icon: Calculator },
  { href: "/diagnostik", label: "Diagnostik", icon: ListChecks },
  { href: "/fernzugriff", label: "Fernzugriff", icon: Wifi },
  { href: "/dokumentation", label: "Dokumentation", icon: FileArchive },
  { href: "/gebaeude", label: "Gebäude", icon: Building2 },
  { href: "/planung", label: "Planung", icon: ClipboardList },
  { href: "/betreuung", label: "Betreuung", icon: BedDouble },
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customerContext, setCustomerContext] = useState<CustomerNavContext | null>(null);
  const [projectContext, setProjectContext] = useState<ProjectNavContext | null>(null);
  const customerMatch = pathname.match(/^\/dashboard\/kunden\/([^/]+)/);
  const projectMatch = pathname.match(/^\/dashboard\/kunden\/([^/]+)\/projekte\/([^/]+)/);
  const customerId = customerMatch?.[1];
  const projectId = projectMatch?.[2];

  useEffect(() => {
    const stored = window.localStorage.getItem("heimlogik-sidebar-collapsed");
    if (stored === "1") setSidebarCollapsed(true);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--dashboard-sidebar-width", sidebarCollapsed ? "5rem" : "18rem");
    window.localStorage.setItem("heimlogik-sidebar-collapsed", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);

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
  const navCollapsed = sidebarCollapsed && !mobileOpen;

  const linkClass = (isActive: boolean) =>
    `focus-ring flex min-h-11 items-center rounded-md text-sm font-semibold ${
      navCollapsed ? "justify-center px-0" : "gap-3 px-3"
    } ${isActive ? "bg-accent text-ink" : "text-slate-700 hover:bg-slate-100 hover:text-ink"}`;

  const nav = (
    <nav className="grid gap-1" aria-label="Admin Navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            title={navCollapsed ? item.label : undefined}
            className={linkClass(isActive)}
          >
            <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {navCollapsed ? <span className="sr-only">{item.label}</span> : item.label}
          </Link>
        );
      })}
    </nav>
  );

  const customerNav = customerId ? (
    <div>
      <Link
        href="/dashboard/kunden"
        onClick={() => setMobileOpen(false)}
        title={navCollapsed ? "Zurück zu Kunden" : undefined}
        className={`focus-ring inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-ink ${navCollapsed ? "w-full justify-center px-0" : "gap-2 px-3"}`}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {navCollapsed ? <span className="sr-only">Zurück zu Kunden</span> : "Zurück zu Kunden"}
      </Link>
      <div className={`mt-5 rounded-md border border-slate-200 bg-slate-50 ${navCollapsed ? "p-2" : "p-4"}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-ink">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>
          {navCollapsed ? null : (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{customerContext?.name ?? "Kunde"}</p>
              <p className="truncate text-xs text-slate-500">{customerContext?.email ?? customerContext?.status ?? "Kundendetail"}</p>
            </div>
          )}
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
              title={navCollapsed ? item.label : undefined}
              className={linkClass(isActive)}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {navCollapsed ? <span className="sr-only">{item.label}</span> : item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  ) : null;

  const projectNav = customerId && projectId ? (
    <div>
      <Link
        href={`${customerBasePath}/projekte`}
        onClick={() => setMobileOpen(false)}
        title={navCollapsed ? "Zurück zu Projekten" : undefined}
        className={`focus-ring inline-flex min-h-11 items-center rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-ink ${navCollapsed ? "w-full justify-center px-0" : "gap-2 px-3"}`}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {navCollapsed ? <span className="sr-only">Zurück zu Projekten</span> : "Zurück zu Projekten"}
      </Link>
      <div className={`mt-5 rounded-md border border-slate-200 bg-slate-50 ${navCollapsed ? "p-2 text-center" : "p-4"}`}>
        {navCollapsed ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-ink">
            <Router className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : (
          <>
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-500">{projectContext?.customerName ?? customerContext?.name ?? "Kunde"}</p>
            <p className="mt-1 truncate text-sm font-bold text-ink">{projectContext?.name ?? "Projekt"}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{projectContext?.status ?? "Projektkontext"}</p>
          </>
        )}
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
              title={navCollapsed ? item.label : undefined}
              className={linkClass(isActive)}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {navCollapsed ? <span className="sr-only">{item.label}</span> : item.label}
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
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white transition-[width,padding] duration-200 xl:block ${
          sidebarCollapsed ? "w-20 p-3" : "w-72 p-5"
        }`}
      >
        <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between gap-3"}`}>
          <Link href="/dashboard" className={`focus-ring flex items-center rounded-md ${sidebarCollapsed ? "h-11 w-11 justify-center bg-slate-50 text-lg font-black text-ink" : "gap-2"}`}>
            {sidebarCollapsed ? (
              <span aria-hidden="true">H</span>
            ) : (
              <Image src={siteConfig.logo.compact} alt={`${siteConfig.companyName} Logo`} width={258} height={65} className="h-12 w-auto object-contain" priority />
            )}
            <span className="sr-only">Dashboard</span>
          </Link>
          {!sidebarCollapsed ? (
            <button
              type="button"
              className="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100"
              onClick={() => setSidebarCollapsed(true)}
              aria-label="Sidebar einklappen"
            >
              <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
        {sidebarCollapsed ? (
          <button
            type="button"
            className="focus-ring mt-3 inline-flex h-11 w-full items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100"
            onClick={() => setSidebarCollapsed(false)}
            aria-label="Sidebar ausklappen"
          >
            <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : null}
        <div className="mt-8 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">{desktopNav}</div>
        <div className={`${sidebarCollapsed ? "left-3 right-3" : "left-5 right-5"} absolute bottom-5`}>
          {sidebarCollapsed ? null : <p className="truncate text-xs font-semibold text-slate-500">{userEmail}</p>}
          <form action={signOut} className="mt-3">
            <button
              title={sidebarCollapsed ? "Abmelden" : undefined}
              className={`focus-ring flex min-h-11 w-full items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-ink hover:bg-slate-100 ${sidebarCollapsed ? "px-0" : "gap-2 px-3"}`}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {sidebarCollapsed ? <span className="sr-only">Abmelden</span> : "Abmelden"}
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
      </header>
      {mobileOpen ? (
        <div id="admin-mobile-nav" className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-ink/35" aria-label="Menü schließen" onClick={() => setMobileOpen(false)} />
          <aside className="touch-scroll-y relative h-full w-[min(23rem,calc(100vw-1.5rem))] overflow-y-auto border-r border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="focus-ring flex items-center rounded-md">
                <Image src={siteConfig.logo.compact} alt={`${siteConfig.companyName} Logo`} width={258} height={65} className="h-10 w-auto object-contain" priority />
              </Link>
              <button type="button" className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-ink" onClick={() => setMobileOpen(false)} aria-label="Menü schließen">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-8">{mobileNav}</div>
            <form action={signOut} className="mt-6 border-t border-slate-100 pt-4">
              <p className="mb-3 truncate text-xs font-semibold text-slate-500">{userEmail}</p>
              <button className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Abmelden
              </button>
            </form>
          </aside>
        </div>
      ) : null}
    </>
  );
}
