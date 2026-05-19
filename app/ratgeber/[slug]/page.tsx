import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RatgeberArticlePage } from "@/components/RatgeberArticlePage";
import { guideArticleMap, guideArticles } from "@/lib/ratgeber";

type Params = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return guideArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = guideArticleMap[slug];

  if (!article) return {};

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: article.path },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: article.path,
      images: [article.image],
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const article = guideArticleMap[slug];

  if (!article) notFound();

  return <RatgeberArticlePage article={article} />;
}
