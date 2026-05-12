import { Phone } from "lucide-react";
import { siteConfig } from "@/site.config";
import { ButtonLink } from "./ButtonLink";

type CTASectionProps = {
  title?: string;
  text?: string;
  primary?: string;
};

export function CTASection({
  title = "Kostenlose Ersteinschätzung anfragen",
  text = "Beschreiben Sie kurz Ihr Objekt und Ihr Ziel. Wir melden uns mit einer realistischen Einschätzung für die nächsten Schritte.",
  primary = "Anfrage starten",
}: CTASectionProps) {
  return (
    <section className="section-pad bg-ink text-white">
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-normal sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{text}</p>
          <p className="mt-4 text-sm text-slate-400">Servicegebiet: {siteConfig.serviceRadius}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <ButtonLink href="/kontakt">{primary}</ButtonLink>
          <a
            href={`tel:${siteConfig.phone}`}
            className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {siteConfig.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
