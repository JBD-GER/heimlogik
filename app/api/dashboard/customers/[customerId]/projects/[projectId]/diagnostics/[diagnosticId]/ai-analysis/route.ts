import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { applyDiagnosticHourlyRate, diagnosticAnalysisJsonSchema, diagnosticAnalysisToPlainText, normalizeDiagnosticAnalysis } from "@/lib/dashboard/diagnostic-analysis";
import { diagnosticHourlyRateForProject } from "@/lib/dashboard/diagnostic-pricing";
import { buildDiagnosticAnalysisInput } from "@/lib/dashboard/diagnostics";
import { customerName } from "@/lib/dashboard/format";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string; diagnosticId: string }>;
};

type DiagnosticRow = {
  title: string;
  customer_report: string | null;
  problem_description: string | null;
  internal_assessment: string | null;
  error_category: string | null;
  priority: string | null;
  result: string | null;
  recommended_action: string | null;
  effort_estimate: string | null;
};

type DiagnosticModuleRow = {
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
};

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function extractResponseText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const record = payload as Record<string, unknown>;
  if (typeof record.output_text === "string") return record.output_text;

  const output = Array.isArray(record.output) ? record.output : [];
  return output
    .flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const content = (item as Record<string, unknown>).content;
      if (!Array.isArray(content)) return [];
      return content.flatMap((contentItem) => {
        if (!contentItem || typeof contentItem !== "object") return [];
        const text = (contentItem as Record<string, unknown>).text;
        return typeof text === "string" ? [text] : [];
      });
    })
    .join("\n")
    .trim();
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await requireDashboardUser();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return errorResponse("OPENAI_API_KEY fehlt in der Umgebung.");
  }

  const { customerId, projectId, diagnosticId } = await params;
  const { customer, project, property } = await getProjectContext(customerId, projectId);
  if (!customer || !project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const supabase = createSupabaseAdminClient();
  const [{ data: diagnostic }, { data: modules }, { data: signatures }, partnerAssignmentsResult] = await Promise.all([
    supabase.from("diagnostics").select("*").eq("id", diagnosticId).eq("project_id", projectId).single(),
    supabase.from("diagnostic_modules").select("*").eq("diagnostic_id", diagnosticId).order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("diagnostic_signatures").select("signer_type").eq("diagnostic_id", diagnosticId),
    supabase.from("project_professional_partners").select("professional_partner_id", { count: "exact", head: true }).eq("project_id", projectId),
  ]);

  if (!diagnostic) {
    return errorResponse("Diagnostik wurde nicht gefunden.", 404);
  }

  const diagnosticRow = diagnostic as DiagnosticRow;
  const moduleRows = (modules ?? []) as DiagnosticModuleRow[];
  const hasHeimlogikSignature = (signatures ?? []).some((signature) => signature.signer_type === "heimlogik");
  const diagnosticHourlyRateNet = diagnosticHourlyRateForProject((partnerAssignmentsResult.count ?? 0) > 0);

  if (!moduleRows.length) {
    return errorResponse("Bitte zuerst mindestens einen Befund speichern.");
  }

  if (!hasHeimlogikSignature) {
    return errorResponse("Bitte zuerst die Ist-Situation durch Heimlogik unterschreiben.");
  }

  const input = buildDiagnosticAnalysisInput({
    customerName: customerName(customer),
    projectName: project.project_name,
    propertyName: property?.property_name,
    hourlyRateNet: diagnosticHourlyRateNet,
    diagnostic: diagnosticRow,
    modules: moduleRows,
  });
  const model = process.env.OPENAI_DIAGNOSTIC_MODEL ?? process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        `Du bist ein technischer Smart-Home-Diagnostiker für Heimlogik. Erstelle ausschließlich strukturierte JSON-Daten für einen offiziellen Diagnostikbericht auf Deutsch. Schreibe sachlich, kundentauglich und ohne Begriffe wie KI, künstliche Intelligenz, Modell oder automatisch erzeugt. Für jeden Befund nenne nachvollziehbare mögliche Ursachen, konkrete Prüfungen, empfohlene Maßnahmen, Aufwand in Stunden und Kosten auf Basis von ${diagnosticHourlyRateNet} EUR netto pro Stunde. Verwende exakt diese Kalkulationsgrundlage und nenne keine internen Gründe für den Stundensatz. Alle Stunden- und Kostenwerte sind ausdrücklich unverbindliche Orientierungs- und Schätzwerte, kein Angebot und keine Abrechnungssumme. Material, Anfahrt und Fremdleistungen nur nennen, wenn sie aus den Befunden ableitbar sind; sonst als nicht enthalten ausweisen. Behaupte nichts als sicher, wenn es nicht aus den Befunden folgt. Keine Passwörter, keine Zugangsdaten, keine spekulativen Garantien.`,
      input,
      text: {
        format: {
          type: "json_schema",
          name: "heimlogik_diagnostic_analysis",
          schema: diagnosticAnalysisJsonSchema,
          strict: true,
        },
      },
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as unknown;
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? ((payload as { error?: { message?: string } }).error?.message ?? "Die technische Analyse konnte nicht erstellt werden.")
        : "Die technische Analyse konnte nicht erstellt werden.";
    return errorResponse(message, response.status);
  }

  const analysis = extractResponseText(payload);
  if (!analysis) {
    return errorResponse("Die technische Analyse hat keine verwertbaren Daten zurückgegeben.");
  }

  let structuredAnalysis = null;
  try {
    structuredAnalysis = normalizeDiagnosticAnalysis(JSON.parse(analysis));
  } catch {
    structuredAnalysis = null;
  }
  if (!structuredAnalysis) {
    return errorResponse("Die technische Analyse konnte nicht strukturiert verarbeitet werden.");
  }

  const pricedStructuredAnalysis = applyDiagnosticHourlyRate(structuredAnalysis, diagnosticHourlyRateNet);
  const plainTextSummary = diagnosticAnalysisToPlainText(pricedStructuredAnalysis);

  const { error } = await supabase
    .from("diagnostics")
    .update({
      ai_analysis: JSON.stringify(pricedStructuredAnalysis),
      ai_model: model,
      ai_generated_at: new Date().toISOString(),
      report_file_id: null,
      report_generated_at: null,
      report_status: "ai_generated",
      result: diagnosticRow.result ?? plainTextSummary.slice(0, 900),
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
    activity_type: "note",
    title: "Technische Ursachenanalyse erstellt",
    description: model,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/diagnostik/${diagnosticId}`, request.url), 303);
}
