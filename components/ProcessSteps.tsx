type Step = {
  title: string;
  text: string;
};

export function ProcessSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step.title} className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p>
        </div>
      ))}
    </div>
  );
}
