import { ClipboardCheck, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/site.config";

export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-slate-200 bg-white p-2 shadow-soft md:hidden">
      <a
        href={`tel:${siteConfig.phone}`}
        className="focus-ring mx-1 inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-md bg-ink px-2 text-xs font-semibold text-white"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        Anrufen
      </a>
      <a
        href="/kontakt#anfrage"
        className="focus-ring mx-1 inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-ink"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        Anfrage
      </a>
      <a
        href="/kontakt"
        className="focus-ring mx-1 inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded-md bg-accent px-2 text-xs font-semibold text-ink"
      >
        <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
        Projekt-Check
      </a>
    </div>
  );
}
