import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string }>;
};

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
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
  const formData = await request.formData();
  const title = optionalText(formData.get("title"));

  if (!title) {
    return errorResponse("Bitte einen Titel für die Diagnostik eintragen.");
  }

  const { project } = await getProjectContext(customerId, projectId);
  if (!project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const supabase = createSupabaseAdminClient();
  const diagnosticNumber = `DIAG-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 6).toUpperCase()}`;
  const { data, error } = await supabase
    .from("diagnostics")
    .insert({
      project_id: projectId,
      diagnostic_number: diagnosticNumber,
      title,
      problem_description: optionalText(formData.get("problem_description")),
      customer_report: optionalText(formData.get("customer_report")),
      error_category: String(formData.get("error_category") ?? "other"),
      priority: String(formData.get("priority") ?? "normal"),
      status: "new",
      report_status: "draft",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return errorResponse(error?.message ?? "Diagnostik konnte nicht erstellt werden.");
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

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik`);
  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${data.id}`, request.url), 303);
}
