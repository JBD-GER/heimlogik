type InfoCardProps = {
  title: string;
  children: React.ReactNode;
};

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <section className="min-w-0 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
