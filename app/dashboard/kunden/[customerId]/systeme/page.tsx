import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { labelFor } from "@/lib/dashboard/labels";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string }> };
type Row = { id: string; system_type: string; manufacturer: string | null; model: string | null; ip_address: string | null; credential_note: string | null; status: string; description: string | null };

export default async function CustomerSystemsPage({ params }: PageProps) {
  const { customerId } = await params;
  const { projectIds } = await getCustomerContext(customerId);
  const supabase = createSupabaseAdminClient();
  const { data } = projectIds.length
    ? await supabase.from("project_systems").select("id, system_type, manufacturer, model, ip_address, credential_note, status, description").in("project_id", projectIds).order("system_type", { ascending: true })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  if (rows.length === 0) return <EmptyState title="Noch keine Systeme" description="KNX, DALI, Home Assistant, Netzwerk, Audio und Energie werden projektbezogen erfasst." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((row) => (
        <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-ink">{labelFor(row.system_type)}</h2>
              <p className="mt-2 text-sm text-slate-600">{[row.manufacturer, row.model].filter(Boolean).join(" ") || "Hersteller/Modell offen"}</p>
            </div>
            <StatusBadge value={row.status} />
          </div>
          <dl className="mt-4 grid gap-2 text-sm text-slate-600">
            <div>IP: {row.ip_address ?? "—"}</div>
            <div>Zugang: {row.credential_note ?? "kein Hinweis"}</div>
          </dl>
          {row.description ? <p className="mt-4 text-sm leading-6 text-slate-600">{row.description}</p> : null}
        </article>
      ))}
    </div>
  );
}
