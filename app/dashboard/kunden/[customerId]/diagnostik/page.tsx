import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { startDiagnostic } from "../actions";

type PageProps = { params: Promise<{ customerId: string }> };
type Row = { id: string; title: string; status: string; priority: string; error_category: string; customer_report: string | null; checked_at: string | null };

export default async function CustomerDiagnosticsPage({ params }: PageProps) {
  const { customerId } = await params;
  const { projectIds, projects } = await getCustomerContext(customerId);
  const supabase = createSupabaseAdminClient();
  const { data } = projectIds.length
    ? await supabase.from("diagnostics").select("id, title, status, priority, error_category, customer_report, checked_at").in("project_id", projectIds).order("updated_at", { ascending: false })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  return (
    <div className="grid gap-6">
      {projects.length ? (
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-ink">Diagnostik starten</h2>
          <form action={startDiagnostic} className="mt-5 grid gap-4">
            <input type="hidden" name="customer_id" value={customerId} />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Projekt
                <select name="project_id" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.project_name}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Priorität
                <select name="priority" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                  <option value="normal">Normal</option>
                  <option value="low">Niedrig</option>
                  <option value="high">Hoch</option>
                  <option value="critical">Kritisch</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
                Titel
                <input name="title" required placeholder="z.B. Lichtszene Wohnzimmer reagiert nicht" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
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
            </div>
            <textarea name="customer_report" placeholder="Kundenmeldung" className="min-h-24 rounded-md border border-slate-200 px-3 py-2" />
            <textarea name="problem_description" placeholder="Problembeschreibung / interne Notiz" className="min-h-24 rounded-md border border-slate-200 px-3 py-2" />
            <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
              Diagnostik starten
            </button>
          </form>
        </section>
      ) : (
        <EmptyState title="Noch kein Projekt vorhanden" description="Eine Diagnostik braucht zuerst ein Projekt am Kundenobjekt." />
      )}

      {rows.length === 0 ? (
        <EmptyState title="Noch keine Diagnostik" description="Gestartete Diagnostiken erscheinen hier mit Status und Priorität." />
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => (
            <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink">{row.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{labelFor(row.error_category)} · Prüfung: {formatDate(row.checked_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={row.status} />
                  <StatusBadge value={row.priority} />
                </div>
              </div>
              {row.customer_report ? <p className="mt-4 text-sm leading-6 text-slate-600">{row.customer_report}</p> : null}
            </article>
          ))}
        </div>
      )}
            </div>
  );
}
