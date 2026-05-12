import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "AGB",
  description: "AGB-Platzhalter für Heimlogik. Vor Veröffentlichung rechtlich prüfen lassen.",
  alternates: { canonical: "/agb" },
  openGraph: { title: "AGB", description: "AGB-Platzhalter für Heimlogik.", url: "/agb" },
};

export default function AgbPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "AGB", href: "/agb" }]} />
      <section className="section-pad bg-white">
        <div className="container-page max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Platzhalter</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink">Allgemeine Geschäftsbedingungen</h1>
          <div className="mt-8 space-y-7 rounded-md border border-amber-200 bg-amber-50 p-6 text-slate-800">
            <p className="font-semibold">
              Diese AGB sind ein strukturierter Platzhalter und keine Rechtsberatung. Bitte vor Nutzung durch eine geeignete Rechtsberatung prüfen und an Ihr Geschäftsmodell anpassen.
            </p>
            <section>
              <h2 className="text-xl font-bold text-ink">1. Geltungsbereich</h2>
              <p className="mt-3 leading-7">
                Diese Bedingungen gelten für Beratungs-, Planungs-, Einrichtungs-, Montage- und Supportleistungen von {siteConfig.legalCompanyName}.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">2. Leistungen</h2>
              <p className="mt-3 leading-7">
                Heimlogik bietet Smart-Home-Beratung, Planung, Nachrüstung, Montage, App-Einrichtung, Systemintegration, Einweisung und Support an. Der konkrete Leistungsumfang ergibt sich aus Angebot, Auftragsbestätigung oder individueller Vereinbarung.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">3. Elektroarbeiten</h2>
              <p className="mt-3 leading-7">{siteConfig.electricianPartnerText}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">4. Mitwirkung des Kunden</h2>
              <p className="mt-3 leading-7">
                Der Kunde stellt erforderliche Informationen, Zugänge, WLAN-Daten, Gerätezugänge und Berechtigungen rechtzeitig bereit. Zugangsdaten sollten sicher übergeben und nach Projektabschluss bei Bedarf geändert werden.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">5. Preise, Zahlung und Termine</h2>
              <p className="mt-3 leading-7">
                Preise, Zahlungsbedingungen, Fahrtkosten, Materialkosten und Termine müssen im Angebot oder in einer separaten Vereinbarung geregelt werden.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">6. Gewährleistung und Haftung</h2>
              <p className="mt-3 leading-7">
                Regelungen zu Gewährleistung, Haftung, Drittprodukten, Funkverbindungen, Cloud-Diensten und Hersteller-Apps müssen juristisch geprüft und ergänzt werden.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">7. Datenschutz</h2>
              <p className="mt-3 leading-7">
                Informationen zur Verarbeitung personenbezogener Daten finden sich in der Datenschutzerklärung. Die tatsächliche Verarbeitung muss dort final beschrieben werden.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
