import type { Metadata } from "next";
import { Building2, Globe2, Mail, Phone, Wrench } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { partnerAreaLabel, professionalPartnerAreaOptions } from "@/lib/dashboard/team";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Fachpartner",
};

type PartnerRow = {
  id: string;
  company_name: string;
  area: string | null;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_storage_path: string | null;
  is_active: boolean;
};

export default async function FachpartnerPage() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("professional_partners")
    .select("id, company_name, area, street, house_number, postal_code, city, country, phone, email, website, logo_storage_path, is_active")
    .order("company_name", { ascending: true });
  const partners = (data ?? []) as PartnerRow[];

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Fachpartner"
        description="Externe Fachpartner, Elektriker, Planer und Lieferanten, die Projekten zugeordnet werden können."
        action={
          <a href="#fachpartner-hinzufuegen" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
            Fachpartner hinzufügen
          </a>
        }
      />

      {error ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Die Fachpartner-Tabelle fehlt noch. Bitte die Migration <strong>supabase/team_and_partners.sql</strong> in Supabase ausführen.
        </section>
      ) : null}

      <section id="fachpartner-hinzufuegen" className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-ink">Fachpartner hinzufügen</h2>
        <form action="/api/dashboard/professional-partners" method="post" encType="multipart/form-data" className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
              Firmenname
              <input name="company_name" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
              Bereich
              <select name="area" required defaultValue="elektrobetrieb" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                {professionalPartnerAreaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Straße
              <input name="street" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Hausnummer
              <input name="house_number" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              PLZ
              <input name="postal_code" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Ort
              <input name="city" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Telefon
              <input name="phone" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              E-Mail
              <input name="email" type="email" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Website
              <input name="website" placeholder="https://..." className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Logo
              <input name="logo" type="file" accept="image/*" className="rounded-md border border-slate-200 bg-white px-3 py-2 font-normal" />
            </label>
          </div>
          <input type="hidden" name="country" value="Deutschland" />
          <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
            Fachpartner speichern
          </button>
        </form>
      </section>

      {partners.length === 0 && !error ? (
        <EmptyState title="Noch keine Fachpartner" description="Lege oben den ersten Fachpartner an." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {partners.map((partner) => (
            <article key={partner.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-500">
                  {partner.logo_storage_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/dashboard/professional-partners/${partner.id}/logo`} alt={`${partner.company_name} Logo`} className="h-full w-full object-contain p-1" />
                  ) : (
                    <Building2 className="h-7 w-7" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="truncate text-xl font-bold text-ink">{partner.company_name}</h2>
                      <p className="mt-1 inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        <Wrench className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                        {partnerAreaLabel(partner.area)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {[partner.street, partner.house_number].filter(Boolean).join(" ")} {partner.postal_code} {partner.city}
                      </p>
                    </div>
                    <StatusBadge value={partner.is_active ? "active" : "inactive"} />
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {partner.phone ?? "Keine Telefonnummer"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {partner.email ?? "Keine E-Mail"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {partner.website ?? "Keine Website"}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
