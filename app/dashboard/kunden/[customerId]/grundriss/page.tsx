import { EmptyState } from "@/components/dashboard/EmptyState";
import { formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { getCustomerFiles } from "@/lib/dashboard/customer-data";

type PageProps = { params: Promise<{ customerId: string }> };

export default async function CustomerFloorPlanPage({ params }: PageProps) {
  const { customerId } = await params;
  const files = await getCustomerFiles(customerId, "floor_plan");

  if (files.length === 0) return <EmptyState title="Noch keine Grundrisse" description="Grundrisse werden im privaten Supabase Storage Bucket gespeichert und hier verknüpft." />;

  return (
    <div className="grid gap-4">
      {files.map((file) => (
        <article key={file.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-ink">{file.file_name}</h2>
          <p className="mt-2 text-sm text-slate-600">{labelFor(file.category)} · {file.mime_type ?? "Datei"} · {formatDate(file.created_at)}</p>
          <p className="mt-3 break-all text-xs text-slate-500">{file.storage_bucket}/{file.storage_path}</p>
        </article>
      ))}
    </div>
  );
}
