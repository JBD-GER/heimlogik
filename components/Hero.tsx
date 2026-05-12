import Image from "next/image";
import { LucideIcon, MapPin } from "lucide-react";
import { ButtonLink } from "./ButtonLink";
import { TrustBadges } from "./TrustBadges";
import { siteConfig } from "@/site.config";

type HeroProps = {
  kicker: string;
  title: string;
  text: string;
  bullets?: string[];
  primaryCta?: string;
  secondaryCta?: string;
  primaryHref?: string;
  secondaryHref?: string;
  icon?: LucideIcon;
  image?: boolean;
  imageSrc?: string;
  imageAlt?: string;
};

export function Hero({
  kicker,
  title,
  text,
  bullets,
  primaryCta = "Projekt-Check vereinbaren",
  secondaryCta = "Beratung anfragen",
  primaryHref = "/kontakt",
  secondaryHref = "/leistungen",
  icon: Icon,
  image = true,
  imageSrc = "/images/bild_Mitarbtier_vier.png",
  imageAlt = "Heimlogik Beratung und Smart-Home-Einrichtung vor Ort",
}: HeroProps) {
  return (
    <section className="relative bg-ink pb-10 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,18,32,0.99),rgba(17,24,39,0.92))]" />
      </div>
      <div className="container-page relative grid gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100">
            {Icon ? <Icon className="h-4 w-4 text-accent" aria-hidden="true" /> : <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />}
            {kicker}
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-normal sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{text}</p>
          {bullets?.length ? (
            <ul className="mt-6 grid max-w-2xl gap-2 text-sm leading-6 text-slate-200 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primaryHref}>{primaryCta}</ButtonLink>
            <ButtonLink href={secondaryHref} variant="secondary">
              {secondaryCta}
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-slate-300">
            Servicegebiet: {siteConfig.serviceRadius} · Telefon: {siteConfig.phone}
          </p>
        </div>
        {image ? (
          <div className="relative min-h-72 overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-soft lg:min-h-[520px]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-md border border-white/15 bg-ink/80 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-white">{siteConfig.alternativeClaim}</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Beratung, Planung, Integration, Programmierung, Einweisung und Support.</p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="container-page relative px-4 sm:px-6 lg:px-8">
        <TrustBadges />
      </div>
    </section>
  );
}
