import Link from "next/link";
import { Check } from "lucide-react";

type Package = {
  title: string;
  text: string;
  items: string[];
  cta?: string;
};

export function PackageCards({ packages }: { packages: Package[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {packages.map((item) => (
        <div key={item.title} className="flex flex-col rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-ink">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
          <ul className="mt-5 flex-1 space-y-3">
            {item.items.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          {item.cta ? (
            <Link href="/kontakt" className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-slatepanel">
              {item.cta}
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
