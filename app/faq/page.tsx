import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/StructuredData";
import { generalFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ Smart Home Planung & Installation",
  description:
    "Antworten zu Smart-Home-Systemintegration, Elektroarbeiten, KNX, Home Assistant, Nachrüstung, Kosten, Support, Thermostaten und Sicherheit.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ Smart Home Planung & Installation | Heimlogik",
    description: "Häufige Fragen zu Smart Home mit Heimlogik.",
    url: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <FAQSchema faqs={generalFaqs} />
      <Breadcrumbs items={[{ label: "FAQ", href: "/faq" }]} />
      <section className="section-pad bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">FAQ</p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink sm:text-5xl">Häufige Fragen zu Smart Home, Planung und Installation</h1>
            <p className="mt-6 leading-7 text-slate-600">
              Kurze, ehrliche Antworten zu Systemintegration, Elektroarbeiten, Nachrüstung, Kosten, Support, Sicherheit und smarten Heizkörperthermostaten.
            </p>
          </div>
          <FAQAccordion faqs={generalFaqs} />
        </div>
      </section>
      <CTASection title="Noch Fragen zu Ihrem Smart-Home-Projekt?" primary="Beratung anfragen" />
    </>
  );
}
