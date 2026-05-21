import { EmptyState } from "@/components/dashboard/EmptyState";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { formatCurrency, formatDate } from "@/lib/dashboard/format";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string; projectId: string }> };

type CareContractRow = {
  id: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sla_level: string | null;
  monthly_fee: number | null;
  response_time: string | null;
  maintenance_interval: string | null;
  next_maintenance_at: string | null;
  notes: string | null;
};

type SupportCaseRow = {
  id: string;
  title: string;
  priority: string;
  status: string;
  error_category: string | null;
  created_at: string;
};

export default async function ProjectCarePage({ params }: PageProps) {
  const { customerId, projectId } = await params;
  const { project } = await getProjectContext(customerId, projectId);
  const supabase = createSupabaseAdminClient();

  const [{ data: contracts }, { data: supportCases }] = await Promise.all([
    supabase
      .from("care_contracts")
      .select("id, is_active, starts_at, ends_at, sla_level, monthly_fee, response_time, maintenance_interval, next_maintenance_at, notes")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
    supabase
      .from("support_cases")
      .select("id, title, priority, status, error_category, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  ]);

  const contract = (contracts?.[0] ?? null) as CareContractRow | null;
  const cases = (supportCases ?? []) as SupportCaseRow[];

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Projekt" title="Betreuung" description={project?.project_name ?? "Betreuung und Support"} />

      {!contract ? (
        <EmptyState title="Noch keine Betreuung hinterlegt" description="Hier landen später Betreuungsvertrag, SLA, Wartungsintervall und Supportfälle für das Projekt." />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <InfoCard title="Betreuungsvertrag">
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={contract.is_active ? "aktiv" : "inaktiv"} />
              {contract.sla_level ? <StatusBadge value={contract.sla_level} /> : null}
            </div>
            <dl className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="font-bold text-ink">Vertragsbeginn</dt>
                <dd className="mt-1">{formatDate(contract.starts_at)}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink">Vertragsende</dt>
                <dd className="mt-1">{formatDate(contract.ends_at)}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink">Monatliche Pauschale</dt>
                <dd className="mt-1">{formatCurrency(contract.monthly_fee)}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink">Nächste Wartung</dt>
                <dd className="mt-1">{formatDate(contract.next_maintenance_at)}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink">Reaktionszeit</dt>
                <dd className="mt-1">{contract.response_time ?? "Nicht hinterlegt"}</dd>
              </div>
              <div>
                <dt className="font-bold text-ink">Wartungsintervall</dt>
                <dd className="mt-1">{contract.maintenance_interval ?? "Nicht hinterlegt"}</dd>
              </div>
            </dl>
            {contract.notes ? <p className="mt-5 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">{contract.notes}</p> : null}
          </InfoCard>

          <InfoCard title="Supportfälle">
            {cases.length === 0 ? (
              <p className="text-sm leading-6 text-slate-600">Noch keine Supportfälle für dieses Projekt.</p>
            ) : (
              <div className="grid gap-3">
                {cases.map((supportCase) => (
                  <article key={supportCase.id} className="rounded-md border border-slate-200 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="font-bold text-ink">{supportCase.title}</h2>
                        <p className="mt-1 text-xs text-slate-500">
                          {supportCase.error_category ?? "Ohne Kategorie"} · erstellt {formatDate(supportCase.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={supportCase.status} />
                        <StatusBadge value={supportCase.priority} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </InfoCard>
        </div>
      )}
    </div>
  );
}
