import type { Metadata } from "next";
import Image from "next/image";
import { Cable, CheckCircle2, ClipboardCheck, Settings2, ShieldCheck, Star } from "lucide-react";
import { AdsLeadForm } from "@/components/AdsLeadForm";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Smart Home Installateur & Fachpartner",
  description:
    "Professionelle Smart-Home-Planung für Neubau und Sanierung: herstellerunabhängig, mit Kabelkonzept, Programmierung und Inbetriebnahme.",
  alternates: { canonical: "/smart-home-installateur" },
  openGraph: {
    title: "Smart Home Installateur & Fachpartner | Heimlogik",
    description: "Herstellerunabhängige Smart-Home-Planung, Kabelkonzept und Programmierung für Neubau und Sanierung.",
    url: "/smart-home-installateur",
    images: ["/images/bild_Mitarbeiter.png"],
  },
};

const problemItems = [
  [
    "Kabel fehlen dort, wo später Funktionen gebraucht werden",
    "Beschattung, Präsenzmelder, Türkommunikation, Netzwerk, Wallbox oder zentrale Steuerung lassen sich nur eingeschränkt nachrüsten, wenn das Kabelkonzept nicht früh steht.",
  ],
  [
    "Systeme sprechen nicht sauber miteinander",
    "Licht, Heizung, PV, Audio, Sicherheit und Zutritt landen schnell in einzelnen Apps, statt als verlässliches Gesamtsystem zusammenzuarbeiten.",
  ],
  [
    "Programmierung wird zum Dauerproblem",
    "Szenen, Automationen, Nutzerrechte und Visualisierung brauchen Struktur. Ohne Fachplanung entsteht Technik, die niemand gern bedient.",
  ],
];

const serviceSteps = [
  {
    icon: ClipboardCheck,
    title: "1. Beratung & Budgetierung",
    text: "Wir klären, welche Funktionen wirklich sinnvoll sind, welche Qualitätsstufe zu Ihrem Projekt passt und welches Budget realistisch ist.",
  },
  {
    icon: Cable,
    title: "2. Herstellerunabhängige Planung & Kabelkonzept",
    text: "Sie erhalten ein klares Funktions- und Systemkonzept inklusive Leitungslogik, Schnittstellen und Abstimmung mit Elektriker, Architekt und Fachgewerken.",
  },
  {
    icon: Settings2,
    title: "3. Inbetriebnahme & Programmierung",
    text: "Wir richten Szenen, Automationen, Visualisierung, Nutzerrechte und Bedienung ein, damit Ihr Smart Home im Alltag einfach funktioniert.",
  },
];

const trustItems = [
  "Herstellerunabhängige Beratung statt Produktverkauf",
  "Planung, Programmierung und Koordination aus einer Hand",
  "Elektroarbeiten mit qualifizierten Elektriker-Partnern",
  "Regionaler Ansprechpartner für anspruchsvolle Projekte",
];

export default function SmartHomeInstallateurLandingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,18,32,0.99),rgba(17,24,39,0.92))]" />
        <div className="container-page relative grid gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Smart Home Fachpartner für Neubau & Sanierung
            </div>
            <h1 className="max-w-3xl text-3xl font-bold tracking-normal sm:text-4xl lg:text-5xl">
              Smart Home professionell planen lassen, bevor auf der Baustelle teure Fehler entstehen
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Heimlogik begleitet Bauherren und Sanierer als Fachpartner für Planung, Kabelkonzept, Inbetriebnahme und Programmierung. Herstellerunabhängig, strukturiert und auf Ihr Bauprojekt abgestimmt.
            </p>
            <ul className="mt-6 grid max-w-2xl gap-2 text-sm leading-6 text-slate-200 sm:grid-cols-2">
              {["herstellerunabhängige Systemauswahl", "Planung, Programmierung und Koordination aus einer Hand", "zukunftssicheres Kabel- und Funktionskonzept"].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#anfrage" className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-ink transition hover:bg-green-400">
                Jetzt kostenloses Erstgespräch sichern
              </a>
              <a href={`tel:${siteConfig.phone}`} className="focus-ring inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
                {siteConfig.phone}
              </a>
            </div>
            <p className="mt-5 text-sm text-slate-300">Servicegebiet: {siteConfig.serviceRadius}</p>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-soft lg:min-h-[520px]">
            <Image
              src="/images/bild_Mitarbeiter.png"
              alt="Smart Home Beratung und Planung durch Heimlogik"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-md border border-white/15 bg-ink/80 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white">Planung. Integration. Programmierung. Betreuung.</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Dienstleistung statt Produktverkauf: Wir planen die Logik hinter Ihrem Smart Home.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Das Problem</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Warum smarte Elektroplanung im Neubau oft zu spät auffällt</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Smart Home ist kein Gerätekauf, sondern eine Planungsentscheidung. Wenn Funktionen, Leitungen und Schnittstellen erst nach Rohbau oder Sanierung geklärt werden, wird es schnell teuer, eingeschränkt oder unnötig kompliziert.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problemItems.map(([title, text]) => (
              <article key={title} className="rounded-md border border-slate-200 bg-paper p-6">
                <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 font-bold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Unsere Dienstleistung</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Das Heimlogik Sorglos-Paket für Ihr Smart Home</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Wir übersetzen Ihre Wohnwünsche in eine technische Planung, die Elektriker, Architekt und Fachgewerke verstehen und die später zuverlässig bedienbar ist.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {serviceSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-accent">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Vertrauen</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Geplant für Menschen, die ihr Bauprojekt nicht dem Zufall überlassen</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Heimlogik schafft Klarheit, bevor Gewerke starten, Produkte bestellt werden oder später kostspielige Kompromisse entstehen.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-slate-200 bg-paper p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                <p className="text-sm font-semibold leading-6 text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Kundenstimmen</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Das sagen Bauherren, Sanierer und Fachpartner über die Zusammenarbeit</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["Kundenstimme Neubau", "Platzhalter für eine konkrete Rezension zu Planungssicherheit, sauberer Abstimmung mit Elektriker und verständlicher Bedienung."],
              ["Kundenstimme Sanierung", "Platzhalter für eine konkrete Rezension zu Systemauswahl, Nachrüstbarkeit und professioneller Programmierung."],
              ["Stimme eines Fachpartners", "Platzhalter für eine konkrete Rezension zur Zusammenarbeit mit Elektriker, Architekt oder anderem Gewerk."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex gap-1 text-accent" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((item) => (
                    <Star key={item} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <h3 className="mt-4 font-bold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="anfrage" className="section-pad scroll-mt-24 bg-white md:scroll-mt-28">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Kostenloses Erstgespräch</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Lassen Sie Ihr Smart Home prüfen, bevor wichtige Bauentscheidungen fallen</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Beschreiben Sie kurz Projektart, Standort und aktuellen Planungsstand. Wir melden uns mit einer realistischen Einschätzung und klären, welcher nächste Schritt für Ihr Projekt sinnvoll ist.
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-slate-700">
              {["Name, E-Mail und Telefon für die Rückmeldung", "Projektart: Neubau, Sanierung, Nachrüstung oder Bestand", "Postleitzahl, gewünschte Leistung und kurze Projektbeschreibung"].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <AdsLeadForm />
        </div>
      </section>
    </>
  );
}
