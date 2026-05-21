import type { Metadata } from "next";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/dashboard/format";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Rechnungen",
};

type InvoiceRow = {
  id: string;
  invoice_number: string;
  title: string | null;
  status: string;
  gross_amount: number | null;
  invoice_at: string | null;
  due_at: string | null;
  paid_at: string | null;
  projects?: { project_name: string | null } | null;
};

export default async function RechnungenPage() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, title, status, gross_amount, invoice_at, due_at, paid_at, projects(project_name)")
    .order("created_at", { ascending: false })
    .limit(100);
  const invoices = (data ?? []) as unknown as InvoiceRow[];

  return (
    <div className="grid gap-8">
      <PageHeader title="Rechnungen" description="Rechnungen, Fälligkeiten, Zahlungsstatus und Projektbezug." />
      {error ? (
        <EmptyState title="Rechnungen konnten nicht geladen werden" description={error.message} />
      ) : invoices.length === 0 ? (
        <EmptyState title="Noch keine Rechnungen" description="Rechnungen werden später projektbezogen erstellt." />
      ) : (
        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <article key={invoice.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink">{invoice.invoice_number} · {invoice.title ?? "Rechnung"}</h2>
                  <p className="mt-2 text-sm text-slate-600">{invoice.projects?.project_name ?? "Projekt nicht gesetzt"}</p>
                </div>
                <StatusBadge value={invoice.status} />
              </div>
              <p className="mt-4 text-sm text-slate-600">Brutto: {formatCurrency(invoice.gross_amount)} · Fällig: {formatDate(invoice.due_at)} · Bezahlt: {formatDate(invoice.paid_at)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
