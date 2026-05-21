import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string }>;
};

function values(formData: FormData, name: string) {
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
  const { customerId, projectId } = await params;
  const { project } = await getProjectContext(customerId, projectId);

  if (!project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const formData = await request.formData();
  const intent = String(formData.get("_intent") ?? "add");
  const supabase = createSupabaseAdminClient();

  if (intent === "remove_staff") {
    const staffMemberId = String(formData.get("staff_member_id") ?? "");
    if (staffMemberId) {
      const { error } = await supabase
        .from("project_staff_members")
        .delete()
        .eq("project_id", projectId)
        .eq("staff_member_id", staffMemberId);
      if (error) return errorResponse(error.message);
    }
  } else if (intent === "remove_partner") {
    const partnerId = String(formData.get("professional_partner_id") ?? "");
    if (partnerId) {
      const { error } = await supabase
        .from("project_professional_partners")
        .delete()
        .eq("project_id", projectId)
        .eq("professional_partner_id", partnerId);
      if (error) return errorResponse(error.message);
    }
  } else {
    const staffMemberIds = values(formData, "staff_member_ids");
    const partnerIds = values(formData, "professional_partner_ids");

    if (staffMemberIds.length) {
      const { error } = await supabase.from("project_staff_members").upsert(
        staffMemberIds.map((staffMemberId) => ({
          project_id: projectId,
          staff_member_id: staffMemberId,
          created_by: user.id,
        })),
        { onConflict: "project_id,staff_member_id" },
      );
      if (error) return errorResponse(error.message);
    }

    if (partnerIds.length) {
      const { error } = await supabase.from("project_professional_partners").upsert(
        partnerIds.map((partnerId) => ({
          project_id: projectId,
          professional_partner_id: partnerId,
          created_by: user.id,
        })),
        { onConflict: "project_id,professional_partner_id" },
      );
      if (error) return errorResponse(error.message);
    }
  }

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    activity_type: "note",
    title: "Projektzuordnung aktualisiert",
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}`);
  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/ansprechpartner`);
  revalidatePath(`/dashboard/kunden/${customerId}/projekte`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/ansprechpartner`, request.url), 303);
}

