import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceSchema } from "@/components/StructuredData";
import { serviceCards } from "@/lib/content";

export const metadata: Metadata = {
  title: "Smart Home Leistungen",
  description:
    "Smart-Home-Planung, Installation, Systemintegration, Heizung, Licht, Audio, TV, Sicherheit, Energie und Ferienwohnungslösungen mit Heimlogik.",
  alternates: { canonical: "/leistungen" },
  openGraph: {
    title: "Smart Home Leistungen | Heimlogik",
    description: "Smart-Home-Planung, Installation und Systemintegration mit Heimlogik.",
    url: "/leistungen",
  },
};

export default function LeistungenPage() {
  return (
    <>
      <ServiceSchema
        name="Smart-Home-Leistungen von Heimlogik"
        description="Smart-Home-Planung, Installation, Systemintegration, Heizung, Licht, Audio, TV, Sicherheit, Energie und Ferienwohnungslösungen."
        path="/leistungen"
        serviceType="Smart Home Planung und Systemintegration"
      />
      <Breadcrumbs items={[{ label: "Leistungen", href: "/leistungen" }]} />
      <section className="section-pad bg-white">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Leistungen</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">Smart-Home-Leistungen von Heimlogik</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Von der ersten Idee bis zur funktionierenden Bedienung: Heimlogik plant, integriert und betreut Smart-Home-Lösungen für Häuser, Wohnungen, Neubauten, Sanierungen und Ferienimmobilien - inklusive HiFi, Audio, TV und Beschallungssystemen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-800">
              <a href="/kontakt" className="rounded-md bg-accent px-4 py-3 text-ink">Leistung besprechen</a>
              <a href="tel:+4951190121881" className="rounded-md border border-slate-300 px-4 py-3">0511-9012188-1</a>
            </div>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {[
            ["Smart-Home-Planung", "Wir übersetzen Wünsche, Grundrisse und technische Möglichkeiten in ein klares Smart-Home-Konzept.", "/smart-home-planung"],
            ["Smart Home Installation", "Wir richten Komponenten, Apps, Gateways, Räume, Szenen und Nutzerrechte sauber ein und übergeben das System verständlich.", "/smart-home-installation"],
            ["Systemintegration", "Wir verbinden Licht, Beschattung, Heizung, Audio, TV, Sicherheit, Energie und Bedienung zu einem funktionierenden Gesamtsystem.", "/knx-home-assistant-systemintegration"],
          ].map(([title, text, href]) => (
            <article key={title} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ink">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              <Link href={href} className="mt-5 inline-flex text-sm font-semibold text-ink hover:text-accent">
                Mehr erfahren
              </Link>
            </article>
          ))}
        </div>
      </section>
      <CTASection title="Welche Smart-Home-Leistung passt zu Ihrem Objekt?" primary="Leistung besprechen" />
    </>
  );
}
