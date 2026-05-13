"use client";

import { useState } from "react";

type FAQ = {
  question: string;
  answer: string;
};

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={faq.question}>
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="focus-ring flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-ink"
            >
            {faq.question}
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-lg leading-none ${
                  isOpen ? "bg-ink text-white" : "bg-slate-100 text-ink"
                }`}
                aria-hidden="true"
              >
                {isOpen ? "-" : "+"}
            </span>
            </button>
            {isOpen ? (
              <p id={panelId} role="region" aria-labelledby={buttonId} className="px-5 pb-5 text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
