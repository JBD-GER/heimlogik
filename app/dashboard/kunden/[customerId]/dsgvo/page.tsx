import Link from "next/link";
import { FileCheck2 } from "lucide-react";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SignaturePad } from "@/components/dashboard/SignaturePad";
import { getCustomerContext, getLatestCustomerDsgvoConsent } from "@/lib/dashboard/customer-data";
import { buildDsgvoConsentHtml } from "@/lib/dashboard/dsgvo-document";
import { customerName, formatDate } from "@/lib/dashboard/format";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function CustomerDsgvoPage({ params }: PageProps) {
  const { customerId } = await params;
  const { customer, addresses } = await getCustomerContext(customerId);

  if (!customer) return null;

  const consent = await getLatestCustomerDsgvoConsent(customerId);
  const primaryAddress = addresses.find((address) => address.address_type === "primary");
  const previewHtml = buildDsgvoConsentHtml({ customer, primaryAddress });

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Kunde"
        title="DSGVO-Einwilligung"
        description="Kundenbezogene Einwilligung prüfen, unterschreiben lassen und als Dokument beim Kunden ablegen."
        action={
          <Link href={`/dashboard/kunden/${customerId}`} className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Zurück zur Übersicht
          </Link>
        }
      />

      {consent ? (
        <InfoCard title="Einwilligung liegt vor">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <FileCheck2 className="mt-1 h-5 w-5 text-emerald-600" aria-hidden="true" />
              <div>
                <p className="font-bold text-ink">{consent.file_name}</p>
                <p className="mt-1 text-sm text-slate-600">Erstellt am {formatDate(consent.created_at)}</p>
              </div>
            </div>
            <a href={`/api/dashboard/customers/${customerId}/files/${consent.id}`} className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
              Dokument herunterladen
            </a>
          </div>
        </InfoCard>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <section className="touch-scroll-y overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-ink">Vorschau</h2>
            <p className="mt-1 text-sm text-slate-600">Kunde und Datum werden beim Signieren automatisch eingesetzt.</p>
          </div>
          <iframe title="DSGVO Vorschau" srcDoc={previewHtml} className="pointer-events-none h-[70dvh] min-h-[560px] w-full bg-white xl:h-[760px]" />
        </section>

        <InfoCard title="Unterschrift erfassen">
          <form action={`/api/dashboard/customers/${customerId}/dsgvo`} method="post" className="grid gap-4">
            <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-bold text-ink">{customerName(customer)}</p>
              <p className="mt-1">Datum: wird beim Speichern automatisch gesetzt</p>
            </div>
            <SignaturePad name="signature_data" />
            <button className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
              Einwilligung speichern
            </button>
          </form>
        </InfoCard>
      </div>
    </div>
  );
}
