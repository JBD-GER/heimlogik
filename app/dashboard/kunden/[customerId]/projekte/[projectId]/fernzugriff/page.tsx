import { CheckCircle2, Circle, Router, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { remoteAccessModules } from "@/lib/dashboard/remote-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = {
  params: Promise<{ customerId: string; projectId: string }>;
};

type RemoteAccessRow = {
  item_key: string;
  is_completed: boolean;
  fields: Record<string, string> | null;
  notes: string | null;
};

const flowNodes: Array<{ label: string; Icon: LucideIcon }> = [
  { label: "Laptop", Icon: ShieldCheck },
  { label: "Tailscale", Icon: Zap },
  { label: "Gateway", Icon: Router },
  { label: "KNX-IP", Icon: CheckCircle2 },
];

function fieldValue(row: RemoteAccessRow | undefined, key: string) {
  return row?.fields?.[key] ?? "";
}

export default async function ProjectRemoteAccessPage({ params }: PageProps) {
  const { customerId, projectId } = await params;
  const { project } = await getProjectContext(customerId, projectId);

  if (!project) return null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("project_remote_access_items")
    .select("item_key, is_completed, fields, notes")
    .eq("project_id", projectId);
  const rows = ((data ?? []) as RemoteAccessRow[]).reduce<Record<string, RemoteAccessRow>>((items, row) => {
    items[row.item_key] = row;
    return items;
  }, {});
  const completed = remoteAccessModules.filter((module) => rows[module.key]?.is_completed).length;
  const progress = Math.round((completed / remoteAccessModules.length) * 100);
  const apiPath = `/api/dashboard/customers/${customerId}/projects/${projectId}/remote-access`;

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Projekt" title="Fernzugriff" description={`Remote-Wartung, KNX-IP-Zugang und Tailscale-Gateway für ${project.project_name}.`} />

      {error ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Die Fernzugriff-Tabelle fehlt noch. Bitte die Migration <strong>supabase/project_remote_access.sql</strong> in Supabase ausführen.
        </section>
      ) : null}

      <section className="overflow-hidden rounded-md border border-slate-200 bg-[#101813] text-white shadow-sm">
        <div className="grid gap-8 p-4 sm:p-6 xl:grid-cols-[1fr_300px]">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide text-accent">
              <span>Heimlogik Remote Standard</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-white">{completed}/{remoteAccessModules.length} Module abgeschlossen</span>
            </div>
            <div className="mt-8 overflow-x-auto pb-8">
              <div className="grid min-w-[640px] grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] items-center gap-3">
                {flowNodes.map(({ label, Icon }, index) => (
                  <div key={label} className="contents">
                    <div key={`${label}-node`} className="relative flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-white/10 sm:h-20 sm:w-20">
                      <span className="absolute inset-0 animate-ping rounded-full border border-accent/40" />
                      <Icon className="h-6 w-6 text-accent sm:h-7 sm:w-7" aria-hidden="true" />
                      <span className="absolute -bottom-7 text-xs font-semibold text-slate-200">{label}</span>
                    </div>
                    {index < 3 ? <div key={`${label}-line`} className="h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 animate-pulse rounded-full bg-accent" /></div> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-md bg-white/10 p-5">
            <p className="text-sm font-bold text-accent">Fernwartung aktivieren</p>
            <p className="mt-3 text-4xl font-black sm:text-5xl">{progress}%</p>
            <div className="mt-5 h-3 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-200">
              KNX-IP-Schnittstelle, Heimlogik Gateway, Tailscale und ETS-Test werden als abschließbare Module dokumentiert.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        {remoteAccessModules.map((module, index) => {
          const row = rows[module.key];
          const isDone = Boolean(row?.is_completed);

          return (
            <section key={module.key} className={`rounded-md border bg-white p-5 shadow-sm ${isDone ? "border-emerald-200" : "border-slate-200"}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${isDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {isDone ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <Circle className="h-5 w-5" aria-hidden="true" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {String(index + 1).padStart(2, "0")} · {module.eyebrow}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-ink">{module.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{module.description}</p>
                  </div>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${isDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {isDone ? "Abgeschlossen" : "Offen"}
                </span>
              </div>

              <form action={apiPath} method="post" className="mt-5 grid gap-4">
                <input type="hidden" name="item_key" value={module.key} />
                <div className="grid gap-4 md:grid-cols-2">
                  {module.fields.map((field) => (
                    <label key={field.key} className={`grid gap-2 text-sm font-semibold text-ink ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                      {field.label}
                      {field.type === "textarea" ? (
                        <textarea name={`field_${field.key}`} defaultValue={fieldValue(row, field.key)} placeholder={field.placeholder} className="min-h-24 rounded-md border border-slate-200 px-3 py-2 font-normal" />
                      ) : (
                        <input name={`field_${field.key}`} defaultValue={fieldValue(row, field.key)} placeholder={field.placeholder} className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                      )}
                    </label>
                  ))}
                </div>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Interne Notiz
                  <textarea name="notes" defaultValue={row?.notes ?? ""} placeholder="Keine Klartext-Passwörter speichern. Hinweise, Abstimmungen und Besonderheiten hier notieren." className="min-h-20 rounded-md border border-slate-200 px-3 py-2 font-normal" />
                </label>
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
                  <label className="inline-flex items-center gap-3 text-sm font-bold text-ink">
                    <input type="checkbox" name="is_completed" defaultChecked={isDone} className="h-5 w-5 rounded border-slate-300 accent-ink" />
                    Modul abschließen
                  </label>
                  <button className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
                    Modul speichern
                  </button>
                </div>
              </form>
            </section>
          );
        })}
      </div>
    </div>
  );
}
