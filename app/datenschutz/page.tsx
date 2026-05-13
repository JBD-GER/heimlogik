import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzhinweise von Heimlogik.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Datenschutz", href: "/datenschutz" }]} />
      <section className="section-pad bg-white">
        <div className="container-page max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Datenschutzhinweise</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink">Datenschutz</h1>
          <div className="mt-8 space-y-7 rounded-md border border-slate-200 bg-paper p-6 text-slate-800">
            <p className="font-semibold">
              Wir verarbeiten personenbezogene Daten nur, soweit dies für den Betrieb dieser Website, die Bearbeitung von Anfragen und die von Ihnen erlaubten Dienste erforderlich ist.
            </p>
            <section>
              <h2 className="text-xl font-bold text-ink">Verantwortlicher</h2>
              <p className="mt-3 leading-7">
                {siteConfig.legalCompanyName}
                <br />
                {siteConfig.addressLine}
                <br />
                E-Mail: {siteConfig.email}
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Kontaktformular</h2>
              <p className="mt-3 leading-7">
                Angaben aus dem Formular werden zur Bearbeitung der Anfrage verarbeitet. Dazu können Name, Telefonnummer, E-Mail-Adresse, Ort, Immobilientyp, gewünschte Leistung und Nachricht gehören.
              </p>
              <p className="mt-3 leading-7">
                Die Verarbeitung erfolgt zur Durchführung vorvertraglicher Maßnahmen und zur Kommunikation mit Ihnen. Wir speichern diese Daten nur so lange, wie es für die Bearbeitung Ihrer Anfrage und gesetzliche Aufbewahrungspflichten erforderlich ist.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Cookies und Einwilligung</h2>
              <p className="mt-3 leading-7">
                Notwendige Cookies und lokale Speichereinträge dienen dem Betrieb der Website und der Speicherung Ihrer Cookie-Auswahl. Marketing-Dienste werden nur geladen, wenn Sie zuvor eingewilligt haben.
              </p>
              <div className="mt-4 inline-flex rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
                <CookieSettingsButton />
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Google Ads Conversion-Tracking</h2>
              <p className="mt-3 leading-7">
                Wenn Sie Marketing-Cookies zustimmen, kann Google Ads Conversion-Tracking eingesetzt werden, um die Wirksamkeit von Anzeigen und Formularanfragen zu messen. Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei können Nutzungsdaten, Geräteinformationen, Referrer, ungefähre Standortdaten und Interaktionen mit Anzeigen verarbeitet werden.
              </p>
              <p className="mt-3 leading-7">
                Der Google Consent Mode v2 ist so eingerichtet, dass Marketing- und Analyse-Speicher standardmäßig abgelehnt sind und erst nach Ihrer Einwilligung aktualisiert werden. Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung, die Sie jederzeit über die Cookie-Einstellungen widerrufen können.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Hosting, Server-Logs und Sicherheit</h2>
              <p className="mt-3 leading-7">
                Diese Website wird bei Vercel gehostet. Anbieter ist Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Beim Aufruf der Website verarbeitet Vercel technisch erforderliche Daten wie IP-Adresse, Datum und Uhrzeit des Zugriffs, angefragte Seite, Browser- und Geräteinformationen sowie Server-Logdaten, um die Website auszuliefern, stabil zu betreiben und Angriffe abzuwehren.
              </p>
              <p className="mt-3 leading-7">
                Wir achten auf eine datensparsame Verarbeitung und angemessene technische und organisatorische Maßnahmen, damit personenbezogene Daten geschützt verarbeitet werden.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-ink">Betroffenenrechte</h2>
              <p className="mt-3 leading-7">
                Sie haben im Rahmen der gesetzlichen Voraussetzungen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Außerdem können Sie erteilte Einwilligungen jederzeit mit Wirkung für die Zukunft widerrufen und sich bei einer Datenschutzaufsichtsbehörde beschweren.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
