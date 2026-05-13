import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Heimlogik.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Impressum", href: "/impressum" }]} />
      <section className="section-pad bg-white">
        <div className="container-page max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Rechtliches</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink">Impressum</h1>
          <div className="mt-8 space-y-7 rounded-md border border-slate-200 bg-paper p-6 text-slate-800">
            <p className="font-semibold">
              Angaben nach § 5 TMG
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
                Vertretungsberechtigt: Christoph Pfad
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
                Registergericht / HRB: Amtsgericht Hannover HRB 230241
                <br />
                Umsatzsteuer-ID: DE460472563
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Hinweis zu Elektroarbeiten</h2>
              <p className="mt-3 leading-7">{siteConfig.electricianPartnerText}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Verbraucherstreitbeilegung</h2>
              <p className="mt-3 leading-7">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a href="https://ec.europa.eu/consumers/odr" className="font-semibold text-ink underline">
                  https://ec.europa.eu/consumers/odr
                </a>
                . Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p className="mt-3 leading-7">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
