import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { ProcessSteps } from "@/components/ProcessSteps";
import { processSteps, serviceAreaLinks } from "@/lib/content";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Smart-Home-Projekt anfragen",
  description:
    "Kontaktieren Sie Heimlogik für Smart-Home-Planung, Installation und Systemintegration in Nienburg, Leese, Wunstorf und Hannover West.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Smart-Home-Projekt anfragen | Heimlogik",
    description: "Smart-Home-Projekt bei Heimlogik anfragen.",
    url: "/kontakt",
  },
};

export default function KontaktPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Kontakt", href: "/kontakt" }]} />
      <section className="section-pad bg-ink text-white">
        <div className="container-page max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Kontakt</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal sm:text-5xl">Smart-Home-Projekt anfragen</h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            Schreiben Sie kurz, was Sie vorhaben. Wir melden uns für eine realistische Einschätzung und klären, ob ein Vor-Ort-Termin, eine Planprüfung oder ein konkreter Projekt-Check sinnvoll ist.
          </p>
          <p className="mt-5 text-sm font-semibold text-slate-100">Telefon: {siteConfig.phone}</p>
        </div>
      </section>
      <section className="section-pad" id="anfrage">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-5">
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ink">Direkter Kontakt</h2>
              <a href={`tel:${siteConfig.phone}`} className="mt-5 flex items-center gap-3 font-semibold text-ink">
                <Phone className="h-5 w-5 text-accent" aria-hidden="true" />
                {siteConfig.phone}
              </a>
              <p className="mt-4 flex items-center gap-3 font-semibold text-ink">
                <MessageCircle className="h-5 w-5 text-accent" aria-hidden="true" />
                WhatsApp: {siteConfig.whatsappNumber}
              </p>
              <p className="mt-5 text-sm leading-6 text-slate-600">Servicegebiet: {siteConfig.serviceRadius}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ink">Nach Ihrer Anfrage</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Wir prüfen Ihre Angaben, klären Rückfragen telefonisch und schlagen den nächsten sinnvollen Schritt vor. {siteConfig.electricianPartnerText}
              </p>
            </div>
            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-ink">Servicegebiet</h2>
              <ul className="mt-4 grid gap-2 text-sm text-slate-700">
                {serviceAreaLinks.map(([label]) => (
                  <li key={label}>{label}</li>
                ))}
                <li>Region Hannover</li>
              </ul>
            </div>
          </aside>
          <ContactForm />
        </div>
      </section>
      <section className="section-pad bg-white">
        <div className="container-page">
          <h2 className="text-3xl font-bold tracking-normal text-ink">Ablauf nach der Anfrage</h2>
          <div className="mt-10">
            <ProcessSteps steps={processSteps.slice(0, 4)} />
          </div>
        </div>
      </section>
    </>
  );
}
