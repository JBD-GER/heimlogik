import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { customerName } from "@/lib/dashboard/format";
import { projectSystemOptions } from "@/lib/dashboard/system-options";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ customerId: string }>;
};

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

function uniqueValues(formData: FormData, name: string) {
  return Array.from(new Set(formData.getAll(name).map((value) => String(value)).filter(Boolean)));
}

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await requireDashboardUser();
  const { customerId } = await params;
  const formData = await request.formData();
  const projectName = optionalText(formData.get("project_name"));

  if (!customerId || !projectName) {
    return errorResponse("Kunde und Projektname sind Pflichtfelder.");
  }

  const supabase = createSupabaseAdminClient();
  const { customer, addresses, properties } = await getCustomerContext(customerId);

  if (!customer) {
    return errorResponse("Kunde wurde nicht gefunden.", 404);
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
      return errorResponse(propertyError?.message ?? "Gebäude konnte nicht angelegt werden.");
    }

    propertyId = property.id;
  } else if (!properties.some((property) => property.id === propertyId)) {
    return errorResponse("Das gewählte Gebäude gehört nicht zu diesem Kunden.");
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
    return errorResponse(error?.message ?? "Projekt konnte nicht angelegt werden.");
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
      return errorResponse(systemsError.message);
    }
  }

  const staffMemberIds = uniqueValues(formData, "staff_member_ids");
  if (staffMemberIds.length) {
    const { error: staffError } = await supabase.from("project_staff_members").upsert(
      staffMemberIds.map((staffMemberId) => ({
        project_id: project.id,
        staff_member_id: staffMemberId,
        created_by: user.id,
      })),
      { onConflict: "project_id,staff_member_id" },
    );

    if (staffError) {
      return errorResponse(staffError.message);
    }
  }

  const partnerIds = uniqueValues(formData, "professional_partner_ids");
  if (partnerIds.length) {
    const { error: partnerError } = await supabase.from("project_professional_partners").upsert(
      partnerIds.map((partnerId) => ({
        project_id: project.id,
        professional_partner_id: partnerId,
        created_by: user.id,
      })),
      { onConflict: "project_id,professional_partner_id" },
    );

    if (partnerError) {
      return errorResponse(partnerError.message);
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

  revalidatePath(`/dashboard/kunden/${customerId}`);
  revalidatePath(`/dashboard/kunden/${customerId}/projekte`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${project.id}`, request.url), 303);
}
