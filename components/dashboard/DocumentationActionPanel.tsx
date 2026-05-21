"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { FileUp, Plus } from "lucide-react";

type DocumentationActionPanelProps = {
  uploadForm: ReactNode;
  categoryForm: ReactNode;
};

export function DocumentationActionPanel({ uploadForm, categoryForm }: DocumentationActionPanelProps) {
  const [openPanel, setOpenPanel] = useState<"upload" | "category" | null>(null);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-bold ${
            openPanel === "upload" ? "bg-accent text-ink" : "border border-slate-200 bg-white text-ink hover:bg-slate-100"
          }`}
          onClick={() => setOpenPanel((current) => (current === "upload" ? null : "upload"))}
        >
          <FileUp className="h-4 w-4" aria-hidden="true" />
          Dokument hinzufügen
        </button>
        <button
          type="button"
          className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-bold ${
            openPanel === "category" ? "bg-accent text-ink" : "border border-slate-200 bg-white text-ink hover:bg-slate-100"
          }`}
          onClick={() => setOpenPanel((current) => (current === "category" ? null : "category"))}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Kategorie hinzufügen
        </button>
      </div>

      {openPanel === "upload" ? uploadForm : null}
      {openPanel === "category" ? categoryForm : null}
    </div>
  );
}
