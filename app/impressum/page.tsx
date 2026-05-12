import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Heimlogik mit klar gekennzeichneten Platzhaltern.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Impressum", href: "/impressum" }]} />
      <section className="section-pad bg-white">
        <div className="container-page max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Platzhalter</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink">Impressum</h1>
          <div className="mt-8 space-y-7 rounded-md border border-amber-200 bg-amber-50 p-6 text-slate-800">
            <p className="font-semibold">
              Diese Seite enthält Platzhalter und muss vor Veröffentlichung rechtlich geprüft und vollständig ausgefüllt werden.
            </p>
            <section>
              <h2 className="text-xl font-bold text-ink">Anbieter</h2>
              <p className="mt-3 leading-7">
                {siteConfig.legalCompanyName}
                <br />
                {siteConfig.address.streetAddress}
                <br />
                {siteConfig.address.postalCode} {siteConfig.address.addressLocality}
                <br />
                Vertreten durch: [VERTRETUNGSBERECHTIGTE PERSON]
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Kontakt</h2>
              <p className="mt-3 leading-7">
                Telefon: {siteConfig.phone}
                <br />
                E-Mail: {siteConfig.email}
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Register, Steuern und Aufsicht</h2>
              <p className="mt-3 leading-7">
                Registergericht / Registernummer: [FALLS VORHANDEN]
                <br />
                Umsatzsteuer-ID: [FALLS VORHANDEN]
                <br />
                Zuständige Aufsichtsbehörde / Kammer: [FALLS ERFORDERLICH]
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Hinweis zu Elektroarbeiten</h2>
              <p className="mt-3 leading-7">{siteConfig.electricianPartnerText}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Verbraucherstreitbeilegung</h2>
              <p className="mt-3 leading-7">[ANGABEN ZUR VERBRAUCHERSTREITBEILEGUNG ERGÄNZEN]</p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
