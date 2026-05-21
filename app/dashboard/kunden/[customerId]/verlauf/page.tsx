import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDateTime } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string }> };
type Row = { id: string; activity_type: string; title: string; description: string | null; created_at: string };

export default async function CustomerActivityPage({ params }: PageProps) {
  const { customerId } = await params;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("activity_logs").select("id, activity_type, title, description, created_at").eq("customer_id", customerId).order("created_at", { ascending: false }).limit(100);
  const rows = (data ?? []) as Row[];

  if (rows.length === 0) return <EmptyState title="Noch kein Verlauf" description="Aktivitäten wie Notizen, Uploads und Statusänderungen werden hier protokolliert." />;

  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">{labelFor(row.activity_type)} · {formatDateTime(row.created_at)}</p>
          <h2 className="mt-2 text-xl font-bold text-ink">{row.title}</h2>
          {row.description ? <p className="mt-3 text-sm leading-6 text-slate-600">{row.description}</p> : null}
        </article>
      ))}
    </div>
  );
}
