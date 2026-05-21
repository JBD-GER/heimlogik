import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, PlugZap } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Hero } from "@/components/Hero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ServiceCard } from "@/components/ServiceCard";
import { FAQSchema, LocalBusinessSchema } from "@/components/StructuredData";
import { homeFaqs, processSteps, serviceAreaLinks, serviceCards } from "@/lib/content";
import { guideArticles } from "@/lib/ratgeber";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Smart Home Installateur Hannover | Heimlogik",
  description:
    "Heimlogik plant und integriert Smart Home für Isernhagen, Wunstorf und Hannover. Beratung, Programmierung, Einweisung & Partner-Elektriker.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Smart Home Installateur Hannover | Heimlogik",
    description:
      "Smart Home Planung und Systemintegration für Isernhagen, Wunstorf und Hannover.",
    url: "/",
    images: ["/images/bild_Mitarbeiter.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />
      <FAQSchema faqs={homeFaqs} />
      <Hero
        kicker="Smart Home Planung & Installation"
        title="Smart Home Planung & Installation"
        text="Heimlogik plant, integriert und programmiert intelligente Gebäudetechnik für Häuser, Neubauten, Sanierungen und hochwertige Immobilien - verständlich, durchdacht und auf Ihren Alltag abgestimmt."
        bullets={[
          "Smart-Home-Planung und Systemintegration",
          "KNX-, Home Assistant- und Matter-kompatible Lösungen möglich",
          "Licht, Beschattung, Heizung, Audio, TV, Sicherheit und Energie",
          "Smarte Heizkörperthermostate als schneller Einstieg",
          "Umsetzung mit qualifizierten Elektriker-Partnern",
          "Regional in Isernhagen, Wunstorf und Hannover",
        ]}
        icon={PlugZap}
        imageSrc="/images/bild_Mitarbeiter.png"
        imageAlt="Smart Home Steuerung in einem Einfamilienhaus in Hannover"
        primaryCta="Projekt-Check vereinbaren"
        secondaryCta="Leistungen ansehen"
        primaryHref="/kontakt"
        secondaryHref="/leistungen"
        serviceAreaLabel={siteConfig.serviceRadius}
      />

      <section className="section-pad bg-white">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <article className="rounded-md border border-slate-200 bg-paper p-7">
            <h2 className="text-2xl font-bold text-ink">Viele Smart-Home-Projekte scheitern nicht an der Technik, sondern an fehlender Planung.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Einzelne Geräte sind schnell gekauft. Wirklich komfortabel wird Smart Home aber erst, wenn Licht, Beschattung, Heizung, Audio, TV, Sicherheit, Netzwerk und Bedienung logisch zusammenspielen.
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

      <section className="bg-ink px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Systemübersicht</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal">Eine Oberfläche statt einzelner Insellösungen</h2>
            <p className="mt-5 leading-7 text-slate-300">
              Die Grafik zeigt, wie die wichtigsten Bereiche im Haus zusammenlaufen: Licht, Heizung, Beschattung, Zutritt, Sicherheit, Klima und Energie. Entscheidend ist nicht die Menge an Technik, sondern eine klare Logik dahinter.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
              {["Szenen statt App-Chaos", "Automationen für Alltag und Abwesenheit", "zentrale Bedienung mit verständlicher Struktur", "erweiterbar für spätere Wünsche"].map((item) => (
                <div key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
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
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Ratgeber</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Aus dem Smart-Home-Ratgeber</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Praxisnahe Einordnungen zu Nachrüstung, Systemauswahl und Kosten - für Eigentümer, Bauherren und Sanierer in Hannover und Umgebung.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen",
              "/ratgeber/knx-oder-home-assistant",
              "/ratgeber/was-kostet-ein-smart-home",
            ].map((path) => {
              const article = guideArticles.find((item) => item.path === path);
              if (!article) return null;
              return (
                <Link key={article.path} href={article.path} className="rounded-md border border-slate-200 bg-paper p-6 shadow-sm hover:border-accent">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{article.category}</p>
                  <h3 className="mt-3 text-xl font-bold text-ink">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                  <span className="mt-5 inline-flex text-sm font-semibold text-ink">Artikel lesen</span>
                </Link>
              );
            })}
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
              ["Regionaler Ansprechpartner", "Heimlogik betreut Smart-Home-Projekte in Isernhagen, Wunstorf und Hannover."],
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
        <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
            <Image
              src="/images/Mitarbeiter_fuenf.png"
              alt="Heimlogik Mitarbeiter bei der Smart-Home-Systemintegration"
              width={1254}
              height={1254}
              className="aspect-[4/3] w-full object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Persönliche Umsetzung</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Ein Ansprechpartner, der Planung und Einrichtung zusammenbringt</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Gerade bei Smart Home zählt, dass nach der Installation nicht fünf einzelne Apps übrig bleiben, sondern ein verständliches System. Heimlogik begleitet die Abstimmung, richtet die Logik ein und sorgt für eine klare Übergabe.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              {["saubere Raum- und Szenenstruktur", "verständliche Nutzerrechte", "Automationen mit Alltagssinn", "Einweisung nach der Einrichtung"].map((item) => (
                <div key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
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

      <section id="servicegebiet" className="section-pad scroll-mt-24 md:scroll-mt-28">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Servicegebiet</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Smart Home für {siteConfig.serviceRadius}</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Heimlogik betreut Smart-Home-Projekte in {siteConfig.serviceRadius} - von der Beratung über die Systemplanung bis zur Einrichtung und Einweisung.
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
      <CTASection title="Sie planen ein Smart-Home-Projekt in Isernhagen, Wunstorf oder Hannover?" primary="Projekt-Check vereinbaren" />
    </>
  );
}
