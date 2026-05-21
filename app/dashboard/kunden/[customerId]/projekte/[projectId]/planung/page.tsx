import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string; projectId: string }> };

type PlanningRow = {
  id: string;
  title: string;
  description: string | null;
  area: string;
  status: string;
  priority: string;
  due_at: string | null;
  notes: string | null;
  rooms?: { room_name: string | null } | null;
};

export default async function ProjectPlanningPage({ params }: PageProps) {
  const { customerId, projectId } = await params;
  const { project } = await getProjectContext(customerId, projectId);
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("planning_items")
    .select("id, title, description, area, status, priority, due_at, notes, rooms(room_name)")
    .eq("project_id", projectId)
    .order("due_at", { ascending: true, nullsFirst: false });
  const rows = (data ?? []) as unknown as PlanningRow[];

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Projekt" title="Planung" description={project?.project_name ?? "Technische Planung"} />
      {rows.length === 0 ? (
        <EmptyState title="Noch keine Planungspunkte" description="Hier landen Licht, Beschattung, Heizung, Netzwerk, Audio, Sicherheit, Visualisierung und Automationen." />
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => (
            <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink">{row.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{labelFor(row.area)} · {row.rooms?.room_name ?? "ohne Raum"} · fällig {formatDate(row.due_at)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge value={row.status} />
                  <StatusBadge value={row.priority} />
                </div>
              </div>
              {row.description ? <p className="mt-4 text-sm leading-6 text-slate-600">{row.description}</p> : null}
              {row.notes ? <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">{row.notes}</p> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
