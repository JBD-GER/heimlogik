import Link from "next/link";
import { BrainCircuit, Camera, FileText, PenLine, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { FindingPhotoInput } from "@/components/dashboard/FindingPhotoInput";
import { FloorRoomSelect } from "@/components/dashboard/FloorRoomSelect";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SignaturePad } from "@/components/dashboard/SignaturePad";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { parseDiagnosticAnalysis } from "@/lib/dashboard/diagnostic-analysis";
import { diagnosticHourlyRateForProject } from "@/lib/dashboard/diagnostic-pricing";
import { diagnosticModuleLabel } from "@/lib/dashboard/diagnostics";
import { customerName, formatCurrency, formatDate, formatDateTime } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { projectSystemDisplayName, projectSystemOptionExists, projectSystemOptions } from "@/lib/dashboard/system-options";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = {
  params: Promise<{ customerId: string; projectId: string; diagnosticId: string }>;
};

type DiagnosticDetail = {
  id: string;
  title: string;
  diagnostic_number: string | null;
  problem_description: string | null;
  customer_report: string | null;
  internal_assessment: string | null;
  error_category: string;
  priority: string;
  status: string;
  checked_at: string | null;
  result: string | null;
  recommended_action: string | null;
  effort_estimate: string | null;
  ai_analysis?: string | null;
  ai_generated_at?: string | null;
  report_file_id?: string | null;
  report_generated_at?: string | null;
  report_status?: string | null;
};

type DiagnosticModule = {
  id: string;
  module_type: string;
  title: string;
  affected_area: string | null;
  affected_systems: string[] | null;
  floor_id: string | null;
  room_id: string | null;
  observation: string | null;
  expected_state: string | null;
  actual_state: string | null;
  evidence: string | null;
  recommendation: string | null;
  severity: string;
  notes: string | null;
  created_at: string;
  photo_file_id?: string | null;
  floors?: { floor_name: string | null } | null;
  rooms?: { room_name: string | null } | null;
};

type DiagnosticSignature = {
  signer_type: string;
  signer_name: string;
  signed_at: string;
};

type FloorRow = {
  id: string;
  floor_name: string;
};

type RoomRow = {
  id: string;
  floor_id: string | null;
  room_name: string;
};

type ProjectSystemRow = {
  id: string;
  system_type: string;
  manufacturer: string | null;
  model: string | null;
  description: string | null;
};

type FileRow = {
  id: string;
  file_name: string;
  mime_type: string | null;
  diagnostic_module_id?: string | null;
};

function dateTimeInputValue(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

function systemLabel(system: ProjectSystemRow) {
  return projectSystemDisplayName(system) || labelFor(system.system_type);
}

export default async function DiagnosticDetailPage({ params }: PageProps) {
  const { customerId, projectId, diagnosticId } = await params;
  const { customer, project, property } = await getProjectContext(customerId, projectId);

  if (!customer || !project) return null;

  const supabase = createSupabaseAdminClient();
  const diagnosticResult = await supabase.from("diagnostics").select("*").eq("id", diagnosticId).eq("project_id", projectId).single();
  const diagnostic = diagnosticResult.data as DiagnosticDetail | null;

  if (!diagnostic) return null;

  const [modulesResult, signaturesResult, floorsResult, roomsResult, systemsResult, reportFileResult, partnerAssignmentsResult] = await Promise.all([
    supabase
      .from("diagnostic_modules")
      .select("*, floors(floor_name), rooms(room_name)")
      .eq("diagnostic_id", diagnosticId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase.from("diagnostic_signatures").select("signer_type, signer_name, signed_at").eq("diagnostic_id", diagnosticId),
    property ? supabase.from("floors").select("id, floor_name").eq("property_id", property.id).order("level_number", { ascending: true }) : Promise.resolve({ data: [], error: null }),
    property ? supabase.from("rooms").select("id, floor_id, room_name").eq("property_id", property.id).order("room_name", { ascending: true }) : Promise.resolve({ data: [], error: null }),
    supabase.from("project_systems").select("id, system_type, manufacturer, model, description").eq("project_id", projectId).order("created_at", { ascending: true }),
    diagnostic.report_file_id ? supabase.from("files").select("id, file_name, mime_type").eq("id", diagnostic.report_file_id).single() : Promise.resolve({ data: null, error: null }),
    supabase.from("project_professional_partners").select("professional_partner_id", { count: "exact", head: true }).eq("project_id", projectId),
  ]);

  const migrationMissing = Boolean(modulesResult.error || signaturesResult.error);
  const modules = (modulesResult.data ?? []) as unknown as DiagnosticModule[];
  const moduleIds = modules.map((diagnosticModule) => diagnosticModule.id);
  const photoFileIds = modules.map((diagnosticModule) => diagnosticModule.photo_file_id).filter(Boolean) as string[];
  const modulePhotoFilesResult = moduleIds.length
    ? await supabase
        .from("files")
        .select("id, file_name, mime_type, diagnostic_module_id")
        .in("diagnostic_module_id", moduleIds)
        .order("created_at", { ascending: true })
    : { data: [], error: null };
  const legacyPhotoFilesResult = photoFileIds.length
    ? await supabase.from("files").select("id, file_name, mime_type").in("id", photoFileIds)
    : { data: [], error: null };
  const photoFilesByModule = new Map<string, FileRow[]>();

  for (const file of (modulePhotoFilesResult.data ?? []) as FileRow[]) {
    if (!file.diagnostic_module_id) continue;
    const current = photoFilesByModule.get(file.diagnostic_module_id) ?? [];
    current.push(file);
    photoFilesByModule.set(file.diagnostic_module_id, current);
  }

  const legacyPhotoFiles = new Map(((legacyPhotoFilesResult.data ?? []) as FileRow[]).map((file) => [file.id, file]));
  for (const diagnosticModule of modules) {
    if (photoFilesByModule.has(diagnosticModule.id) || !diagnosticModule.photo_file_id) continue;
    const legacyFile = legacyPhotoFiles.get(diagnosticModule.photo_file_id);
    if (legacyFile) photoFilesByModule.set(diagnosticModule.id, [legacyFile]);
  }
  const signatures = (signaturesResult.data ?? []) as DiagnosticSignature[];
  const floors = (floorsResult.data ?? []) as FloorRow[];
  const rooms = (roomsResult.data ?? []) as RoomRow[];
  const systems = (systemsResult.data ?? []) as ProjectSystemRow[];
  const reportFile = reportFileResult.data as FileRow | null;
  const baseApiPath = `/api/dashboard/customers/${customerId}/projects/${projectId}/diagnostics/${diagnosticId}`;
  const displayCustomerName = customerName(customer);
  const heimlogikSignature = signatures.find((signature) => signature.signer_type === "heimlogik");
  const customerSignature = signatures.find((signature) => signature.signer_type === "customer");
  const canPrepareReport = modules.length > 0 && Boolean(heimlogikSignature);
  const availableSystemOptions = projectSystemOptions.filter((option) => !projectSystemOptionExists(option, systems));
  const diagnosticHourlyRateNet = diagnosticHourlyRateForProject((partnerAssignmentsResult.count ?? 0) > 0);
  const structuredAnalysis = parseDiagnosticAnalysis(diagnostic.ai_analysis, diagnosticHourlyRateNet);

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Diagnostik"
        title={diagnostic.title}
        description="Schnelle Ist-Aufnahme: Foto machen, Befund notieren, optional Raum und Systeme zuordnen, daraus Bericht erzeugen."
      />

      {migrationMissing ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Die modularen Diagnostik-Tabellen fehlen noch. Bitte die Migration <strong>supabase/diagnostic_reports.sql</strong> in Supabase ausführen.
        </section>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-4">
        <InfoCard title="Befunde">
          <p className="text-3xl font-black text-ink">{modules.length}</p>
          <p className="mt-2 text-sm text-slate-600">{diagnostic.diagnostic_number ?? "Ohne Berichtnummer"}</p>
        </InfoCard>
        <InfoCard title="Status">
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={diagnostic.status} />
            <StatusBadge value={diagnostic.priority} />
          </div>
        </InfoCard>
        <InfoCard title="Unterschriften">
          <p className="text-sm text-slate-600">Heimlogik: {heimlogikSignature ? formatDate(heimlogikSignature.signed_at) : "offen"}</p>
          <p className="mt-2 text-sm text-slate-600">Kunde: {customerSignature ? formatDate(customerSignature.signed_at) : "optional"}</p>
        </InfoCard>
        <InfoCard title="Bericht">
          <p className="text-sm text-slate-600">Analyse: {diagnostic.ai_generated_at ? formatDate(diagnostic.ai_generated_at) : "offen"}</p>
          <p className="mt-2 text-sm text-slate-600">PDF: {diagnostic.report_generated_at ? formatDate(diagnostic.report_generated_at) : "offen"}</p>
        </InfoCard>
      </div>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Camera className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="text-xl font-bold text-ink">Befund aufnehmen</h2>
        </div>
        <form action={`${baseApiPath}/modules`} method="post" encType="multipart/form-data" className="mt-5 grid gap-4">
          <input type="hidden" name="module_type" value="situation" />
          <div className="grid gap-4 md:grid-cols-[1fr_0.35fr]">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Kurzbeschreibung
              <input name="title" required placeholder="z.B. Taster Wohnzimmer ohne Funktion" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Schweregrad
              <select name="severity" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="normal">Normal</option>
                <option value="low">Niedrig</option>
                <option value="high">Hoch</option>
                <option value="critical">Kritisch</option>
              </select>
            </label>
          </div>
          <textarea
            name="observation"
            required
            placeholder="Was ist die Ist-Situation? Was funktioniert nicht, was sieht man, was hat der Kunde gemeldet?"
            className="min-h-32 rounded-md border border-slate-200 px-3 py-2"
          />
          <textarea
            name="expected_state"
            placeholder="Soll-Zustand optional: Was soll die Funktion eigentlich erfüllen? z.B. Licht soll per Taster und App zuverlässig ein-/ausschalten."
            className="min-h-24 rounded-md border border-slate-200 px-3 py-2"
          />
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Fotos / Nachweise optional
            <FindingPhotoInput />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <FloorRoomSelect floors={floors} rooms={rooms} />
            <input name="affected_area" placeholder="Freier Bereich optional" className="mt-auto min-h-11 rounded-md border border-slate-200 px-3" />
          </div>
          <div className="grid gap-3">
            <p className="text-sm font-semibold text-ink">Betroffene vorhandene Systeme optional</p>
            {systems.length ? (
              <div className="flex flex-wrap gap-2">
                {systems.map((system) => {
                  const label = systemLabel(system);
                  return (
                    <label key={system.id} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
                      <input type="checkbox" name="affected_systems" value={label} className="h-4 w-4 accent-ink" />
                      {label}
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Noch keine Systeme am Projekt hinterlegt.</p>
            )}
          </div>
          <fieldset className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
            <legend className="px-1 text-sm font-bold text-ink">System aus Vorlage ergänzen</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {availableSystemOptions.map((system) => (
                <label key={system.value} className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                  <input type="checkbox" name="system_options" value={system.value} className="h-4 w-4 rounded border-slate-300 accent-ink" />
                  <span>{system.label}</span>
                </label>
              ))}
            </div>
            {availableSystemOptions.length ? (
              <p className="text-xs leading-5 text-slate-500">Ausgewählte Systeme werden beim Speichern automatisch im Projekt hinterlegt und diesem Befund zugeordnet.</p>
            ) : (
              <p className="text-sm text-slate-500">Alle Vorlagen-Systeme sind bereits am Projekt hinterlegt.</p>
            )}
          </fieldset>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Komplett neues System
            <input name="new_systems" placeholder="Neues System ergänzen, z.B. Apple Home, Gira X1, UniFi WLAN" className="min-h-11 rounded-md border border-slate-200 px-3" />
          </label>
          <textarea name="notes" placeholder="Interne Notiz optional" className="min-h-20 rounded-md border border-slate-200 px-3 py-2" />
          <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
            Befund speichern
          </button>
        </form>
      </section>

      {modules.length === 0 ? (
        <EmptyState title="Noch keine Befunde" description="Nimm pro Foto oder Beobachtung einen eigenen Befund auf. Daraus entsteht später der technische Bericht." />
      ) : (
        <div className="grid gap-4">
          {modules.map((item, index) => {
            const itemPhotoFiles = photoFilesByModule.get(item.id) ?? [];
            return (
              <article key={item.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                          Befund {index + 1} · {diagnosticModuleLabel(item.module_type)}
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-ink">{item.title}</h2>
                        <p className="mt-2 text-sm text-slate-600">
                          {[item.affected_area, item.floors?.floor_name, item.rooms?.room_name].filter(Boolean).join(" · ") || "Ohne Raumbezug"}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
                        <StatusBadge value={item.severity} />
                        <form action={`${baseApiPath}/modules/${item.id}`} method="post">
                          <input type="hidden" name="_intent" value="delete" />
                          <button className="focus-ring inline-flex min-h-9 items-center gap-2 rounded-md border border-red-200 bg-white px-3 text-xs font-bold text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Löschen
                          </button>
                        </form>
                      </div>
                    </div>
                    {item.affected_systems?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.affected_systems.map((system) => (
                          <span key={system} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{system}</span>
                        ))}
                      </div>
                    ) : null}
                    {item.observation ? (
                      <div className="mt-4 rounded-md bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Ist-Situation</p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{item.observation}</p>
                      </div>
                    ) : null}
                    {item.expected_state ? (
                      <div className="mt-3 rounded-md border border-emerald-100 bg-emerald-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Soll-Zustand / gewünschte Funktion</p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{item.expected_state}</p>
                      </div>
                    ) : null}
                    {item.notes ? <p className="mt-4 rounded-md bg-slate-50 p-4 text-sm leading-6 text-slate-600">{item.notes}</p> : null}
                    {itemPhotoFiles.length ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6">
                        {itemPhotoFiles.map((file) => {
                          const fileUrl = `/api/dashboard/customers/${customerId}/files/${file.id}?inline=1`;
                          return (
                            <div key={file.id} className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                              <div className="flex aspect-[4/3] items-center justify-center">
                                {file.mime_type?.startsWith("image/") ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={fileUrl} alt={file.file_name} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="px-3 text-center text-xs font-semibold text-slate-500">{file.file_name}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                    <details className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
                      <summary className="cursor-pointer text-sm font-bold text-ink">Befund bearbeiten</summary>
                      <form action={`${baseApiPath}/modules/${item.id}`} method="post" encType="multipart/form-data" className="mt-4 grid gap-4">
                        <input type="hidden" name="_intent" value="update" />
                        <input type="hidden" name="module_type" value={item.module_type} />
                        <div className="grid gap-4 md:grid-cols-[1fr_0.35fr]">
                          <label className="grid gap-2 text-sm font-semibold text-ink">
                            Kurzbeschreibung
                            <input name="title" required defaultValue={item.title} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
                          </label>
                          <label className="grid gap-2 text-sm font-semibold text-ink">
                            Schweregrad
                            <select name="severity" defaultValue={item.severity} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                              <option value="normal">Normal</option>
                              <option value="low">Niedrig</option>
                              <option value="high">Hoch</option>
                              <option value="critical">Kritisch</option>
                            </select>
                          </label>
                        </div>
                        <textarea
                          name="observation"
                          required
                          defaultValue={item.observation ?? ""}
                          placeholder="Ist-Situation"
                          className="min-h-28 rounded-md border border-slate-200 bg-white px-3 py-2"
                        />
                        <textarea
                          name="expected_state"
                          defaultValue={item.expected_state ?? ""}
                          placeholder="Soll-Zustand / gewünschte Funktion optional"
                          className="min-h-24 rounded-md border border-slate-200 bg-white px-3 py-2"
                        />
                        <div className="grid gap-4 md:grid-cols-3">
                          <FloorRoomSelect floors={floors} rooms={rooms} defaultFloorId={item.floor_id} defaultRoomId={item.room_id} />
                          <input name="affected_area" defaultValue={item.affected_area ?? ""} placeholder="Freier Bereich optional" className="mt-auto min-h-11 rounded-md border border-slate-200 bg-white px-3" />
                        </div>
                        <div className="grid gap-3">
                          <p className="text-sm font-semibold text-ink">Betroffene vorhandene Systeme</p>
                          {systems.length ? (
                            <div className="flex flex-wrap gap-2">
                              {systems.map((system) => {
                                const label = systemLabel(system);
                                return (
                                  <label key={system.id} className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                                    <input type="checkbox" name="affected_systems" value={label} defaultChecked={item.affected_systems?.includes(label)} className="h-4 w-4 accent-ink" />
                                    {label}
                                  </label>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">Noch keine Systeme am Projekt hinterlegt.</p>
                          )}
                        </div>
                        {availableSystemOptions.length ? (
                          <fieldset className="grid gap-3 rounded-md border border-slate-200 bg-white p-4">
                            <legend className="px-1 text-sm font-bold text-ink">System aus Vorlage ergänzen</legend>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {availableSystemOptions.map((system) => (
                                <label key={system.value} className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700">
                                  <input type="checkbox" name="system_options" value={system.value} className="h-4 w-4 rounded border-slate-300 accent-ink" />
                                  <span>{system.label}</span>
                                </label>
                              ))}
                            </div>
                          </fieldset>
                        ) : null}
                        <input name="new_systems" placeholder="Komplett neues System ergänzen" className="min-h-11 rounded-md border border-slate-200 bg-white px-3" />
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Weitere Bilder hinzufügen
                          <FindingPhotoInput />
                        </label>
                        {itemPhotoFiles.length ? (
                          <fieldset className="grid gap-3 rounded-md border border-slate-200 bg-white p-4">
                            <legend className="px-1 text-sm font-bold text-ink">Vorhandene Bilder entfernen</legend>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                              {itemPhotoFiles.map((file) => {
                                const fileUrl = `/api/dashboard/customers/${customerId}/files/${file.id}?inline=1`;
                                return (
                                  <label key={file.id} className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                                    <div className="flex aspect-[4/3] items-center justify-center">
                                      {file.mime_type?.startsWith("image/") ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={fileUrl} alt={file.file_name} className="h-full w-full object-cover" />
                                      ) : (
                                        <span className="px-3 text-center text-xs font-semibold text-slate-500">{file.file_name}</span>
                                      )}
                                    </div>
                                    <span className="flex items-center gap-2 p-2 text-xs font-bold text-red-700">
                                      <input type="checkbox" name="remove_file_ids" value={file.id} className="h-4 w-4 accent-red-700" />
                                      Entfernen
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </fieldset>
                        ) : null}
                        <textarea name="notes" defaultValue={item.notes ?? ""} placeholder="Interne Notiz optional" className="min-h-20 rounded-md border border-slate-200 bg-white px-3 py-2" />
                        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:items-center md:justify-between">
                          <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                            Änderungen speichern
                          </button>
                        </div>
                      </form>
                    </details>
              </article>
            );
          })}
        </div>
      )}

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-ink">Berichtsdaten</h2>
        <form action={baseApiPath} method="post" className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
              Berichtstitel
              <input name="title" required defaultValue={diagnostic.title} className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Prüfung am
              <input name="checked_at" type="datetime-local" defaultValue={dateTimeInputValue(diagnostic.checked_at)} className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Status
              <select name="status" defaultValue={diagnostic.status} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                <option value="new">Neu</option>
                <option value="in_review">In Prüfung</option>
                <option value="error_found">Fehler gefunden</option>
                <option value="customer_question_open">Rückfrage offen</option>
                <option value="solution_suggested">Lösung vorgeschlagen</option>
                <option value="resolved">Behoben</option>
                <option value="not_solvable">Nicht lösbar</option>
                <option value="completed">Abgeschlossen</option>
              </select>
            </label>
          </div>
          <textarea name="customer_report" defaultValue={diagnostic.customer_report ?? ""} placeholder="Kundenmeldung optional" className="min-h-20 rounded-md border border-slate-200 px-3 py-2" />
          <textarea name="problem_description" defaultValue={diagnostic.problem_description ?? ""} placeholder="Übergreifende Ist-Situation optional" className="min-h-20 rounded-md border border-slate-200 px-3 py-2" />
          <div className="hidden">
            <input name="priority" value={diagnostic.priority} readOnly />
            <input name="error_category" value={diagnostic.error_category} readOnly />
            <textarea name="internal_assessment" defaultValue={diagnostic.internal_assessment ?? ""} />
            <textarea name="result" defaultValue={diagnostic.result ?? ""} />
            <textarea name="recommended_action" defaultValue={diagnostic.recommended_action ?? ""} />
            <textarea name="effort_estimate" defaultValue={diagnostic.effort_estimate ?? ""} />
          </div>
          <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-ink hover:bg-slate-100 md:w-fit">
            Berichtsdaten speichern
          </button>
        </form>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <InfoCard title="Ist-Situation unterschreiben">
          <div className="mb-5 flex items-center gap-3 text-sm text-slate-600">
            <PenLine className="h-5 w-5 text-accent" aria-hidden="true" />
            Optional. Bei Ferndiagnostik reicht die Heimlogik-Unterschrift; die Kundenunterschrift kann frei bleiben.
          </div>
          <form action={`${baseApiPath}/signatures`} method="post" className="grid gap-3">
            <input type="hidden" name="signer_type" value="heimlogik" />
            <input name="signer_name" defaultValue="Heimlogik" className="min-h-11 rounded-md border border-slate-200 px-3" />
            <SignaturePad name="signature_data" />
            <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
              Heimlogik unterschreiben
            </button>
          </form>
          {heimlogikSignature ? <p className="mt-4 text-sm text-slate-600">Unterschrieben von {heimlogikSignature.signer_name} am {formatDateTime(heimlogikSignature.signed_at)}.</p> : null}
        </InfoCard>

        <InfoCard title="Kunde optional">
          <p className="mb-5 text-sm leading-6 text-slate-600">Nur nutzen, wenn der Kunde die dokumentierte Ist-Situation mitzeichnet.</p>
          <form action={`${baseApiPath}/signatures`} method="post" className="grid gap-3">
            <input type="hidden" name="signer_type" value="customer" />
            <input name="signer_name" defaultValue={displayCustomerName} className="min-h-11 rounded-md border border-slate-200 px-3" />
            <SignaturePad name="signature_data" />
            <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-ink hover:bg-slate-100 md:w-fit">
              Kunde unterschreiben lassen
            </button>
          </form>
          {customerSignature ? <p className="mt-4 text-sm text-slate-600">Unterschrieben von {customerSignature.signer_name} am {formatDateTime(customerSignature.signed_at)}.</p> : null}
        </InfoCard>
      </section>

      {canPrepareReport ? (
        <section className="grid gap-5">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-accent">Berichtseite</p>
                <h2 className="mt-1 text-2xl font-black text-ink">Diagnostikbericht vorbereiten</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Hier wird die unterschriebene Ist-Situation als offizieller Bericht zusammengeführt. Die technische Analyse ergänzt Ursachen, Prüfungen, Maßnahmen, Aufwand und Kosten auf Basis von {diagnosticHourlyRateNet} €/h netto.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={diagnostic.report_status ?? "draft"} />
                <StatusBadge value={diagnostic.ai_generated_at ? "ai_generated" : "draft"} />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Kunde</p>
                <p className="mt-2 font-bold text-ink">{displayCustomerName}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Projekt</p>
                <p className="mt-2 font-bold text-ink">{project.project_name}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Unterschriften</p>
                <p className="mt-2 text-sm text-slate-700">Heimlogik: {formatDate(heimlogikSignature?.signed_at)}</p>
                <p className="mt-1 text-sm text-slate-700">Kunde: {customerSignature ? formatDate(customerSignature.signed_at) : "nicht vorhanden"}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {modules.map((item, index) => (
                <article key={item.id} className="rounded-md border border-slate-200 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-accent">Befund {index + 1}</p>
                      <h3 className="mt-1 font-bold text-ink">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {[item.affected_area, item.floors?.floor_name, item.rooms?.room_name].filter(Boolean).join(" · ") || "Ohne Raumbezug"}
                      </p>
                    </div>
                    <StatusBadge value={item.severity} />
                  </div>
                  {item.observation ? <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{item.observation}</p> : null}
                  {item.expected_state ? (
                    <p className="mt-3 whitespace-pre-line rounded-md bg-emerald-50 p-3 text-sm leading-6 text-slate-700">
                      <span className="font-bold text-emerald-800">Soll-Zustand: </span>
                      {item.expected_state}
                    </p>
                  ) : null}
                  {item.affected_systems?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.affected_systems.map((system) => (
                        <span key={system} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{system}</span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <InfoCard title="Technische Ursachenanalyse">
              <div className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                <BrainCircuit className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                Die Analyse wird als feste Datenstruktur für den Bericht erstellt: Bewertung, Ursachen, Prüfungen, Maßnahmen, Aufwand und Kosten je Befund.
              </div>
              <form action={`${baseApiPath}/ai-analysis`} method="post" className="mt-5">
                <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-ink px-4 text-sm font-bold text-white hover:bg-slate-700 md:w-fit">
                  Technische Analyse erstellen
                </button>
              </form>
              {structuredAnalysis ? (
                <div className="mt-5 grid gap-4">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Zusammenfassung</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{structuredAnalysis.summary}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md border border-slate-200 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Gesamtstatus</p>
                      <p className="mt-2 text-sm font-bold text-ink">{structuredAnalysis.overall_status}</p>
                    </div>
                    <div className="rounded-md border border-slate-200 p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Aufwand / Kosten</p>
                      <p className="mt-2 text-sm font-bold text-ink">
                        {structuredAnalysis.estimated_total_hours_min}-{structuredAnalysis.estimated_total_hours_max} h · {formatCurrency(structuredAnalysis.estimated_total_cost_min)}-{formatCurrency(structuredAnalysis.estimated_total_cost_max)}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {structuredAnalysis.findings.map((finding, index) => (
                      <article key={`${finding.title}-${index}`} className="rounded-md border border-slate-200 bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-accent">Analyse Befund {index + 1}</p>
                        <h3 className="mt-1 font-bold text-ink">{finding.title}</h3>
                        {finding.assessment ? <p className="mt-2 text-sm leading-6 text-slate-700">{finding.assessment}</p> : null}
                        {finding.possible_causes.length ? (
                          <div className="mt-3 grid gap-2">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Mögliche Ursachen</p>
                            {finding.possible_causes.map((cause) => (
                              <p key={`${finding.title}-${cause.cause}`} className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                                <span className="font-bold text-ink">{cause.cause}</span>
                                {cause.likelihood ? ` · ${cause.likelihood}` : ""}
                                {cause.rationale ? `: ${cause.rationale}` : ""}
                              </p>
                            ))}
                          </div>
                        ) : null}
                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                          <div className="rounded-md bg-slate-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Prüfungen</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{finding.recommended_checks.join(", ") || "—"}</p>
                          </div>
                          <div className="rounded-md bg-slate-50 p-3">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Maßnahmen</p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">{finding.recommended_actions.join(", ") || "—"}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : diagnostic.ai_analysis ? (
                <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  Diese Analyse liegt noch im alten Freitextformat vor. Bitte die technische Analyse neu erstellen, damit der Bericht die festen Datenfelder nutzen kann.
                </p>
              ) : null}
            </InfoCard>

            <InfoCard title="Offizieller Bericht">
              <div className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                <FileText className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                Das PDF wird erst nach der technischen Analyse erzeugt. Vorhandene Unterschriften werden eingebunden; ohne Kundenunterschrift erscheint nur Heimlogik.
              </div>
              <form action={`${baseApiPath}/report`} method="post" className="mt-5">
                <button disabled={!structuredAnalysis} className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 md:w-fit">
                  PDF-Bericht erstellen
                </button>
              </form>
              {structuredAnalysis && reportFile ? (
                <Link href={`/api/dashboard/customers/${customerId}/files/${reportFile.id}`} className="focus-ring mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-ink hover:bg-slate-100">
                  Bericht herunterladen
                </Link>
              ) : null}
            </InfoCard>
          </section>
        </section>
      ) : null}
    </div>
  );
}
