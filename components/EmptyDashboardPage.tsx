type EmptyDashboardPageProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function EmptyDashboardPage({ eyebrow = "Dashboard", title, description }: EmptyDashboardPageProps) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink">{title}</h1>
      {description ? <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
  );
}
