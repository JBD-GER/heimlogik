import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTASection } from "@/components/CTASection";
import { guideArticles, guideCategories, guideCollectionSchema, guideOverviewLinks } from "@/lib/ratgeber";

export const metadata: Metadata = {
  title: "Smart-Home-Ratgeber: Planung, Nachrüstung, KNX & Home Assistant | Heimlogik",
  description:
    "Praxisnahe Smart-Home-Ratgeber von Heimlogik: Nachrüstung, KNX, Home Assistant, Kosten, Heizungssteuerung, Multiroom-Audio und Planung für Hannover & Umgebung.",
  alternates: { canonical: "/ratgeber" },
  openGraph: {
    title: "Smart-Home-Ratgeber: Planung, Nachrüstung, KNX & Home Assistant | Heimlogik",
    description:
      "Praxisnahe Smart-Home-Ratgeber von Heimlogik für Hannover, Nienburg, Wunstorf, Leese und Umgebung.",
    url: "/ratgeber",
  },
};

export default function RatgeberPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideCollectionSchema()) }} />
      <Breadcrumbs items={[{ label: "Ratgeber", href: "/ratgeber" }]} />
      <section className="section-pad bg-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">Smart-Home-Wissen von Heimlogik</p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
              Smart-Home-Ratgeber für Planung, Nachrüstung & moderne Gebäudeautomation
            </h1>
          </div>
          <div>
            <p className="text-lg leading-8 text-slate-600">
              Heimlogik hilft Eigentümern, Bauherren und Sanierern, Smart Home verständlich und sinnvoll zu planen - ohne App-Chaos, unnötige Technik oder falsche Systementscheidungen.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/kontakt" className="focus-ring rounded-md bg-accent px-5 py-3 text-sm font-semibold text-ink hover:bg-green-400">
                Beratung anfragen
              </Link>
              <Link href="/" className="focus-ring rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-accent">
                Startseite
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page space-y-12">
          {guideCategories.map((category) => {
            const articles = guideArticles.filter((article) => article.category === category.title);
            return (
              <section key={category.slug} id={category.slug} className="scroll-mt-28">
                <div className="max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-wide text-accent">Kategorie</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-normal text-ink">{category.title}</h2>
                  <p className="mt-4 leading-7 text-slate-600">{category.description}</p>
                </div>
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {articles.length ? (
                    articles.map((article) => <ArticleCard key={article.path} article={article} />)
                  ) : (
                    <div className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-600">
                      Weitere Beiträge zu dieser Kategorie sind vorbereitet und können später ergänzt werden.
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <LinkBox title="Passende Leistungsseiten" links={guideOverviewLinks.services} />
          <LinkBox title="Smart Home in der Region" links={guideOverviewLinks.locations} />
        </div>
      </section>

      <CTASection
        title="Sie möchten Smart Home nicht nur lesen, sondern sauber planen?"
        text="Heimlogik ordnet Ihr Objekt, Ihre Wünsche und die passende Technik in einem realistischen Projekt-Check ein."
        primary="Projekt einschätzen lassen"
      />
    </>
  );
}

function ArticleCard({ article }: { article: (typeof guideArticles)[number] }) {
  return (
    <Link href={article.path} className="group rounded-md border border-slate-200 bg-white p-6 shadow-sm hover:border-accent">
      <BookOpen className="h-6 w-6 text-accent" aria-hidden="true" />
      <h3 className="mt-5 text-xl font-bold text-ink">{article.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{article.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink group-hover:text-accent">
        Artikel lesen <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}

function LinkBox({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="rounded-md border border-slate-200 bg-paper p-6">
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 hover:border-accent">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
