type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm sm:p-8">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
  );
}
