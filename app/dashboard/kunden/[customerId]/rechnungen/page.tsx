import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/dashboard/format";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string }> };
type Row = { id: string; invoice_number: string; title: string | null; status: string; gross_amount: number | null; due_at: string | null; paid_at: string | null };

export default async function CustomerInvoicesPage({ params }: PageProps) {
  const { customerId } = await params;
  const { projectIds } = await getCustomerContext(customerId);
  const supabase = createSupabaseAdminClient();
  const { data } = projectIds.length
    ? await supabase.from("invoices").select("id, invoice_number, title, status, gross_amount, due_at, paid_at").in("project_id", projectIds).order("created_at", { ascending: false })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  if (rows.length === 0) return <EmptyState title="Noch keine Rechnungen" description="Rechnungen werden je Projekt gespeichert und mit PDFs verknüpft." />;

  return (
    <div className="grid gap-4">
      {rows.map((row) => (
        <article key={row.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">{row.invoice_number} · {row.title ?? "Rechnung"}</h2>
              <p className="mt-2 text-sm text-slate-600">Brutto {formatCurrency(row.gross_amount)} · fällig {formatDate(row.due_at)} · bezahlt {formatDate(row.paid_at)}</p>
            </div>
            <StatusBadge value={row.status} />
          </div>
        </article>
      ))}
    </div>
  );
}
