import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzhinweise von Heimlogik mit Platzhaltern für die finale rechtliche Prüfung.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Datenschutz", href: "/datenschutz" }]} />
      <section className="section-pad bg-white">
        <div className="container-page max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Platzhalter</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink">Datenschutz</h1>
          <div className="mt-8 space-y-7 rounded-md border border-amber-200 bg-amber-50 p-6 text-slate-800">
            <p className="font-semibold">
              Diese Datenschutzerklärung ist ein Platzhalter und keine Rechtsberatung. Bitte vor Veröffentlichung prüfen und an die tatsächlichen Dienste, Hosting-Anbieter und Prozesse anpassen.
            </p>
            <section>
              <h2 className="text-xl font-bold text-ink">Verantwortlicher</h2>
              <p className="mt-3 leading-7">
                {siteConfig.legalCompanyName}
                <br />
                {siteConfig.address.streetAddress}
                <br />
                {siteConfig.address.postalCode} {siteConfig.address.addressLocality}
                <br />
                E-Mail: {siteConfig.email}
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Kontaktformular</h2>
              <p className="mt-3 leading-7">
                Angaben aus dem Formular werden zur Bearbeitung der Anfrage verarbeitet. Dazu können Name, Telefonnummer, E-Mail-Adresse, Ort, Immobilientyp, gewünschte Leistung und Nachricht gehören.
              </p>
              <p className="mt-3 leading-7">Rechtsgrundlage, Speicherdauer und Empfänger müssen final ergänzt werden.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Cookies und Einwilligung</h2>
              <p className="mt-3 leading-7">
                Die Website enthält eine Cookie-Einstellungsstruktur. Notwendige Cookies dienen dem Betrieb der Website. Analyse- und Marketing-Dienste sind als Platzhalter vorbereitet und sollten erst nach wirksamer Einwilligung aktiviert werden.
              </p>
              <div className="mt-4 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
                <CookieSettingsButton />
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Tracking-Platzhalter</h2>
              <p className="mt-3 leading-7">
                Vorbereitet sind Platzhalter für Google Analytics, Google Ads und Meta Pixel. Vor einer Aktivierung müssen Anbieter, Zwecke, Rechtsgrundlagen, Speicherdauer, Opt-out-Möglichkeiten und Drittlandübermittlungen geprüft und ergänzt werden.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Hosting, Server-Logs und Sicherheit</h2>
              <p className="mt-3 leading-7">
                Hosting-Anbieter, Serverstandort, Logdaten, Aufbewahrungsfristen und technische Schutzmaßnahmen müssen nach dem tatsächlichen Hosting-Setup ergänzt werden.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Betroffenenrechte</h2>
              <p className="mt-3 leading-7">
                Informationen zu Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch, Datenübertragbarkeit und Beschwerderecht bei einer Aufsichtsbehörde müssen final juristisch geprüft werden.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
