import Link from "next/link";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = {
  params: Promise<{ customerId: string; projectId: string }>;
};

type DiagnosticRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  error_category: string;
  customer_report: string | null;
  problem_description: string | null;
  checked_at: string | null;
  diagnostic_number?: string | null;
  ai_generated_at?: string | null;
  report_generated_at?: string | null;
  report_status?: string | null;
};

export default async function ProjectDiagnosticsPage({ params }: PageProps) {
  const { customerId, projectId } = await params;
  const { project } = await getProjectContext(customerId, projectId);
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("diagnostics")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });
  const rows = (data ?? []) as DiagnosticRow[];
  const createPath = `/api/dashboard/customers/${customerId}/projects/${projectId}/diagnostics`;

  if (!project) return null;

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Projekt" title="Diagnostik" description={`Ist-Situation, Fehlerbilder, technische Ursachenanalyse und offizielle Berichte für ${project.project_name}.`} />

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">Neue Diagnostik anlegen</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Starte mit wenigen Pflichtangaben. Räume, Etagen, Befundmodule, Unterschriften, technische Analyse und PDF-Bericht folgen danach modular in der Detailansicht.
            </p>
          </div>
        </div>
        <form action={createPath} method="post" className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Priorität
              <select name="priority" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="normal">Normal</option>
                <option value="low">Niedrig</option>
                <option value="high">Hoch</option>
                <option value="critical">Kritisch</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Fehlerkategorie
              <select name="error_category" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="other">Sonstiges</option>
                <option value="network">Netzwerk</option>
                <option value="programming">Programmierung</option>
                <option value="wiring">Verkabelung</option>
                <option value="dali">DALI</option>
                <option value="knx">KNX</option>
                <option value="visualization">Visualisierung</option>
                <option value="app">App</option>
                <option value="wifi">WLAN</option>
                <option value="hardware_defect">Hardwaredefekt</option>
                <option value="user_error">Bedienfehler</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
              Titel
              <input name="title" required placeholder="z.B. Lichtszene Wohnzimmer reagiert nicht" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
          </div>
          <textarea name="customer_report" placeholder="Kundenmeldung" className="min-h-24 rounded-md border border-slate-200 px-3 py-2" />
          <textarea name="problem_description" placeholder="Erste Ist-Situation / Problembeschreibung" className="min-h-24 rounded-md border border-slate-200 px-3 py-2" />
          <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
            Diagnostik starten
          </button>
        </form>
      </section>

      {rows.length === 0 ? (
        <EmptyState title="Noch keine Diagnostik" description="Gestartete Diagnostiken erscheinen hier mit Status und Priorität." />
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => (
            <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{row.diagnostic_number ?? "Diagnostik"}</p>
                  <h2 className="mt-1 text-xl font-bold text-ink">{row.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {labelFor(row.error_category)} · Prüfung: {formatDate(row.checked_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={row.status} />
                  <StatusBadge value={row.priority} />
                </div>
              </div>
              {row.customer_report ? <p className="mt-4 text-sm leading-6 text-slate-600">{row.customer_report}</p> : null}
              {row.problem_description ? <p className="mt-3 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">{row.problem_description}</p> : null}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
                <StatusBadge value={row.report_status ?? "draft"} />
                {row.ai_generated_at ? <span className="text-xs font-semibold text-slate-500">Analyse: {formatDate(row.ai_generated_at)}</span> : null}
                {row.report_generated_at ? <span className="text-xs font-semibold text-slate-500">Bericht: {formatDate(row.report_generated_at)}</span> : null}
                <Link href={`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${row.id}`} className="focus-ring ml-auto inline-flex min-h-10 items-center justify-center rounded-md bg-ink px-4 text-sm font-bold text-white hover:bg-slate-700">
                  Diagnostik öffnen
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
