import { Building2, Handshake, Mail, Phone, Smartphone, UserRound } from "lucide-react";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { customerName } from "@/lib/dashboard/format";
import { fullStaffName, partnerAreaLabel, staffTitleLabel } from "@/lib/dashboard/team";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string; projectId: string }> };

type StaffMemberRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string;
  image_storage_path: string | null;
};

type PartnerRow = {
  id: string;
  company_name: string;
  area: string | null;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_storage_path: string | null;
};

export default async function ProjectContactsPage({ params }: PageProps) {
  const { customerId, projectId } = await params;
  const { customer, project } = await getProjectContext(customerId, projectId);

  if (!customer || !project) return null;

  const supabase = createSupabaseAdminClient();
  const [assignedStaffIdsResult, assignedPartnerIdsResult, allStaffResult, allPartnersResult] = await Promise.all([
    supabase.from("project_staff_members").select("staff_member_id").eq("project_id", projectId),
    supabase.from("project_professional_partners").select("professional_partner_id").eq("project_id", projectId),
    supabase.from("staff_members").select("id, first_name, last_name, email, phone, title, image_storage_path").eq("is_active", true).order("last_name", { ascending: true }),
    supabase.from("professional_partners").select("id, company_name, area, street, house_number, postal_code, city, phone, email, website, logo_storage_path").eq("is_active", true).order("company_name", { ascending: true }),
  ]);

  const assignedStaffIds = new Set((assignedStaffIdsResult.data ?? []).map((row) => row.staff_member_id as string));
  const assignedPartnerIds = new Set((assignedPartnerIdsResult.data ?? []).map((row) => row.professional_partner_id as string));
  const allStaff = (allStaffResult.data ?? []) as StaffMemberRow[];
  const allPartners = (allPartnersResult.data ?? []) as PartnerRow[];
  const assignedStaff = allStaff.filter((staff) => assignedStaffIds.has(staff.id));
  const availableStaff = allStaff.filter((staff) => !assignedStaffIds.has(staff.id));
  const assignedPartners = allPartners.filter((partner) => assignedPartnerIds.has(partner.id));
  const availablePartners = allPartners.filter((partner) => !assignedPartnerIds.has(partner.id));
  const assignmentApiPath = `/api/dashboard/customers/${customerId}/projects/${projectId}/assignments`;
  const migrationMissing = Boolean(assignedStaffIdsResult.error || assignedPartnerIdsResult.error || allStaffResult.error || allPartnersResult.error);

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Projekt" title="Ansprechpartner" description="Kundenkontakt, internes Projektteam und zugewiesene Fachpartner." />

      {migrationMissing ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Die Team-/Fachpartner-Tabellen fehlen noch. Bitte die Migration <strong>supabase/team_and_partners.sql</strong> in Supabase ausführen.
        </section>
      ) : null}

      <InfoCard title="Kunde">
        <div className="grid gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 font-bold text-ink">
            <UserRound className="h-4 w-4 text-accent" aria-hidden="true" />
            {customerName(customer)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {customer.email ?? "Keine E-Mail hinterlegt"}
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {customer.phone ?? "Keine Telefonnummer hinterlegt"}
          </span>
          <span className="inline-flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-slate-400" aria-hidden="true" />
            {customer.mobile ?? "Keine Mobilnummer hinterlegt"}
          </span>
        </div>
      </InfoCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <InfoCard title="Projektteam">
          {assignedStaff.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">Noch kein Mitarbeiter zugewiesen. Weise unten einen oder mehrere Mitarbeiter dem Projekt zu.</p>
          ) : (
            <div className="grid gap-3">
              {assignedStaff.map((staff) => (
                <article key={staff.id} className="rounded-md border border-slate-200 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-500">
                      {staff.image_storage_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/api/dashboard/staff-members/${staff.id}/image`} alt={fullStaffName(staff)} className="h-full w-full object-cover" />
                      ) : (
                        <UserRound className="h-5 w-5" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-ink">{fullStaffName(staff)}</h2>
                      <p className="mt-1 text-sm text-slate-600">{staffTitleLabel(staff.title)} · {staff.phone ?? "keine Telefonnummer"}</p>
                    </div>
                    <form action={assignmentApiPath} method="post">
                      <input type="hidden" name="_intent" value="remove_staff" />
                      <input type="hidden" name="staff_member_id" value={staff.id} />
                      <button className="focus-ring min-h-10 rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50">
                        Entfernen
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}

          {availableStaff.length ? (
            <form action={assignmentApiPath} method="post" className="mt-5 grid gap-3 border-t border-slate-100 pt-5">
              <input type="hidden" name="_intent" value="add" />
              <p className="text-sm font-bold text-ink">Mitarbeiter hinzufügen</p>
              <div className="grid gap-2">
                {availableStaff.map((staff) => (
                  <label key={staff.id} className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" name="staff_member_ids" value={staff.id} className="h-4 w-4 accent-ink" />
                    {fullStaffName(staff)} · {staffTitleLabel(staff.title)}
                  </label>
                ))}
              </div>
              <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                Auswahl hinzufügen
              </button>
            </form>
          ) : null}
        </InfoCard>

        <InfoCard title="Fachpartner">
          {assignedPartners.length === 0 ? (
            <p className="text-sm leading-6 text-slate-600">Noch kein Fachpartner zugewiesen. Füge unten Elektriker, Planer oder andere Partner hinzu.</p>
          ) : (
            <div className="grid gap-3">
              {assignedPartners.map((partner) => (
                <article key={partner.id} className="rounded-md border border-slate-200 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-500">
                      {partner.logo_storage_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/api/dashboard/professional-partners/${partner.id}/logo`} alt={`${partner.company_name} Logo`} className="h-full w-full object-contain p-1" />
                      ) : (
                        <Building2 className="h-5 w-5" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-ink">{partner.company_name}</h2>
                      <p className="mt-1 text-xs font-bold uppercase text-accent">{partnerAreaLabel(partner.area)}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {[partner.street, partner.house_number].filter(Boolean).join(" ")} {partner.postal_code} {partner.city}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">{partner.phone ?? "keine Telefonnummer"} · {partner.email ?? "keine E-Mail"}</p>
                    </div>
                    <form action={assignmentApiPath} method="post">
                      <input type="hidden" name="_intent" value="remove_partner" />
                      <input type="hidden" name="professional_partner_id" value={partner.id} />
                      <button className="focus-ring min-h-10 rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50">
                        Entfernen
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}

          {availablePartners.length ? (
            <form action={assignmentApiPath} method="post" className="mt-5 grid gap-3 border-t border-slate-100 pt-5">
              <input type="hidden" name="_intent" value="add" />
              <p className="inline-flex items-center gap-2 text-sm font-bold text-ink">
                <Handshake className="h-4 w-4 text-accent" aria-hidden="true" />
                Fachpartner hinzufügen
              </p>
              <div className="grid gap-2">
                {availablePartners.map((partner) => (
                  <label key={partner.id} className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
                    <input type="checkbox" name="professional_partner_ids" value={partner.id} className="h-4 w-4 accent-ink" />
                    <span>
                      {partner.company_name}
                      <span className="block text-xs font-normal text-slate-500">{partnerAreaLabel(partner.area)}</span>
                    </span>
                  </label>
                ))}
              </div>
              <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                Auswahl hinzufügen
              </button>
            </form>
          ) : null}
        </InfoCard>
      </div>
    </div>
  );
}
