import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, PlugZap } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ServiceCard } from "@/components/ServiceCard";
import { FAQSchema, LocalBusinessSchema } from "@/components/StructuredData";
import { homeFaqs, processSteps, serviceAreaLinks, serviceCards } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Smart Home Installateur Nienburg | Heimlogik",
  description:
    "Heimlogik plant und integriert Smart Home für Nienburg, Leese, Wunstorf und Hannover West. Beratung, Programmierung, Einweisung & Partner-Elektriker.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Smart Home Installateur Nienburg | Heimlogik",
    description:
      "Smart Home Planung und Systemintegration für Landkreis Nienburg und Region Hannover.",
    url: "/",
    images: ["/images/heimlogik-smart-home-hero.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />
      <FAQSchema faqs={homeFaqs} />
      <Breadcrumbs items={[]} />
      <Hero
        kicker="Smart Home Planung & Installation"
        title="Smart Home Planung & Installation in Nienburg & der Region Hannover"
        text="Heimlogik plant, integriert und programmiert intelligente Gebäudetechnik für Häuser, Neubauten, Sanierungen und hochwertige Immobilien - verständlich, durchdacht und auf Ihren Alltag abgestimmt."
        bullets={[
          "Smart-Home-Planung und Systemintegration",
          "KNX-/Loxone-/Matter-kompatible Lösungen möglich",
          "Licht, Beschattung, Heizung, Sicherheit und Energie",
          "Smarte Heizkörperthermostate als schneller Einstieg",
          "Umsetzung mit qualifizierten Elektriker-Partnern",
          "Regional in Leese, Nienburg, Wunstorf und Hannover West",
        ]}
        icon={PlugZap}
        imageSrc="/images/heimlogik-smart-home-hero.png"
        imageAlt="Smart Home Steuerung in Einfamilienhaus in Nienburg"
        primaryCta="Projekt-Check vereinbaren"
        secondaryCta="Leistungen ansehen"
        primaryHref="/kontakt"
        secondaryHref="/leistungen"
      />

      <section className="section-pad bg-white">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <article className="rounded-md border border-slate-200 bg-paper p-7">
            <h2 className="text-2xl font-bold text-ink">Viele Smart-Home-Projekte scheitern nicht an der Technik, sondern an fehlender Planung.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Einzelne Geräte sind schnell gekauft. Wirklich komfortabel wird Smart Home aber erst, wenn Licht, Beschattung, Heizung, Sicherheit, Netzwerk und Bedienung logisch zusammenspielen.
            </p>
          </article>
          <article className="rounded-md border border-green-100 bg-green-50 p-7">
            <h2 className="text-2xl font-bold text-ink">Wir denken Smart Home als System.</h2>
            <p className="mt-4 leading-7 text-slate-700">
              Heimlogik verbindet Beratung, Planung, Systemauswahl, Programmierung, App-Einrichtung und Einweisung. Für feste Elektroarbeiten arbeiten wir mit qualifizierten Elektriker-Partnern zusammen.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-ink px-4 pb-12 sm:px-6 lg:px-8">
        <div className="container-page">
          <div className="overflow-hidden rounded-md border border-white/10 bg-slatepanel shadow-soft">
            <Image
              src="/images/info_grafik.png"
              alt="Smart Home Visualisierung für Gebäudeautomation"
              width={1672}
              height={941}
              priority
              className="h-auto w-full"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Leistungen</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Smart Home als System, nicht als Sammlung einzelner Geräte</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Warum Heimlogik?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Warum Heimlogik statt Standard-Elektriker?</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Elektrohandwerk und Systemintegration ergänzen sich. Ein klassischer Elektriker installiert Leitungen, Schalter und Komponenten. Ein Smart-Home-Systemintegrator sorgt dafür, dass diese Komponenten sinnvoll zusammenspielen.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Spezialisiert auf Smart-Home-Systemintegration", "Welche Funktionen sind sinnvoll? Welche Systeme passen zusammen? Wie bleibt die Bedienung einfach?"],
              ["Elektrohandwerk und Systemintegration sauber getrennt", siteConfig.electricianPartnerText],
              ["Nicht mehr Technik, sondern bessere Bedienung", "Ein gutes Smart Home muss im Alltag nicht komplizierter sein als ein normaler Lichtschalter."],
              ["Regionaler Ansprechpartner", "Von Leese aus betreut Heimlogik Projekte im Landkreis Nienburg, in Wunstorf und Hannover West."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-md border border-slate-200 bg-paper p-5">
                <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Projektarten</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Für Neubau, Sanierung, Bestand und Gewerbe</h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Neubau", "Sanierung", "hochwertige Bestandsimmobilien", "Einfamilienhäuser", "Villen", "Gewerbeobjekte", "Ferienwohnungen", "Nachrüstung"].map((item) => (
              <div key={item} className="rounded-md border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Ablauf</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Von der Idee bis zur funktionierenden Bedienung</h2>
          </div>
          <div className="mt-10">
            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Servicegebiet</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Smart Home für Leese, Nienburg, Stolzenau, Wunstorf & Hannover West</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Heimlogik sitzt in 31633 Leese und betreut Smart-Home-Projekte im Landkreis Nienburg, in Stolzenau, Neustadt am Rübenberge, Wunstorf und der westlichen Region Hannover.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceAreaLinks.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-md border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm hover:border-accent">
                Smart Home {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Häufige Fragen</h2>
          </div>
          <FAQAccordion faqs={homeFaqs} />
        </div>
      </section>
      <CTASection title="Sie planen ein Smart-Home-Projekt in Nienburg oder der Region Hannover?" primary="Projekt-Check vereinbaren" />
    </>
  );
}
