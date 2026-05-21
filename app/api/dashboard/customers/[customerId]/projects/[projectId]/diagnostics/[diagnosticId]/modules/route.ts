import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { splitList } from "@/lib/dashboard/diagnostics";
import { projectSystemDisplayName, projectSystemOptionExists, projectSystemOptions } from "@/lib/dashboard/system-options";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string; diagnosticId: string }>;
};

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

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await requireDashboardUser();
  const { customerId, projectId, diagnosticId } = await params;
  const formData = await request.formData();
  const title = optionalText(formData.get("title"));

  if (!title) {
    return errorResponse("Bitte einen Titel für den Befund eintragen.");
  }

  const { project } = await getProjectContext(customerId, projectId);
  if (!project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const supabase = createSupabaseAdminClient();
  const { data: diagnostic } = await supabase.from("diagnostics").select("id").eq("id", diagnosticId).eq("project_id", projectId).single();
  if (!diagnostic) {
    return errorResponse("Diagnostik wurde nicht gefunden.", 404);
  }

  const newSystems = Array.from(new Set(splitList(optionalText(formData.get("new_systems")))));
  const selectedSystemOptionValues = formData.getAll("system_options").map((value) => String(value));
  const selectedSystemOptions = projectSystemOptions.filter((option) => selectedSystemOptionValues.includes(option.value));
  const { data: existingProjectSystems } = await supabase
    .from("project_systems")
    .select("system_type, manufacturer, model, description")
    .eq("project_id", projectId);
  const existingSystems = existingProjectSystems ?? [];
  const knownSystemLabels = new Set(existingSystems.map((system) => systemLabel(system).toLowerCase()));
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
  const selectedTemplateLabels = new Set(selectedSystemOptions.map((system) => system.label.toLowerCase()));
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

  const { count } = await supabase
    .from("diagnostic_modules")
    .select("id", { count: "exact", head: true })
    .eq("diagnostic_id", diagnosticId);
  const selectedSystems = formData.getAll("affected_systems").map((value) => String(value).trim()).filter(Boolean);
  const affectedSystems = Array.from(new Set([...selectedSystems, ...selectedSystemOptions.map((system) => system.label), ...newSystems]));

  const { data: moduleRow, error } = await supabase
    .from("diagnostic_modules")
    .insert({
      diagnostic_id: diagnosticId,
      module_type: String(formData.get("module_type") ?? "custom"),
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
      sort_order: count ?? 0,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !moduleRow) {
    return errorResponse(error?.message ?? "Befund konnte nicht gespeichert werden.");
  }

  const files = filesFromFormData(formData);
  const uploadedFileIds: string[] = [];

  for (const file of files) {
    const fileName = safeFileName(file.name) || `befund-${randomUUID()}`;
    const storagePath = `customers/${customerId}/projects/${projectId}/diagnostics/${diagnosticId}/findings/${moduleRow.id}/${randomUUID()}-${fileName}`;
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
        diagnostic_module_id: moduleRow.id,
        file_name: fileName,
        mime_type: file.type || null,
        file_size_bytes: file.size,
        category: "diagnostic_image",
        storage_bucket: "project-files",
        storage_path: storagePath,
        uploaded_by: user.id,
      })
      .select("id")
      .single();

    if (fileError || !fileRecord) {
      return errorResponse(fileError?.message ?? "Foto konnte nicht gespeichert werden.");
    }

    uploadedFileIds.push(fileRecord.id);
  }

  if (uploadedFileIds.length) {
    const photoUpdate = await supabase.from("diagnostic_modules").update({ photo_file_id: uploadedFileIds[0] }).eq("id", moduleRow.id);
    if (photoUpdate.error) return errorResponse(photoUpdate.error.message);
  }

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    diagnostic_id: diagnosticId,
    activity_type: "note",
    title: "Diagnostik-Befund dokumentiert",
    description: title,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`, request.url), 303);
}
