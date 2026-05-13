import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Hero } from "@/components/Hero";
import { PackageCards } from "@/components/PackageCards";
import { ProcessSteps } from "@/components/ProcessSteps";
import { FAQSchema, ServiceSchema } from "@/components/StructuredData";
import { processSteps, trustBadges, type PageContent } from "@/lib/content";
import { siteConfig } from "@/site.config";

export function LandingPage({ content }: { content: PageContent }) {
  const crumbs = content.breadcrumbs ?? [
    { label: "Leistungen", href: "/leistungen" },
    { label: content.h1, href: content.path },
  ];
  const introFallbackItems = [
    "Ziel und gewünschte Funktionen klären",
    "passende Technik und Systemgrenzen prüfen",
    "Bedienung, App-Struktur und Erweiterbarkeit mitdenken",
  ];
  const detailSections = [
    ...content.sections.slice(2),
    {
      title: "Für wen diese Lösung sinnvoll ist",
      text: "Geeignet ist die Lösung für Eigentümer, Vermieter und Gewerbetreibende, die nicht nur einzelne Geräte kaufen möchten, sondern eine nachvollziehbare Struktur für Bedienung, Automationen und spätere Erweiterungen brauchen.",
      items: ["Neubau und Sanierung", "Bestandsimmobilien", "Einfamilienhäuser und Wohnungen", "Ferienwohnungen und kleinere Gewerbeobjekte"],
    },
    {
      title: "So wird aus Technik ein alltagstaugliches System",
      text: "Heimlogik übersetzt Wünsche wie Komfort, Sicherheit, Energie und einfache Bedienung in konkrete Funktionen. Daraus entstehen Szenen, Zeitpläne, Nutzerrechte, App-Strukturen und sinnvolle Automationen.",
      items: ["klare Räume und Nutzer", "verständliche Szenen", "saubere App-Struktur", "realistische Automationen"],
    },
    {
      title: "Worauf wir besonders achten",
      text: "Nicht jedes Gerät passt zu jedem Objekt. Deshalb prüfen wir Schnittstellen, Funkabdeckung, Netzwerk, Bedienwünsche, Datenschutz, Wartbarkeit und die Grenzen der vorhandenen Technik.",
      items: ["Stabilität", "Erweiterbarkeit", "Datenschutz", "Supportfähigkeit"],
    },
  ];

  return (
    <>
      <ServiceSchema
        name={content.serviceName ?? content.h1}
        description={content.metaDescription}
        path={content.path}
        serviceType={content.serviceType}
      />
      <FAQSchema faqs={content.faqs} />
      <Breadcrumbs items={crumbs} />
      <Hero
        kicker={content.kicker}
        title={content.h1}
        text={content.heroText}
        bullets={content.heroBullets}
        icon={content.icon}
        imageSrc={content.imageSrc}
        imageAlt={content.imageAlt}
        primaryCta={content.primaryCta}
        secondaryCta={content.secondaryCta}
        primaryHref="#anfrage"
        secondaryHref={content.secondaryHref ?? "/leistungen"}
        titleSize="compact"
      />

      <section className="section-pad bg-white">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Kurzüberblick</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Was diese Lösung leisten soll</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Jede Smart-Home-Lösung beginnt mit einem klaren Zielbild: Welche Funktionen sollen wirklich helfen, welche Technik passt zum Objekt und wie bleibt die Bedienung im Alltag verständlich?
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Planung", "Funktionen, Räume, Nutzer, Systeme und spätere Erweiterungen werden vor der Umsetzung sauber eingeordnet."],
              ["Integration", "Geräte, Apps, Szenen und Schnittstellen werden so verbunden, dass daraus ein stimmiges Gesamtsystem entsteht."],
              ["Einweisung", "Nach der Einrichtung wissen Sie, was wie funktioniert, welche Grenzen es gibt und wie Anpassungen möglich sind."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-md border border-slate-200 bg-paper p-6">
                <CheckCircle2 className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {content.leadFormEarly ? <LeadForm content={content} compact /> : null}

      <section className="section-pad">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {content.sections.slice(0, 2).map((section, index) => (
            <article
              key={section.title}
              className={`rounded-md border p-7 shadow-sm ${
                index === 0 ? "border-slate-200 bg-paper" : "border-green-100 bg-green-50"
              }`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-md ${index === 0 ? "bg-white text-slate-700" : "bg-white text-accent"}`}>
                {index === 0 ? <AlertTriangle className="h-6 w-6" aria-hidden="true" /> : <CheckCircle2 className="h-6 w-6" aria-hidden="true" />}
              </span>
              <h2 className="mt-5 text-2xl font-bold text-ink">{section.title}</h2>
              {section.text ? <p className="mt-4 leading-7 text-slate-700">{section.text}</p> : null}
              <SectionItems items={section.items ?? (index === 0 ? introFallbackItems : undefined)} />
              <SectionLinks links={section.links} />
            </article>
          ))}
        </div>
      </section>

      {detailSections.length ? (
        <section className="section-pad bg-white">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">Leistungen und Einordnung</p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Was Heimlogik konkret übernimmt</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Der Schwerpunkt liegt auf sinnvoller Planung, sauberer Systemlogik und verständlicher Bedienung. So entstehen Lösungen, die nicht nur technisch funktionieren, sondern auch dauerhaft nachvollziehbar bleiben.
              </p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {detailSections.map((section) => (
                <article key={section.title} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                  {section.kicker ? <p className="text-sm font-semibold uppercase tracking-wide text-accent">{section.kicker}</p> : null}
                  <h3 className="text-xl font-bold text-ink">{section.title}</h3>
                  {section.text ? <p className="mt-4 text-sm leading-6 text-slate-600">{section.text}</p> : null}
                  <SectionItems items={section.items} />
                  <SectionLinks links={section.links} />
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {content.packages?.length ? (
        <section className="section-pad bg-white">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">Pakete</p>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Passende Einstiege für Ihr Projekt</h2>
              <p className="mt-4 leading-7 text-slate-600">
                Die Kosten hängen von Objekt, System, vorhandener Technik und gewünschtem Funktionsumfang ab. Nach dem Projekt-Check erhalten Sie ein transparentes Angebot.
              </p>
            </div>
            <div className="mt-10">
              <PackageCards packages={content.packages} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section-pad">
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

      <section className="section-pad bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Warum Heimlogik?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Spezialisierung statt Technikchaos</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Viele Anbieter führen Smart Home als Zusatzleistung. Heimlogik fokussiert sich auf die Logik dahinter: sinnvolle Funktionen, passende Systeme, einfache Bedienung und Erweiterbarkeit.
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-800">{siteConfig.electricianPartnerText}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustBadges.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-md border border-slate-200 bg-paper p-5">
                  <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 font-bold text-ink">{item.label}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {!content.leadFormEarly ? <LeadForm content={content} /> : null}

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Häufige Fragen</h2>
          </div>
          <FAQAccordion faqs={content.faqs} />
        </div>
      </section>

      <CTASection
        title={content.primaryCta}
        text="Beschreiben Sie kurz Objekt, Ziel und gewünschte Funktionen. Heimlogik meldet sich mit einer realistischen Einschätzung."
        primary="Beratung anfragen"
      />
    </>
  );
}

function LeadForm({ content, compact = false }: { content: PageContent; compact?: boolean }) {
  return (
    <section className={`section-pad scroll-mt-24 md:scroll-mt-28 ${compact ? "bg-white" : "bg-paper"}`} id="anfrage">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Anfrage</p>
          <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">{content.primaryCta}</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Schreiben Sie kurz, worum es geht. Wir melden uns für eine realistische Ersteinschätzung im Servicegebiet {siteConfig.serviceRadius}.
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-800">Telefon: {siteConfig.phone}</p>
        </div>
        <ContactForm variant={content.formVariant ?? "default"} />
      </div>
    </section>
  );
}

function SectionItems({ items }: { items?: string[] }) {
  if (!items?.length) return null;

  return (
    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-6 text-slate-700">
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SectionLinks({ links }: { links?: { label: string; href: string }[] }) {
  if (!links?.length) return null;

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="focus-ring rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-accent">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
