import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { labelFor } from "@/lib/dashboard/labels";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string }> };
type Row = { id: string; title: string; description: string | null; priority: string; status: string; error_category: string; resolution: string | null; time_spent_hours: number | null };

export default async function CustomerSupportCasesPage({ params }: PageProps) {
  const { customerId } = await params;
  const { projectIds, projects } = await getCustomerContext(customerId);

  if (!projects.some((project) => ["care", "completed"].includes(project.project_status))) {
    return <EmptyState title="Supportfälle noch nicht aktiv" description="Supportfälle werden erst relevant, wenn ein Projekt in Betreuung oder abgeschlossen ist." />;
  }

  const supabase = createSupabaseAdminClient();
  const { data } = projectIds.length
    ? await supabase.from("support_cases").select("id, title, description, priority, status, error_category, resolution, time_spent_hours").in("project_id", projectIds).order("updated_at", { ascending: false })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  if (rows.length === 0) return <EmptyState title="Noch keine Supportfälle" description="Hier erscheinen Betreuungs- und Supportfälle nach Projekt." />;

  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">{row.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{labelFor(row.error_category)} · Aufwand {row.time_spent_hours ?? 0} h</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={row.status} />
              <StatusBadge value={row.priority} />
            </div>
          </div>
          {row.description ? <p className="mt-4 text-sm leading-6 text-slate-600">{row.description}</p> : null}
          {row.resolution ? <p className="mt-4 rounded-md bg-green-50 p-4 text-sm leading-6 text-green-800">{row.resolution}</p> : null}
        </article>
      ))}
    </div>
  );
}
