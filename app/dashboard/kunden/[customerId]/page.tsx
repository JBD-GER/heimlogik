import Link from "next/link";
import { AlertTriangle, FileCheck2, Mail, Pencil, Phone, Smartphone } from "lucide-react";
import { DeleteCustomerForm } from "@/components/dashboard/DeleteCustomerForm";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getCustomerContext, getLatestCustomerDsgvoConsent } from "@/lib/dashboard/customer-data";
import { customerName, formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";

type CustomerOverviewPageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function CustomerOverviewPage({ params }: CustomerOverviewPageProps) {
  const { customerId } = await params;
  const { customer, addresses, properties, projects } = await getCustomerContext(customerId);

  if (!customer) return null;

  const dsgvoConsent = await getLatestCustomerDsgvoConsent(customerId);
  const primaryAddress = addresses.find((address) => address.address_type === "primary");
  const billingAddress = addresses.find((address) => address.address_type === "billing");
  const isBusiness = customer.customer_type === "business";

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Kunde"
        title="Übersicht"
        description="Stammdaten, Kontaktwege, Adressen und Projektstatus."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/kunden/${customerId}/bearbeiten`} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Kunde bearbeiten
            </Link>
            <DeleteCustomerForm action={`/api/dashboard/customers/${customerId}`} customerName={customerName(customer)} />
          </div>
        }
      />

      <section className={`rounded-md border p-5 shadow-sm ${dsgvoConsent ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            {dsgvoConsent ? <FileCheck2 className="mt-1 h-5 w-5 text-emerald-700" aria-hidden="true" /> : <AlertTriangle className="mt-1 h-5 w-5 text-amber-700" aria-hidden="true" />}
            <div>
              <h2 className="font-bold text-ink">{dsgvoConsent ? "DSGVO-Einwilligung liegt vor" : "DSGVO-Einwilligung fehlt"}</h2>
              <p className="mt-1 text-sm text-slate-700">
                {dsgvoConsent ? `Dokument erstellt am ${formatDate(dsgvoConsent.created_at)}.` : "Bitte Einwilligung erzeugen und vom Kunden unterschreiben lassen."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {dsgvoConsent ? (
              <a href={`/api/dashboard/customers/${customerId}/files/${dsgvoConsent.id}`} className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-white px-4 text-sm font-bold text-slate-800 hover:bg-slate-50">
                Dokument herunterladen
              </a>
            ) : null}
            <Link href={`/dashboard/kunden/${customerId}/dsgvo`} className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
              {dsgvoConsent ? "Einwilligung ansehen" : "DSGVO-Zustimmung erzeugen"}
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <InfoCard title="Stammdaten">
          <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            {isBusiness ? (
              <>
                <div>
                  <dt className="font-bold text-ink">Firmenname</dt>
                  <dd className="mt-1">{customer.company_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">Ansprechpartner</dt>
                  <dd className="mt-1">{customer.contact_person ?? "—"}</dd>
                </div>
              </>
            ) : (
              <>
                <div>
                  <dt className="font-bold text-ink">Vorname</dt>
                  <dd className="mt-1">{customer.first_name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">Nachname</dt>
                  <dd className="mt-1">{customer.last_name ?? "—"}</dd>
                </div>
              </>
            )}
            <div>
              <dt className="font-bold text-ink">Erstellt</dt>
              <dd className="mt-1">{formatDate(customer.created_at)}</dd>
            </div>
            <div>
              <dt className="font-bold text-ink">Aktualisiert</dt>
              <dd className="mt-1">{formatDate(customer.updated_at)}</dd>
            </div>
          </dl>
          {customer.notes ? <p className="mt-5 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-700">{customer.notes}</p> : null}
        </InfoCard>

        <InfoCard title="Projektstand">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Objekte", properties.length],
              ["Projekte", projects.length],
              ["Aktive Projekte", projects.filter((project) => !["completed", "lost"].includes(project.project_status)).length],
              ["Betreuung", projects.filter((project) => ["care", "completed"].includes(project.project_status)).length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="Kontakt">
          <div className="grid gap-3 text-sm text-slate-600">
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

        <InfoCard title="Einordnung">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Art", customer.customer_type],
              ["Status", customer.customer_status],
              ["Leadquelle", customer.lead_source],
            ].map(([title, value]) => (
              <div key={title} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
                <div className="mt-3">
                  <StatusBadge value={value} />
                </div>
              </div>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="Adressen">
          <div className="grid gap-4 md:grid-cols-2">
            {[primaryAddress, billingAddress].filter(Boolean).map((address) => (
              <div key={address?.id} className="rounded-md border border-slate-200 p-4 text-sm text-slate-600">
                <p className="font-bold text-ink">{labelFor(address?.address_type)}</p>
                <p className="mt-2">
                  {address?.street} {address?.house_number}
                  <br />
                  {address?.postal_code} {address?.city}
                  <br />
                  {address?.country}
                </p>
              </div>
            ))}
            {!primaryAddress && !billingAddress ? <p className="text-sm text-slate-600">Keine Adresse hinterlegt.</p> : null}
          </div>
        </InfoCard>
      </div>
    </div>
  );
}
