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

function assertSignature(value: FormDataEntryValue | null) {
  const signature = String(value ?? "");
  return signature.startsWith("data:image/png;base64,") ? signature : null;
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
  const signerType = String(formData.get("signer_type") ?? "");
  const signerName = optionalText(formData.get("signer_name"));
  const signatureDataUrl = assertSignature(formData.get("signature_data"));

  if (!["heimlogik", "customer"].includes(signerType)) {
    return errorResponse("Unbekannter Unterschriftstyp.");
  }

  if (!signerName || !signatureDataUrl) {
    return errorResponse("Name und Unterschrift sind Pflichtfelder.");
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

  const signedAt = new Date().toISOString();
  const { error } = await supabase.from("diagnostic_signatures").upsert(
    {
      diagnostic_id: diagnosticId,
      signer_type: signerType,
      signer_name: signerName,
      signature_data_url: signatureDataUrl,
      signed_at: signedAt,
      created_by: user.id,
    },
    { onConflict: "diagnostic_id,signer_type" },
  );

  if (error) {
    return errorResponse(error.message);
  }

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    diagnostic_id: diagnosticId,
    activity_type: "note",
    title: signerType === "customer" ? "Kunde hat Ist-Situation unterschrieben" : "Heimlogik hat Ist-Situation unterschrieben",
    description: signerName,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`, request.url), 303);
}
