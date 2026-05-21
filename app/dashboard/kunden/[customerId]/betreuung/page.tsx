import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string }> };
type Row = { id: string; is_active: boolean; contract_start_at: string | null; contract_end_at: string | null; sla_level: string; monthly_fee: number | null; response_time: string | null; maintenance_interval: string | null; next_maintenance_at: string | null };

export default async function CustomerCarePage({ params }: PageProps) {
  const { customerId } = await params;
  const { projectIds, projects } = await getCustomerContext(customerId);

  if (!projects.some((project) => ["care", "completed"].includes(project.project_status))) {
    return <EmptyState title="Betreuung noch nicht aktiv" description="Diese Unterseite wird aktiv, sobald ein Projekt den Status Betreuung oder Abgeschlossen hat." />;
  }

  const supabase = createSupabaseAdminClient();
  const { data } = projectIds.length
    ? await supabase.from("care_contracts").select("id, is_active, contract_start_at, contract_end_at, sla_level, monthly_fee, response_time, maintenance_interval, next_maintenance_at").in("project_id", projectIds).order("next_maintenance_at", { ascending: true, nullsFirst: false })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  if (rows.length === 0) return <EmptyState title="Noch keine Betreuung" description="Betreuung wird aktiv, wenn ein Projekt abgeschlossen oder im Betreuungsstatus ist." />;

  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">{labelFor(row.sla_level)} Betreuung</h2>
              <p className="mt-2 text-sm text-slate-600">Pauschale {formatCurrency(row.monthly_fee)} · Reaktion {row.response_time ?? "—"} · Intervall {row.maintenance_interval ?? "—"}</p>
            </div>
            <StatusBadge value={row.is_active ? "active" : "inactive"} />
          </div>
          <p className="mt-4 text-sm text-slate-600">Laufzeit: {formatDate(row.contract_start_at)} bis {formatDate(row.contract_end_at)} · nächste Wartung {formatDate(row.next_maintenance_at)}</p>
        </article>
      ))}
    </div>
  );
}
