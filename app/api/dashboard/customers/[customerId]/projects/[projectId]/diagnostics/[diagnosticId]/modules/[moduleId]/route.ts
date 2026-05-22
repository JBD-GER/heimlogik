import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { splitList } from "@/lib/dashboard/diagnostics";
import { projectSystemDisplayName, projectSystemOptionExists, projectSystemOptions } from "@/lib/dashboard/system-options";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string; diagnosticId: string; moduleId: string }>;
};

type StoredFile = {
  id: string;
  storage_bucket: string;
  storage_path: string;
};

const maxUploadFileSize = 25 * 1024 * 1024;

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function optionalUuid(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function safeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function systemLabel(system: { system_type: string; manufacturer: string | null; model: string | null; description: string | null }) {
  return projectSystemDisplayName(system);
}

function filesFromFormData(formData: FormData) {
  return [...formData.getAll("photos"), formData.get("photo")].filter((file): file is File => file instanceof File && file.size > 0);
}

function formatUploadSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

function validateUploadFiles(files: File[]) {
  const oversizedFile = files.find((file) => file.size > maxUploadFileSize);
  if (!oversizedFile) return null;

  return `Die Datei "${oversizedFile.name}" ist ${formatUploadSize(oversizedFile.size)} groß. Bitte Foto erneut auswählen; iPad-Fotos werden automatisch optimiert. Maximale Einzeldatei: ${formatUploadSize(maxUploadFileSize)}.`;
}

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

async function deleteStoredFiles(supabase: ReturnType<typeof createSupabaseAdminClient>, fileIds: string[]) {
  const uniqueFileIds = Array.from(new Set(fileIds.filter(Boolean)));
  if (!uniqueFileIds.length) return;

  const { data: files } = await supabase
    .from("files")
    .select("id, storage_bucket, storage_path")
    .in("id", uniqueFileIds);

  const storedFiles = (files ?? []) as StoredFile[];
  await Promise.all(storedFiles.map((file) => supabase.storage.from(file.storage_bucket).remove([file.storage_path])));
  await supabase.from("files").delete().in("id", uniqueFileIds);
}

async function fileIdsForModule(supabase: ReturnType<typeof createSupabaseAdminClient>, moduleId: string, legacyPhotoFileId?: string | null) {
  const { data: moduleFiles } = await supabase.from("files").select("id").eq("diagnostic_module_id", moduleId);
  return Array.from(new Set([...(moduleFiles ?? []).map((file) => file.id as string), legacyPhotoFileId].filter(Boolean) as string[]));
}

async function ensureNewProjectSystems({
  supabase,
  projectId,
  diagnosticId,
  formData,
}: {
  supabase: ReturnType<typeof createSupabaseAdminClient>;
  projectId: string;
  diagnosticId: string;
  formData: FormData;
}) {
  const newSystems = Array.from(new Set(splitList(optionalText(formData.get("new_systems")))));
  const selectedSystemOptionValues = formData.getAll("system_options").map((value) => String(value));
  const selectedSystemOptions = projectSystemOptions.filter((option) => selectedSystemOptionValues.includes(option.value));
  const { data: existingProjectSystems } = await supabase
    .from("project_systems")
    .select("system_type, manufacturer, model, description")
    .eq("project_id", projectId);
  const existingSystems = existingProjectSystems ?? [];
  const knownSystemLabels = new Set(existingSystems.map((system) => systemLabel(system).toLowerCase()));
  const selectedTemplateLabels = new Set(selectedSystemOptions.map((system) => system.label.toLowerCase()));
  const templateSystemsToInsert = selectedSystemOptions
    .filter((system) => !projectSystemOptionExists(system, existingSystems))
    .map((system) => ({
      project_id: projectId,
      system_type: system.systemType,
      manufacturer: system.manufacturer ?? null,
      model: system.model ?? null,
      status: "existing",
      description: system.description ?? system.label,
      notes: `Automatisch aus Diagnostik ${diagnosticId} ergänzt.`,
    }));
  const customSystemsToInsert = newSystems
    .filter((system) => !knownSystemLabels.has(system.toLowerCase()) && !selectedTemplateLabels.has(system.toLowerCase()))
    .map((system) => ({
      project_id: projectId,
      system_type: "other",
      manufacturer: system,
      model: null,
      status: "existing",
      description: system,
      notes: `Automatisch aus Diagnostik ${diagnosticId} ergänzt.`,
    }));
  const systemsToInsert = [...templateSystemsToInsert, ...customSystemsToInsert];

  if (systemsToInsert.length) {
    await supabase.from("project_systems").insert(systemsToInsert);
  }

  const selectedSystems = formData.getAll("affected_systems").map((value) => String(value).trim()).filter(Boolean);
  return Array.from(new Set([...selectedSystems, ...selectedSystemOptions.map((system) => system.label), ...newSystems]));
}

async function resetGeneratedReport(supabase: ReturnType<typeof createSupabaseAdminClient>, diagnosticId: string) {
  await supabase
    .from("diagnostics")
    .update({
      ai_analysis: null,
      ai_model: null,
      ai_generated_at: null,
      report_file_id: null,
      report_generated_at: null,
      report_status: "draft",
    })
    .eq("id", diagnosticId);
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await requireDashboardUser();
  const { customerId, projectId, diagnosticId, moduleId } = await params;
  const formData = await request.formData();
  const intent = String(formData.get("_intent") ?? "update");

  const { project } = await getProjectContext(customerId, projectId);
  if (!project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const supabase = createSupabaseAdminClient();
  const { data: moduleRow } = await supabase
    .from("diagnostic_modules")
    .select("id, diagnostic_id, photo_file_id")
    .eq("id", moduleId)
    .eq("diagnostic_id", diagnosticId)
    .single<{ id: string; diagnostic_id: string; photo_file_id: string | null }>();

  if (!moduleRow) {
    return errorResponse("Befund wurde nicht gefunden.", 404);
  }

  const { data: diagnostic } = await supabase.from("diagnostics").select("id").eq("id", diagnosticId).eq("project_id", projectId).single();
  if (!diagnostic) {
    return errorResponse("Diagnostik wurde nicht gefunden.", 404);
  }

  if (intent === "delete") {
    const moduleFileIds = await fileIdsForModule(supabase, moduleId, moduleRow.photo_file_id);
    await deleteStoredFiles(supabase, moduleFileIds);

    const { error } = await supabase.from("diagnostic_modules").delete().eq("id", moduleId).eq("diagnostic_id", diagnosticId);
    if (error) {
      return errorResponse(error.message);
    }

    await resetGeneratedReport(supabase, diagnosticId);
    await supabase.from("activity_logs").insert({
      customer_id: customerId,
      project_id: projectId,
      diagnostic_id: diagnosticId,
      activity_type: "note",
      title: "Diagnostik-Befund gelöscht",
      description: moduleId,
      created_by: user.id,
    });
    revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`);
    return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`, request.url), 303);
  }

  const title = optionalText(formData.get("title"));
  if (!title) {
    return errorResponse("Bitte einen Titel für den Befund eintragen.");
  }

  const affectedSystems = await ensureNewProjectSystems({ supabase, projectId, diagnosticId, formData });
  const files = filesFromFormData(formData);
  const uploadValidationError = validateUploadFiles(files);

  if (uploadValidationError) {
    return errorResponse(uploadValidationError, 413);
  }

  let nextPhotoFileId = moduleRow.photo_file_id;
  const currentModuleFileIds = await fileIdsForModule(supabase, moduleId, moduleRow.photo_file_id);
  const removeFileIds = formData
    .getAll("remove_file_ids")
    .map((value) => String(value))
    .filter((fileId) => currentModuleFileIds.includes(fileId));

  if (formData.get("remove_photo") === "on" && nextPhotoFileId && currentModuleFileIds.includes(nextPhotoFileId)) {
    removeFileIds.push(nextPhotoFileId);
  }

  if (removeFileIds.length) {
    if (nextPhotoFileId && removeFileIds.includes(nextPhotoFileId)) {
      await supabase.from("diagnostic_modules").update({ photo_file_id: null }).eq("id", moduleId);
      nextPhotoFileId = null;
    }
    await deleteStoredFiles(supabase, removeFileIds);
  }

  const uploadedFileIds: string[] = [];

  for (const file of files) {
    const fileName = safeFileName(file.name) || `befund-${randomUUID()}`;
    const storagePath = `customers/${customerId}/projects/${projectId}/diagnostics/${diagnosticId}/findings/${moduleId}/${randomUUID()}-${fileName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from("project-files").upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (uploadError) {
      return errorResponse(uploadError.message);
    }

    const { data: fileRecord, error: fileError } = await supabase
      .from("files")
      .insert({
        customer_id: customerId,
        project_id: projectId,
        diagnostic_id: diagnosticId,
        diagnostic_module_id: moduleId,
        file_name: fileName,
        mime_type: file.type || null,
        file_size_bytes: file.size,
        category: "diagnostic_image",
        storage_bucket: "project-files",
        storage_path: storagePath,
        uploaded_by: user.id,
      })
      .select("id")
      .single<{ id: string }>();

    if (fileError || !fileRecord) {
      return errorResponse(fileError?.message ?? "Foto konnte nicht gespeichert werden.");
    }

    uploadedFileIds.push(fileRecord.id);
  }

  if (!nextPhotoFileId && uploadedFileIds.length) {
    nextPhotoFileId = uploadedFileIds[0];
  }

  if (!nextPhotoFileId) {
    const { data: remainingFile } = await supabase
      .from("files")
      .select("id")
      .eq("diagnostic_module_id", moduleId)
      .limit(1)
      .maybeSingle<{ id: string }>();
    nextPhotoFileId = remainingFile?.id ?? null;
  }

  const { error } = await supabase
    .from("diagnostic_modules")
    .update({
      module_type: String(formData.get("module_type") ?? "situation"),
      title,
      affected_area: optionalText(formData.get("affected_area")),
      affected_systems: affectedSystems,
      floor_id: optionalUuid(formData.get("floor_id")),
      room_id: optionalUuid(formData.get("room_id")),
      observation: optionalText(formData.get("observation")),
      expected_state: optionalText(formData.get("expected_state")),
      actual_state: optionalText(formData.get("actual_state")),
      evidence: optionalText(formData.get("evidence")),
      recommendation: optionalText(formData.get("recommendation")),
      severity: String(formData.get("severity") ?? "normal"),
      notes: optionalText(formData.get("notes")),
      photo_file_id: nextPhotoFileId,
    })
    .eq("id", moduleId)
    .eq("diagnostic_id", diagnosticId);

  if (error) {
    return errorResponse(error.message);
  }

  await resetGeneratedReport(supabase, diagnosticId);
  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    diagnostic_id: diagnosticId,
    activity_type: "note",
    title: "Diagnostik-Befund bearbeitet",
    description: title,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`, request.url), 303);
}
