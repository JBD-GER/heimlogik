import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock3, Mail, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Danke für Ihre Anfrage",
  description: "Ihre Smart-Home-Anfrage bei Heimlogik ist angekommen.",
  alternates: { canonical: "/danke" },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DankePage() {
  return (
    <>
      <section className="bg-ink px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="container-page max-w-4xl">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-accent text-ink">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-accent">Anfrage angekommen</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-normal sm:text-5xl">
            Danke. Wir melden uns mit einer realistischen Einschätzung.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            Ihre Angaben wurden an Heimlogik übermittelt. Sie erhalten außerdem eine Bestätigung per E-Mail.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" className="sm:w-auto">
              Zur Startseite
            </ButtonLink>
            <ButtonLink href="/leistungen" variant="secondary" className="sm:w-auto">
              Leistungen ansehen
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Clock3,
              title: "Prüfung der Anfrage",
              text: "Wir schauen uns Objekt, Ziel und gewünschte Leistung an und ordnen den nächsten sinnvollen Schritt ein.",
            },
            {
              icon: Phone,
              title: "Rückmeldung",
              text: `Bei Rückfragen melden wir uns telefonisch. Direkt erreichbar sind wir unter ${siteConfig.phone}.`,
            },
            {
              icon: Mail,
              title: "Bestätigung",
              text: "Eine kurze Bestätigung wurde an die angegebene E-Mail-Adresse gesendet.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-md border border-slate-200 bg-paper p-6">
                <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold text-ink">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="container-page rounded-md border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">
          Falls Sie noch etwas ergänzen möchten, schreiben Sie uns direkt an{" "}
          <Link href={`mailto:${siteConfig.email}`} className="font-semibold text-ink underline">
            {siteConfig.email}
          </Link>
          .
        </div>
      </section>
    </>
  );
}
