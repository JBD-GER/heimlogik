type FAQ = {
  question: string;
  answer: string;
};

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
      {faqs.map((faq, index) => (
        <details key={faq.question} className="group" open={index === 0}>
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-ink marker:hidden">
            {faq.question}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-lg leading-none text-ink group-open:hidden">
              +
            </span>
            <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ink text-lg leading-none text-white group-open:flex">
              -
            </span>
          </summary>
          <p className="px-5 pb-5 text-sm leading-6 text-slate-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
