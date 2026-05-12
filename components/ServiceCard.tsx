import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

type ServiceCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  href?: string;
};

export function ServiceCard({ icon: Icon, title, text, href }: ServiceCardProps) {
  const content = (
    <div className="h-full rounded-md border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-accent">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
      {href ? (
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink">
          Mehr erfahren <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : null}
    </div>
  );

  if (!href) return content;
  return (
    <Link href={href} className="focus-ring block rounded-md">
      {content}
    </Link>
  );
}
