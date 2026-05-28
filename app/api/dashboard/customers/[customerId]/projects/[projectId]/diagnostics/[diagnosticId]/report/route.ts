import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { parseDiagnosticAnalysis } from "@/lib/dashboard/diagnostic-analysis";
import { diagnosticHourlyRateForProject } from "@/lib/dashboard/diagnostic-pricing";
import { renderDiagnosticReportPdf } from "@/lib/dashboard/diagnostic-report-pdf";
import { customerName } from "@/lib/dashboard/format";
import { normalizeReportImage } from "@/lib/dashboard/image-files";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string; diagnosticId: string }>;
};

type DiagnosticRow = {
  id: string;
  title: string;
  diagnostic_number: string | null;
  customer_report: string | null;
  problem_description: string | null;
  internal_assessment: string | null;
  error_category: string | null;
  priority: string | null;
  status: string | null;
  checked_at: string | null;
  result: string | null;
  recommended_action: string | null;
  effort_estimate: string | null;
  ai_analysis: string | null;
};

type SignatureRow = {
  signer_type: string;
  signer_name: string;
  signature_data_url: string;
  signed_at: string;
};

type ModuleRow = {
  id: string;
  module_type: string;
  title: string;
  affected_area: string | null;
  affected_systems: string[] | null;
  observation: string | null;
  expected_state: string | null;
  actual_state: string | null;
  evidence: string | null;
  recommendation: string | null;
  severity: string | null;
  notes: string | null;
  photo_file_id?: string | null;
};

type PhotoFileRow = {
  id: string;
  file_name: string;
  mime_type: string | null;
  storage_bucket: string;
  storage_path: string;
  diagnostic_module_id: string | null;
};

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function addressLines(address?: { street: string; house_number: string | null; postal_code: string; city: string; country: string }) {
  if (!address) return [];
  return [
    [address.street, address.house_number].filter(Boolean).join(" "),
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.country,
  ].filter(Boolean);
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await requireDashboardUser();
  const { customerId, projectId, diagnosticId } = await params;
  const { customer, addresses, project, property } = await getProjectContext(customerId, projectId);

  if (!customer || !project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const supabase = createSupabaseAdminClient();
  const [{ data: diagnostic }, { data: modules }, { data: signatures }] = await Promise.all([
    supabase.from("diagnostics").select("*").eq("id", diagnosticId).eq("project_id", projectId).single(),
    supabase.from("diagnostic_modules").select("*").eq("diagnostic_id", diagnosticId).order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("diagnostic_signatures").select("signer_type, signer_name, signature_data_url, signed_at").eq("diagnostic_id", diagnosticId),
  ]);

  if (!diagnostic) {
    return errorResponse("Diagnostik wurde nicht gefunden.", 404);
  }

  const diagnosticRow = diagnostic as DiagnosticRow;
  const diagnosticHourlyRateNet = diagnosticHourlyRateForProject();
  if (!diagnosticRow.ai_analysis) {
    return errorResponse("Bitte zuerst eine technische Ursachenanalyse erstellen.");
  }
  const structuredAnalysis = parseDiagnosticAnalysis(diagnosticRow.ai_analysis, diagnosticHourlyRateNet);
  if (!structuredAnalysis) {
    return errorResponse("Bitte die technische Analyse neu erstellen, damit feste Berichtsdaten vorliegen.");
  }
  const diagnosticReportRow = { ...diagnosticRow, ai_analysis: JSON.stringify(structuredAnalysis) };

  const signedRows = ((signatures ?? []) as SignatureRow[]).sort((a, b) => {
    const order = { heimlogik: 0, customer: 1 } as Record<string, number>;
    return (order[a.signer_type] ?? 9) - (order[b.signer_type] ?? 9);
  });
  const hasHeimlogikSignature = signedRows.some((signature) => signature.signer_type === "heimlogik");
  if (!hasHeimlogikSignature) {
    return errorResponse("Bitte zuerst die Ist-Situation durch Heimlogik unterschreiben.");
  }

  const displayName = customerName(customer);
  const createdAt = new Date();
  const fileName = `Diagnostikbericht-${slugify(displayName)}-${slugify(project.project_name)}-${createdAt.toISOString().slice(0, 10)}.pdf`;
  const storagePath = `customers/${customerId}/projects/${projectId}/diagnostics/${diagnosticId}/${randomUUID()}-${fileName}`;
  const primaryAddress = addresses.find((address) => address.address_type === "primary");
  const moduleRows = (modules ?? []) as ModuleRow[];
  if (!moduleRows.length) {
    return errorResponse("Bitte zuerst mindestens einen Befund speichern.");
  }

  const moduleIds = moduleRows.map((diagnosticModule) => diagnosticModule.id);
  const legacyPhotoFileIds = moduleRows.map((diagnosticModule) => diagnosticModule.photo_file_id).filter(Boolean) as string[];
  const [modulePhotoFilesResult, legacyPhotoFilesResult] = await Promise.all([
    moduleIds.length
      ? supabase
          .from("files")
          .select("id, file_name, mime_type, storage_bucket, storage_path, diagnostic_module_id")
          .in("diagnostic_module_id", moduleIds)
          .order("created_at", { ascending: true })
      : Promise.resolve({ data: [] }),
    legacyPhotoFileIds.length
      ? supabase
          .from("files")
          .select("id, file_name, mime_type, storage_bucket, storage_path, diagnostic_module_id")
          .in("id", legacyPhotoFileIds)
      : Promise.resolve({ data: [] }),
  ]);
  const photoFileMap = new Map<string, PhotoFileRow>();
  for (const file of [...(modulePhotoFilesResult.data ?? []), ...(legacyPhotoFilesResult.data ?? [])] as PhotoFileRow[]) {
    photoFileMap.set(file.id, file);
  }

  const photosByModule = new Map<string, { fileName: string; mimeType: string | null; bytes: Buffer }[]>();
  const legacyPhotoBytes = new Map<string, { fileName: string; mimeType: string | null; bytes: Buffer }>();

  await Promise.all(
    Array.from(photoFileMap.values()).map(async (file) => {
      const { data } = await supabase.storage.from(file.storage_bucket).download(file.storage_path);
      if (!data) return;
      const normalizedImage = await normalizeReportImage(file.file_name, file.mime_type, Buffer.from(await data.arrayBuffer()));
      if (!normalizedImage) return;
      const photo = {
        fileName: normalizedImage.fileName,
        mimeType: normalizedImage.mimeType,
        bytes: normalizedImage.bytes,
      };

      if (file.diagnostic_module_id) {
        const current = photosByModule.get(file.diagnostic_module_id) ?? [];
        current.push(photo);
        photosByModule.set(file.diagnostic_module_id, current);
      }

      legacyPhotoBytes.set(file.id, photo);
    }),
  );

  for (const diagnosticModule of moduleRows) {
    if (photosByModule.has(diagnosticModule.id) || !diagnosticModule.photo_file_id) continue;
    const legacyPhoto = legacyPhotoBytes.get(diagnosticModule.photo_file_id);
    if (legacyPhoto) photosByModule.set(diagnosticModule.id, [legacyPhoto]);
  }
  const fileBuffer = await renderDiagnosticReportPdf({
    title: `Diagnostikbericht ${diagnosticRow.title}`,
    customerName: displayName,
    customerLines: [
      ...addressLines(primaryAddress),
      customer.email ? `E-Mail: ${customer.email}` : "",
      customer.phone || customer.mobile ? `Telefon: ${customer.phone ?? customer.mobile}` : "",
    ].filter(Boolean),
    projectName: project.project_name,
    propertyName: property?.property_name,
    createdAt,
    diagnostic: diagnosticReportRow,
    modules: moduleRows.map((diagnosticModule) => ({
      ...diagnosticModule,
      photos: photosByModule.get(diagnosticModule.id) ?? [],
    })),
    signatures: signedRows.map((signature) => ({
      label: signature.signer_type === "customer" ? "Unterschrift Kunde" : "Unterschrift Heimlogik",
      name: signature.signer_name,
      signedAt: new Date(signature.signed_at),
      dataUrl: signature.signature_data_url,
    })),
  });

  const { error: uploadError } = await supabase.storage.from("project-files").upload(storagePath, fileBuffer, {
    contentType: "application/pdf",
    upsert: false,
  });

  if (uploadError) {
    return errorResponse(uploadError.message);
  }

  const { data: file, error: fileError } = await supabase
    .from("files")
    .insert({
      customer_id: customerId,
      property_id: property?.id ?? null,
      project_id: projectId,
      diagnostic_id: diagnosticId,
      file_name: fileName,
      mime_type: "application/pdf",
      file_size_bytes: fileBuffer.byteLength,
      category: "documentation",
      storage_bucket: "project-files",
      storage_path: storagePath,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (fileError || !file) {
    return errorResponse(fileError?.message ?? "Bericht konnte nicht gespeichert werden.");
  }

  const { error } = await supabase
    .from("diagnostics")
    .update({
      report_file_id: file.id,
      report_generated_at: createdAt.toISOString(),
      report_status: "report_generated",
      status: "completed",
    })
    .eq("id", diagnosticId)
    .eq("project_id", projectId);

  if (error) {
    return errorResponse(error.message);
  }

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    diagnostic_id: diagnosticId,
    activity_type: "file_uploaded",
    title: "Diagnostikbericht erzeugt",
    description: fileName,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`);
  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`, request.url), 303);
}
