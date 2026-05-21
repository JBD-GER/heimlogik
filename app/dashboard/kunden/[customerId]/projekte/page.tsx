import Link from "next/link";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { EuroInput } from "@/components/dashboard/EuroInput";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/dashboard/format";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { projectSystemOptions } from "@/lib/dashboard/system-options";
import { fullStaffName, partnerAreaLabel, staffTitleLabel } from "@/lib/dashboard/team";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = {
  params: Promise<{ customerId: string }>;
  searchParams?: Promise<{ neu?: string }>;
};

type StaffMemberRow = {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
};

type PartnerRow = {
  id: string;
  company_name: string;
  area: string | null;
};

export default async function CustomerProjectsPage({ params, searchParams }: PageProps) {
  const { customerId } = await params;
  const query = (await searchParams) ?? {};
  const showProjectForm = query.neu === "1";
  const { projects, properties } = await getCustomerContext(customerId);
  const supabase = createSupabaseAdminClient();
  const [staffResult, partnersResult] = await Promise.all([
    supabase.from("staff_members").select("id, first_name, last_name, title").eq("is_active", true).order("last_name", { ascending: true }),
    supabase.from("professional_partners").select("id, company_name, area").eq("is_active", true).order("company_name", { ascending: true }),
  ]);
  const staffMembers = (staffResult.data ?? []) as StaffMemberRow[];
  const partners = (partnersResult.data ?? []) as PartnerRow[];

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Kunde"
        title="Projekte"
        description="Hier werden die Smart-Home-Projekte des Kunden angelegt und geöffnet. Im Projekt liegen dann Gebäude, Planung, Ansprechpartner und Dokumentation."
        action={
          <Link href={`/dashboard/kunden/${customerId}/projekte?neu=1#projekt-anlegen`} className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
            Projekt anlegen
          </Link>
        }
      />

      <section id="projekt-anlegen" className={`${showProjectForm ? "order-2" : "hidden"} rounded-md border border-slate-200 bg-white p-5 shadow-sm`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-ink">Projekt anlegen</h2>
          <Link href={`/dashboard/kunden/${customerId}/projekte`} className="focus-ring inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Abbrechen
          </Link>
        </div>
        <form action={`/api/dashboard/customers/${customerId}/projects`} method="post" className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Projektname
              <input name="project_name" required placeholder="z.B. Smart Home Einfamilienhaus Leese" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Gebäude
              <select name="property_id" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="">Neues Gebäude anlegen</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.property_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Name für neues Gebäude
              <input name="property_name" placeholder="z.B. Einfamilienhaus Leese" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Gebäudetyp
              <select name="building_type" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="single_family_house">Einfamilienhaus</option>
                <option value="multi_family_house">Mehrfamilienhaus</option>
                <option value="apartment">Wohnung</option>
                <option value="commercial">Gewerbe</option>
                <option value="office">Büro</option>
                <option value="medical_practice">Praxis</option>
                <option value="other">Sonstiges</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Bauphase
              <select name="construction_phase" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="existing">Bestand</option>
                <option value="new_build_planning">Neubauplanung</option>
                <option value="shell_construction">Rohbau</option>
                <option value="renovation">Sanierung</option>
                <option value="other">Sonstiges</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Status
              <select name="project_status" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="new">Neu</option>
                <option value="initial_consultation">Erstgespräch</option>
                <option value="planning">Planung</option>
                <option value="offer">Angebot</option>
                <option value="commissioned">Beauftragt</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Priorität
              <select name="priority" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="normal">Normal</option>
                <option value="low">Niedrig</option>
                <option value="high">Hoch</option>
                <option value="critical">Kritisch</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Geplanter Start
              <input name="planned_start_at" type="date" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Geplantes Ende
              <input name="planned_end_at" type="date" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Gepl. Projektbudget
              <EuroInput name="rough_budget" placeholder="z.B. 25.000,00 €" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Beschreibung / Kundenwunsch
            <textarea name="description" placeholder="Kurz beschreiben, was geplant ist und was der Kunde sich wünscht" className="min-h-28 rounded-md border border-slate-200 px-3 py-2 font-normal" />
          </label>
          <fieldset className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
            <legend className="px-1 text-sm font-bold text-ink">Mitarbeiter optional</legend>
            {staffResult.error ? (
              <p className="text-sm leading-6 text-amber-700">Mitarbeiter-Tabelle fehlt noch. Bitte Migration supabase/team_and_partners.sql ausführen.</p>
            ) : staffMembers.length ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {staffMembers.map((staff) => (
                  <label key={staff.id} className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" name="staff_member_ids" value={staff.id} className="h-4 w-4 rounded border-slate-300 accent-ink" />
                    <span>
                      {fullStaffName(staff)}
                      <span className="block text-xs font-normal text-slate-500">{staffTitleLabel(staff.title)}</span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Noch keine Mitarbeiter angelegt.</p>
            )}
          </fieldset>
          <fieldset className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
            <legend className="px-1 text-sm font-bold text-ink">Fachpartner optional</legend>
            {partnersResult.error ? (
              <p className="text-sm leading-6 text-amber-700">Fachpartner-Tabelle fehlt noch. Bitte Migration supabase/team_and_partners.sql ausführen.</p>
            ) : partners.length ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {partners.map((partner) => (
                  <label key={partner.id} className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" name="professional_partner_ids" value={partner.id} className="h-4 w-4 rounded border-slate-300 accent-ink" />
                    <span>
                      {partner.company_name}
                      <span className="block text-xs font-normal text-slate-500">{partnerAreaLabel(partner.area)}</span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Noch keine Fachpartner angelegt.</p>
            )}
          </fieldset>
          <fieldset className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
            <legend className="px-1 text-sm font-bold text-ink">Systeme optional</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {projectSystemOptions.map((system) => (
                <label key={system.value} className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                  <input type="checkbox" name="systems" value={system.value} className="h-4 w-4 rounded border-slate-300 accent-ink" />
                  <span>{system.label}</span>
                </label>
              ))}
            </div>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Individuelles System
              <input name="custom_systems" placeholder="z.B. Gira X1, DoorBird, Homematic IP" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
            </label>
          </fieldset>
          <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
            Projekt speichern
          </button>
        </form>
      </section>

      <div className="order-3">
        {projects.length === 0 ? (
          <EmptyState title="Noch keine Projekte" description="Klicke oben auf Projekt anlegen, um das erste Projekt für diesen Kunden zu erstellen." />
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/kunden/${customerId}/projekte/${project.id}`} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm hover:border-accent">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-ink">{project.project_name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.description ?? "Noch keine Beschreibung / Kundenwunsch hinterlegt."}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge value={project.project_status} />
                    <StatusBadge value={project.priority} />
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <span>Start: {formatDate(project.planned_start_at)}</span>
                  <span>Ende: {formatDate(project.planned_end_at)}</span>
                  <span>Gepl. Projektbudget: {formatCurrency(project.rough_budget)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
