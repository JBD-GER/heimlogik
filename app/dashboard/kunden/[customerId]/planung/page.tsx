import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string }> };
type Row = { id: string; title: string; area: string; status: string; priority: string; due_at: string | null; notes: string | null };

export default async function CustomerPlanningPage({ params }: PageProps) {
  const { customerId } = await params;
  const { projectIds } = await getCustomerContext(customerId);
  const supabase = createSupabaseAdminClient();
  const { data } = projectIds.length
    ? await supabase.from("planning_items").select("id, title, area, status, priority, due_at, notes").in("project_id", projectIds).order("due_at", { ascending: true, nullsFirst: false })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  if (rows.length === 0) return <EmptyState title="Noch keine Planungen" description="Hier landen technische Planungsaufgaben nach Bereich, Raum und System." />;

  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">{row.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{labelFor(row.area)} · fällig {formatDate(row.due_at)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={row.status} />
              <StatusBadge value={row.priority} />
            </div>
          </div>
          {row.notes ? <p className="mt-4 text-sm leading-6 text-slate-600">{row.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}
