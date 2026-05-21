import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { remoteAccessModules } from "@/lib/dashboard/remote-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string }>;
};

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
  const itemKey = String(formData.get("item_key") ?? "");
  const remoteModule = remoteAccessModules.find((item) => item.key === itemKey);

  if (!remoteModule) {
    return errorResponse("Fernzugriff-Modul wurde nicht gefunden.");
  }

  const { project } = await getProjectContext(customerId, projectId);
  if (!project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const fields = Object.fromEntries(
    remoteModule.fields.map((field) => [field.key, String(formData.get(`field_${field.key}`) ?? "").trim()]).filter(([, value]) => value),
  );
  const isCompleted = formData.get("is_completed") === "on";
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("project_remote_access_items").upsert(
    {
      project_id: projectId,
      item_key: remoteModule.key,
      title: remoteModule.title,
      is_completed: isCompleted,
      fields,
      notes: String(formData.get("notes") ?? "").trim() || null,
      completed_at: isCompleted ? new Date().toISOString() : null,
      updated_by: user.id,
    },
    { onConflict: "project_id,item_key" },
  );

  if (error) {
    return errorResponse(error.message);
  }

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    activity_type: "note",
    title: isCompleted ? "Fernzugriff-Modul abgeschlossen" : "Fernzugriff-Modul aktualisiert",
    description: remoteModule.title,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/fernzugriff`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/fernzugriff`, request.url), 303);
}
