import { InfoCard } from "@/components/dashboard/InfoCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { formatCurrency, formatDate } from "@/lib/dashboard/format";

type PageProps = { params: Promise<{ customerId: string; projectId: string }> };

export default async function ProjectOverviewPage({ params }: PageProps) {
  const { customerId, projectId } = await params;
  const { project, property } = await getProjectContext(customerId, projectId);

  if (!project) return null;

  const description = [project.description, project.customer_requests].filter(Boolean).join("\n\n");

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Projekt" title="Projektübersicht" description={project.project_name} />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <InfoCard title="Status">
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={project.project_status} />
            <StatusBadge value={project.priority} />
          </div>
          <dl className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="font-bold text-ink">Geplanter Start</dt>
              <dd className="mt-1">{formatDate(project.planned_start_at)}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink">Geplantes Ende</dt>
              <dd className="mt-1">{formatDate(project.planned_end_at)}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink">Gepl. Projektbudget</dt>
              <dd className="mt-1">{formatCurrency(project.rough_budget)}</dd>
            </div>
          </dl>
        </InfoCard>

        <InfoCard title="Beschreibung / Kundenwunsch">
          <p className="whitespace-pre-line text-sm leading-6 text-slate-600">{description || "Noch keine Beschreibung / Kundenwunsch hinterlegt."}</p>
        </InfoCard>

        <InfoCard title="Gebäude">
          <p className="text-sm font-bold text-ink">{property?.property_name ?? "Kein Gebäude"}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {[property?.street, property?.house_number].filter(Boolean).join(" ")} {property?.postal_code} {property?.city}
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
