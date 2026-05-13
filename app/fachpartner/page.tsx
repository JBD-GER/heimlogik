import type { Metadata } from "next";
import {
  Building2,
  Cable,
  DraftingCompass,
  Hotel,
  SunMedium,
  Wrench,
  Zap,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Für Fachpartner | Heimlogik",
  description:
    "Heimlogik unterstützt Elektriker, SHK-Betriebe, Sonnenschutzbetriebe, PV- und Wallbox-Anbieter, Ferienwohnungs-Verwalter sowie Architekten bei Smart-Home-Projekten.",
  alternates: { canonical: "/fachpartner" },
  openGraph: {
    title: "Für Fachpartner | Heimlogik",
    description:
      "Smart-Home-Unterstützung für Fachbetriebe: Planung, Systemauswahl, Programmierung, Einweisung und Support.",
    url: "/fachpartner",
  },
};

const partnerAreas = [
  {
    title: "Für Elektriker",
    text: "Unterstützung bei Systemauswahl, Funktionsplanung, Programmierung, Visualisierung und Übergabe.",
    icon: Cable,
  },
  {
    title: "Für SHK-Betriebe",
    text: "Smarte Heizungssteuerung, Raumlogik, Thermostate, Sensorik und verständliche App-Strukturen.",
    icon: Wrench,
  },
  {
    title: "Für Rollladen- & Sonnenschutzbetriebe",
    text: "Beschattung, Szenen, Zeitlogiken, Wetterbezug und Bedienkonzepte für Privat- und Gewerbeobjekte.",
    icon: SunMedium,
  },
  {
    title: "Für PV-/Wallbox-Anbieter",
    text: "Einbindung von Energieflüssen, Lastlogik, Verbrauchsvisualisierung und Smart-Home-Schnittstellen.",
    icon: Zap,
  },
  {
    title: "Für Ferienwohnungs-Verwalter",
    text: "Zutritt, Heizung, Nutzerrechte, Fernzugriff und Supportstrukturen für effizientere Objektbetreuung.",
    icon: Hotel,
  },
  {
    title: "Für Architekten & Planer",
    text: "Frühe Funktionsplanung, Systementscheidungen und Abstimmung zwischen Bauherr, Gewerken und Technik.",
    icon: DraftingCompass,
  },
];

export default function FachpartnerPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Für Fachpartner", href: "/fachpartner" }]} />
      <section className="section-pad bg-white">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Für Fachpartner</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              Smart-Home-Unterstützung für Fachbetriebe
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Heimlogik unterstützt Fachbetriebe bei Smart-Home-Projekten - von Planung und Systemauswahl bis Programmierung,
              Einweisung und Support. Elektro- und Montagearbeiten bleiben beim jeweiligen Fachbetrieb.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-800">
              <a href="/kontakt" className="rounded-md bg-accent px-4 py-3 text-ink">
                Zusammenarbeit besprechen
              </a>
              <a href="tel:057618429666" className="rounded-md border border-slate-300 px-4 py-3">
                05761 8429666
              </a>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {partnerAreas.map(({ title, text, icon: Icon }) => (
              <article key={title} className="rounded-md border border-slate-200 bg-paper p-6 shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-ink">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Zusammenarbeit</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Klare Rollen, saubere Übergabe</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Planung und Systemauswahl passend zum Objekt",
              "Programmierung von Szenen, Logiken und Visualisierung",
              "Einweisung für Betrieb, Kunde und interne Ansprechpartner",
              "Support bei Erweiterungen, Anpassungen und App-Fragen",
            ].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-white p-5 text-sm font-medium leading-6 text-slate-700">
                <Building2 className="mb-3 h-5 w-5 text-accent" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Smart-Home-Projekt gemeinsam umsetzen?"
        text="Beschreiben Sie kurz, für welches Gewerk oder Projekt Sie Unterstützung brauchen. Heimlogik klärt mit Ihnen die passende Rolle im Projekt."
        primary="Fachpartner-Anfrage senden"
      />
    </>
  );
}
