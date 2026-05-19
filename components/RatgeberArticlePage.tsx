import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FAQSchema } from "@/components/StructuredData";
import { articleSchema, type GuideArticle } from "@/lib/ratgeber";
import { siteConfig } from "@/site.config";

export function RatgeberArticlePage({ article }: { article: GuideArticle }) {
  return (
    <>
      <FAQSchema faqs={article.faqs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema(article)) }} />
      <Breadcrumbs
        items={[
          { label: "Ratgeber", href: "/ratgeber" },
          { label: article.title, href: article.path },
        ]}
      />

      <article>
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">{article.category}</p>
              <h1 className="mt-4 text-4xl font-bold tracking-normal text-ink sm:text-5xl">{article.title}</h1>
              <p className="mt-6 text-lg leading-8 text-slate-600">{article.intro}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/kontakt" className="focus-ring rounded-md bg-accent px-5 py-3 text-sm font-semibold text-ink hover:bg-green-400">
                  Projekt einschätzen lassen
                </Link>
                <Link href="/ratgeber" className="focus-ring rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-accent">
                  Ratgeber ansehen
                </Link>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-500">Autor: {siteConfig.companyName}</p>
            </div>
            <figure className="overflow-hidden rounded-md border border-slate-200 bg-paper shadow-sm">
              <Image
                src={article.image}
                alt={article.imageAlt}
                width={1280}
                height={760}
                loading="lazy"
                className="h-auto w-full"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <figcaption className="border-t border-slate-200 px-5 py-3 text-sm text-slate-600">{article.graphicTitle}</figcaption>
            </figure>
          </div>
        </section>

        <section className="section-pad">
          <div className="container-page grid gap-10 lg:grid-cols-[280px_1fr]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-md border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">Inhalt</p>
                <nav aria-label="Inhaltsverzeichnis" className="mt-4 grid gap-2">
                  {article.sections.map((section) => (
                    <a key={section.id} href={`#${section.id}`} className="text-sm font-semibold leading-6 text-slate-700 hover:text-ink">
                      {section.title}
                    </a>
                  ))}
                  <a href="#faq" className="text-sm font-semibold leading-6 text-slate-700 hover:text-ink">
                    Häufige Fragen
                  </a>
                </nav>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="rounded-md border border-green-100 bg-green-50 p-6">
                <h2 className="text-2xl font-bold text-ink">Sie planen ein Smart Home?</h2>
                <p className="mt-3 leading-7 text-slate-700">Lassen Sie Ihr Projekt von Heimlogik einschätzen. Wir ordnen ein, welche Lösung technisch sinnvoll ist und wo eine einfache Nachrüstung reicht.</p>
                <Link href="/kontakt" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-accent">
                  Beratung anfragen <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <p className="mt-10 text-base leading-8 text-slate-700">{article.localNote}</p>

              <div className="mt-10 space-y-12">
                {article.sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    <h2 className="text-3xl font-bold tracking-normal text-ink">{section.title}</h2>
                    <div className="mt-5 space-y-4">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="leading-8 text-slate-700">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    {section.bullets?.length ? (
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex gap-2 rounded-md border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {index === 1 ? (
                      <div className="mt-8 rounded-md border border-slate-200 bg-white p-6">
                        <h3 className="text-xl font-bold text-ink">Unsicher, welches System passt?</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          Heimlogik hilft bei der Auswahl zwischen KNX, Home Assistant, Funklösungen und professioneller Integration.
                        </p>
                        <Link href="/kontakt" className="mt-5 inline-flex rounded-md border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 hover:border-accent">
                          Kontakt aufnehmen
                        </Link>
                      </div>
                    ) : null}
                  </section>
                ))}
              </div>

              <LinkModules article={article} />

              <section id="faq" className="mt-16 scroll-mt-28">
                <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-accent">FAQ</p>
                    <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">Häufige Fragen</h2>
                  </div>
                  <FAQAccordion faqs={article.faqs} />
                </div>
              </section>

              <section className="mt-16 rounded-md border border-slate-200 bg-white p-7">
                <h2 className="text-2xl font-bold text-ink">{article.finalCta}</h2>
                <p className="mt-4 leading-7 text-slate-600">
                  Beschreiben Sie kurz Ihr Objekt, den Stand der Planung und welche Funktionen Ihnen wichtig sind. Heimlogik meldet sich mit einer realistischen ersten Einordnung.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/kontakt" className="focus-ring rounded-md bg-accent px-5 py-3 text-sm font-semibold text-ink hover:bg-green-400">
                    Jetzt Smart-Home-Beratung für Hannover & Umgebung anfragen
                  </Link>
                  <Link href="/kontakt" className="focus-ring rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-accent">
                    Beratung anfragen
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </section>
      </article>

      <CTASection title="Jetzt Smart-Home-Beratung für Hannover & Umgebung anfragen" primary="Projekt einschätzen lassen" />
    </>
  );
}

function LinkModules({ article }: { article: GuideArticle }) {
  const modules = [
    ["Passende Leistungen", article.serviceLinks],
    ["Weitere Ratgeber", article.guideLinks],
    ["Regionale Seiten", article.locationLinks],
  ] as const;

  return (
    <section className="mt-16 grid gap-6 lg:grid-cols-3">
      {modules.map(([title, links]) => (
        <div key={title} className="rounded-md border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <div className="mt-5 grid gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="inline-flex items-center justify-between gap-3 text-sm font-semibold leading-6 text-slate-700 hover:text-ink">
                {link.label}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
