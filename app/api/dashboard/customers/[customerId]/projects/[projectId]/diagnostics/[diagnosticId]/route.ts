import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string; diagnosticId: string }>;
};

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function optionalDateTime(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? new Date(text).toISOString() : null;
}

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  await requireDashboardUser();
  const { customerId, projectId, diagnosticId } = await params;
  const formData = await request.formData();
  const title = optionalText(formData.get("title"));

  if (!title) {
    return errorResponse("Bitte einen Titel eintragen.");
  }

  const { project } = await getProjectContext(customerId, projectId);
  if (!project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("diagnostics")
    .update({
      title,
      status: String(formData.get("status") ?? "new"),
      priority: String(formData.get("priority") ?? "normal"),
      error_category: String(formData.get("error_category") ?? "other"),
      checked_at: optionalDateTime(formData.get("checked_at")),
      customer_report: optionalText(formData.get("customer_report")),
      problem_description: optionalText(formData.get("problem_description")),
      internal_assessment: optionalText(formData.get("internal_assessment")),
      result: optionalText(formData.get("result")),
      recommended_action: optionalText(formData.get("recommended_action")),
      effort_estimate: optionalText(formData.get("effort_estimate")),
    })
    .eq("id", diagnosticId)
    .eq("project_id", projectId);

  if (error) {
    return errorResponse(error.message);
  }

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`);
  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`, request.url), 303);
}
