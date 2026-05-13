import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Über Heimlogik | Smart Home Planung & Installation",
  description:
    "Heimlogik verbindet IT-Verständnis, Smart-Home-Planung und Systemintegration mit Hauptfokus auf Wunstorf, Isernhagen und Hannover.",
  alternates: { canonical: "/ueber-uns" },
};

export default function UeberUnsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Über uns", href: "/ueber-uns" }]} />
      <section className="section-pad bg-white">
        <div className="container-page max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Über Heimlogik</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">Über Heimlogik</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Heimlogik verbindet IT-Verständnis mit praktischer Umsetzung im Zuhause. Wir planen Smart Home verständlich, richten Systeme sauber ein und erklären die Bedienung so, dass sie im Alltag genutzt werden kann.
          </p>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-page grid gap-6 md:grid-cols-2">
          {[
            ["Spezialisiert auf Systemintegration", "Wir denken nicht in Einzelgeräten, sondern in funktionierenden Systemen aus Licht, Heizung, Beschattung, Sicherheit, Energie und Bedienung."],
            ["Verständlich geplant", "Wünsche, Grundrisse und technische Möglichkeiten werden in ein klares Konzept übersetzt."],
            ["Sauber eingerichtet", "Apps, Gateways, Räume, Szenen, Nutzerrechte und Automationen werden nachvollziehbar strukturiert."],
            ["Fachgrenzen klar benannt", siteConfig.electricianPartnerText],
          ].map(([title, text]) => (
            <article key={title} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <CTASection title="Smart Home mit Heimlogik besprechen" primary="Projekt-Check vereinbaren" />
    </>
  );
}
