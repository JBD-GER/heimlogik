type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow = "Heimlogik Admin", title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
        <h1 className="mt-3 break-words text-3xl font-bold tracking-normal text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0 md:pb-1">{action}</div> : null}
    </div>
  );
}
