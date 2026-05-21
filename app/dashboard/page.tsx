import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, FileText, Users } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const [
    newLeadsResult,
    activeProjectsResult,
    planningProjectsResult,
    diagnosticProjectsResult,
    programmingProjectsResult,
    errorProjectsResult,
    openOffersResult,
    openInvoicesResult,
    activeCareResult,
    dueTasksResult,
    nextOnsiteAppointmentsResult,
  ] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }).eq("customer_status", "lead"),
    supabase.from("projects").select("id", { count: "exact", head: true }).not("project_status", "in", "(completed,lost)"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("project_status", "planning"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("project_status", "diagnostics"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("project_status", "programming"),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("project_status", "error"),
    supabase.from("offers").select("id", { count: "exact", head: true }).in("status", ["draft", "sent"]),
    supabase.from("invoices").select("id", { count: "exact", head: true }).in("status", ["sent", "overdue"]),
    supabase.from("care_contracts").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("tasks").select("id", { count: "exact", head: true }).lte("due_at", now).in("status", ["open", "in_progress"]),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("task_type", "onsite_appointment").gte("start_at", now).in("status", ["open", "in_progress"]),
  ]);

  const metrics = [
    ["Neue Leads", newLeadsResult.count ?? 0],
    ["Aktive Projekte", activeProjectsResult.count ?? 0],
    ["Projekte in Planung", planningProjectsResult.count ?? 0],
    ["Projekte in Diagnostik", diagnosticProjectsResult.count ?? 0],
    ["Projekte in Programmierung", programmingProjectsResult.count ?? 0],
    ["Projekte mit Fehlerstatus", errorProjectsResult.count ?? 0],
    ["Offene Angebote", openOffersResult.count ?? 0],
    ["Offene Rechnungen", openInvoicesResult.count ?? 0],
    ["Aktive Betreuungen", activeCareResult.count ?? 0],
    ["Fällige Aufgaben", dueTasksResult.count ?? 0],
    ["Nächste Vor-Ort-Termine", nextOnsiteAppointmentsResult.count ?? 0],
  ];

  const sections = [
    { label: "Kunden", href: "/dashboard/kunden", text: "Kundendaten und Kontakte verwalten.", icon: Users },
    { label: "Rechnungen", href: "/dashboard/rechnungen", text: "Rechnungen und Zahlungsstatus.", icon: FileText },
    { label: "Mitarbeiter", href: "/dashboard/mitarbeiter", text: "Interne Profile, Rollen und Zuständigkeiten.", icon: Users },
  ];

  return (
    <>
      <div className="border-b border-slate-200 pb-6 sm:pb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Heimlogik Admin</p>
        <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink sm:text-4xl">Dashboard</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
          Interner Startbereich für Kunden, Rechnungen und Mitarbeiter. Projektbezogene Bereiche liegen direkt im jeweiligen Kunden.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6">
        {metrics.map(([label, value]) => (
          <article key={label} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm hover:border-accent">
            <section.icon className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold text-ink">{section.label}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{section.text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="text-xl font-bold text-ink">Status</h2>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Projekt, Diagnostik, Planung, Systeme, Angebote, Dokumentation und Betreuung findest du im jeweiligen Kundendetail.
        </p>
      </div>
    </>
  );
}
