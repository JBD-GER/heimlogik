import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string }> };
type Row = { id: string; title: string; category: string; version: string; status: string; updated_at: string; description: string | null };

export default async function CustomerDocumentationPage({ params }: PageProps) {
  const { customerId } = await params;
  const { projectIds } = await getCustomerContext(customerId);
  const supabase = createSupabaseAdminClient();
  const { data } = projectIds.length
    ? await supabase.from("documentations").select("id, title, category, version, status, updated_at, description").in("project_id", projectIds).order("updated_at", { ascending: false })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  if (rows.length === 0) return <EmptyState title="Noch keine Dokumentation" description="Hier erscheinen technische Dokumentationen, Versionen und Übergaben." />;

  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">{row.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{labelFor(row.category)} · Version {row.version} · aktualisiert {formatDate(row.updated_at)}</p>
            </div>
            <StatusBadge value={row.status} />
          </div>
          {row.description ? <p className="mt-4 text-sm leading-6 text-slate-600">{row.description}</p> : null}
        </article>
      ))}
    </div>
  );
}
