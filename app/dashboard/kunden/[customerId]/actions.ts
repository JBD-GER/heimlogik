"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { customerName } from "@/lib/dashboard/format";
import { projectSystemOptions } from "@/lib/dashboard/system-options";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function optionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "")
    .trim()
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function optionalDate(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? new Date(text).toISOString() : null;
}

export async function createProject(formData: FormData) {
  const user = await requireDashboardUser();
  const customerId = String(formData.get("customer_id") ?? "");
  const projectName = optionalText(formData.get("project_name"));

  if (!customerId || !projectName) {
    throw new Error("Kunde und Projektname sind Pflichtfelder.");
  }

  const supabase = createSupabaseAdminClient();
  const { customer, addresses, properties } = await getCustomerContext(customerId);

  if (!customer) {
    throw new Error("Kunde wurde nicht gefunden.");
  }

  let propertyId = optionalText(formData.get("property_id"));

  if (!propertyId) {
    const primaryAddress = addresses.find((address) => address.address_type === "primary");
    const propertyName = optionalText(formData.get("property_name")) ?? `Objekt ${customerName(customer)}`;
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert({
        customer_id: customerId,
        property_name: propertyName,
        street: primaryAddress?.street ?? null,
        house_number: primaryAddress?.house_number ?? null,
        postal_code: primaryAddress?.postal_code ?? null,
        city: primaryAddress?.city ?? null,
        country: primaryAddress?.country ?? "Deutschland",
        building_type: String(formData.get("building_type") ?? "single_family_house"),
        construction_phase: String(formData.get("construction_phase") ?? "existing"),
      })
      .select("id")
      .single();

    if (propertyError || !property) {
      throw new Error(propertyError?.message ?? "Gebäude konnte nicht angelegt werden.");
    }

    propertyId = property.id;
  } else if (!properties.some((property) => property.id === propertyId)) {
    throw new Error("Das gewählte Gebäude gehört nicht zu diesem Kunden.");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      property_id: propertyId,
      project_name: projectName,
      description: optionalText(formData.get("description")),
      priority: String(formData.get("priority") ?? "normal"),
      project_status: String(formData.get("project_status") ?? "new"),
      planned_start_at: optionalDate(formData.get("planned_start_at")),
      planned_end_at: optionalDate(formData.get("planned_end_at")),
      rough_budget: optionalNumber(formData.get("rough_budget")),
      customer_requests: null,
      responsible_profile_id: user.id,
    })
    .select("id")
    .single();

  if (error || !project) {
    throw new Error(error?.message ?? "Projekt konnte nicht angelegt werden.");
  }

  const selectedSystemValues = formData.getAll("systems").map((value) => String(value));
  const selectedSystems = projectSystemOptions.filter((option) => selectedSystemValues.includes(option.value));
  const customSystems = String(formData.get("custom_systems") ?? "")
    .split(/[\n,]/)
    .map((value) => value.trim())
    .filter(Boolean);

  const systemRows = [
    ...selectedSystems.map((system) => ({
      project_id: project.id,
      system_type: system.systemType,
      manufacturer: system.manufacturer ?? null,
      model: system.model ?? null,
      status: "planned",
      description: system.description ?? system.label,
    })),
    ...customSystems.map((name) => ({
      project_id: project.id,
      system_type: "other",
      manufacturer: name,
      model: null,
      status: "planned",
      description: name,
    })),
  ];

  if (systemRows.length) {
    const { error: systemsError } = await supabase.from("project_systems").insert(systemRows);

    if (systemsError) {
      throw new Error(systemsError.message);
    }
  }

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: project.id,
    activity_type: "note",
    title: "Projekt angelegt",
    description: projectName,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte`);
  redirect(`/dashboard/kunden/${customerId}/projekte/${project.id}`);
}

export async function startDiagnostic(formData: FormData) {
  const user = await requireDashboardUser();
  const customerId = String(formData.get("customer_id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const title = optionalText(formData.get("title"));

  if (!customerId || !projectId || !title) {
    throw new Error("Kunde, Projekt und Titel sind Pflichtfelder.");
  }

  const { projectIds } = await getCustomerContext(customerId);
  if (!projectIds.includes(projectId)) {
    throw new Error("Das gewählte Projekt gehört nicht zu diesem Kunden.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("diagnostics").insert({
    project_id: projectId,
    title,
    problem_description: optionalText(formData.get("problem_description")),
    customer_report: optionalText(formData.get("customer_report")),
    error_category: String(formData.get("error_category") ?? "other"),
    priority: String(formData.get("priority") ?? "normal"),
    status: "new",
    created_by: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("projects").update({ project_status: "diagnostics" }).eq("id", projectId);
  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    activity_type: "diagnostic_started",
    title: "Diagnostik gestartet",
    description: title,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/diagnostik`);
  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik`);
  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}`);
  revalidatePath(`/dashboard/kunden/${customerId}/verlauf`);
}
