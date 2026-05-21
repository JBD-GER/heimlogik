import Link from "next/link";
import { Download, ExternalLink, FileText, FileUp, Plus, StickyNote } from "lucide-react";
import { DocumentationActionPanel } from "@/components/dashboard/DocumentationActionPanel";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ensureProjectDocumentCategories, getProjectFiles } from "@/lib/dashboard/customer-data";
import { formatDate, formatFileSize } from "@/lib/dashboard/format";

type PageProps = {
  params: Promise<{ customerId: string; projectId: string }>;
  searchParams: Promise<{ kategorie?: string }>;
};

function fileTypeLabel(mimeType?: string | null) {
  if (!mimeType) return "Datei";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("image/")) return "Bild";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "Tabelle";
  if (mimeType.includes("word") || mimeType.includes("document")) return "Dokument";
  return mimeType.split("/").pop()?.toUpperCase() ?? "Datei";
}

export default async function ProjectDocumentationPage({ params, searchParams }: PageProps) {
  const { customerId, projectId } = await params;
  const { kategorie } = await searchParams;
  const categories = await ensureProjectDocumentCategories(projectId);
  const activeCategory = categories.find((category) => category.slug === kategorie);
  const files = await getProjectFiles(projectId, activeCategory?.slug);
  const documentationApiPath = `/api/dashboard/customers/${customerId}/projects/${projectId}/documentation`;

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Projekt"
        title="Dokumentation"
        description="Dokumentensammlung für Grundrisse, Planungen, Fotos, Elektroplanung, Netzwerk, KNX, DALI und individuelle Kategorien."
      />

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        <Link href={`/dashboard/kunden/${customerId}/projekte/${projectId}/dokumentation`} className={`focus-ring whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${!activeCategory ? "bg-accent text-ink" : "bg-white text-slate-700 hover:bg-slate-100"}`}>
          Alle
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/dashboard/kunden/${customerId}/projekte/${projectId}/dokumentation?kategorie=${category.slug}`}
            className={`focus-ring whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${activeCategory?.id === category.id ? "bg-accent text-ink" : "bg-white text-slate-700 hover:bg-slate-100"}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <DocumentationActionPanel
        uploadForm={
          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <FileUp className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-xl font-bold text-ink">Dokument hochladen</h2>
            </div>
            <form action={documentationApiPath} method="post" encType="multipart/form-data" className="mt-5 grid gap-4">
              <input type="hidden" name="_intent" value="upload" />
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Kategorie
                <select name="document_category_id" defaultValue={activeCategory?.id ?? categories[0]?.id} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <input name="title" placeholder="Anzeigename optional" className="min-h-11 rounded-md border border-slate-200 px-3" />
              <input name="file" type="file" required className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm" />
              <textarea name="notes" placeholder="Notiz zum Dokument" className="min-h-24 rounded-md border border-slate-200 px-3 py-2" />
              <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                Hochladen
              </button>
            </form>
          </section>
        }
        categoryForm={
          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-xl font-bold text-ink">Kategorie hinzufügen</h2>
            </div>
            <form action={documentationApiPath} method="post" className="mt-5 grid gap-4">
              <input type="hidden" name="_intent" value="category" />
              <input name="name" required placeholder="z.B. Heizungsplanung" className="min-h-11 rounded-md border border-slate-200 px-3" />
              <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-ink hover:bg-slate-100 md:w-fit">
                Kategorie speichern
              </button>
            </form>
          </section>
        }
      />

      {files.length === 0 ? (
        <EmptyState title="Noch keine Dokumente" description="Lade Grundrisse, Planungen, Bilder oder PDFs hoch. Sie erscheinen dann in dieser Sammlung und in der passenden Kategorie." />
      ) : (
        <div className="grid gap-4">
          {files.map((file) => {
            const fileCategory = categories.find((category) => file.project_document_categories?.slug === category.slug || file.storage_path.includes(`/documents/${category.slug}/`));
            const fileUrl = `/api/dashboard/customers/${customerId}/files/${file.id}`;
            return (
              <article key={file.id} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-emerald-100 bg-emerald-50 text-accent">
                      <FileText className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-accent/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-green-700">{fileCategory?.name ?? "Dokument"}</span>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{fileTypeLabel(file.mime_type)}</span>
                      </div>
                      <h2 className="mt-3 break-words text-xl font-bold text-ink">{file.file_name}</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        {formatFileSize(file.file_size_bytes)} · Hochgeladen am {formatDate(file.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <a href={`${fileUrl}?inline=1`} target="_blank" rel="noreferrer" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Öffnen
                    </a>
                    <a href={fileUrl} className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-md bg-ink px-3 text-sm font-bold text-white hover:bg-slate-800">
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download
                    </a>
                  </div>
                </div>
                {file.notes ? (
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                    <p className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                      <StickyNote className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      <span>{file.notes}</span>
                    </p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
