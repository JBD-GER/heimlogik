export type DiagnosticCause = {
  cause: string;
  likelihood: string;
  rationale: string;
};

export type DiagnosticFindingAnalysis = {
  title: string;
  affected_systems: string[];
  current_state: string;
  target_state: string;
  assessment: string;
  possible_causes: DiagnosticCause[];
  recommended_checks: string[];
  recommended_actions: string[];
  effort_hours_min: number;
  effort_hours_max: number;
  cost_min: number;
  cost_max: number;
  risk_level: string;
  customer_note: string;
};

export type DiagnosticStructuredAnalysis = {
  summary: string;
  overall_status: string;
  overall_recommendation: string;
  cost_basis: string;
  estimated_total_hours_min: number;
  estimated_total_hours_max: number;
  estimated_total_cost_min: number;
  estimated_total_cost_max: number;
  findings: DiagnosticFindingAnalysis[];
  required_material_or_external_services: string[];
  limitations: string[];
};

export const diagnosticAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "overall_status",
    "overall_recommendation",
    "cost_basis",
    "estimated_total_hours_min",
    "estimated_total_hours_max",
    "estimated_total_cost_min",
    "estimated_total_cost_max",
    "findings",
    "required_material_or_external_services",
    "limitations",
  ],
  properties: {
    summary: { type: "string" },
    overall_status: { type: "string" },
    overall_recommendation: { type: "string" },
    cost_basis: { type: "string" },
    estimated_total_hours_min: { type: "number" },
    estimated_total_hours_max: { type: "number" },
    estimated_total_cost_min: { type: "number" },
    estimated_total_cost_max: { type: "number" },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "affected_systems",
          "current_state",
          "target_state",
          "assessment",
          "possible_causes",
          "recommended_checks",
          "recommended_actions",
          "effort_hours_min",
          "effort_hours_max",
          "cost_min",
          "cost_max",
          "risk_level",
          "customer_note",
        ],
        properties: {
          title: { type: "string" },
          affected_systems: { type: "array", items: { type: "string" } },
          current_state: { type: "string" },
          target_state: { type: "string" },
          assessment: { type: "string" },
          possible_causes: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["cause", "likelihood", "rationale"],
              properties: {
                cause: { type: "string" },
                likelihood: { type: "string" },
                rationale: { type: "string" },
              },
            },
          },
          recommended_checks: { type: "array", items: { type: "string" } },
          recommended_actions: { type: "array", items: { type: "string" } },
          effort_hours_min: { type: "number" },
          effort_hours_max: { type: "number" },
          cost_min: { type: "number" },
          cost_max: { type: "number" },
          risk_level: { type: "string" },
          customer_note: { type: "string" },
        },
      },
    },
    required_material_or_external_services: { type: "array", items: { type: "string" } },
    limitations: { type: "array", items: { type: "string" } },
  },
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.map(stringValue).filter(Boolean) : [];
}

function causes(value: unknown): DiagnosticCause[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((item) => ({
    cause: stringValue(item.cause),
    likelihood: stringValue(item.likelihood),
    rationale: stringValue(item.rationale),
  })).filter((item) => item.cause || item.rationale);
}

export function normalizeDiagnosticAnalysis(value: unknown): DiagnosticStructuredAnalysis | null {
  if (!isRecord(value)) return null;
  const findingsRaw = Array.isArray(value.findings) ? value.findings : [];
  const findings = findingsRaw.filter(isRecord).map((item) => ({
    title: stringValue(item.title),
    affected_systems: stringArray(item.affected_systems),
    current_state: stringValue(item.current_state),
    target_state: stringValue(item.target_state),
    assessment: stringValue(item.assessment),
    possible_causes: causes(item.possible_causes),
    recommended_checks: stringArray(item.recommended_checks),
    recommended_actions: stringArray(item.recommended_actions),
    effort_hours_min: numberValue(item.effort_hours_min),
    effort_hours_max: numberValue(item.effort_hours_max),
    cost_min: numberValue(item.cost_min),
    cost_max: numberValue(item.cost_max),
    risk_level: stringValue(item.risk_level),
    customer_note: stringValue(item.customer_note),
  })).filter((item) => item.title || item.assessment);

  return {
    summary: stringValue(value.summary),
    overall_status: stringValue(value.overall_status),
    overall_recommendation: stringValue(value.overall_recommendation),
    cost_basis: stringValue(value.cost_basis) || "Stundensatz 120 EUR netto pro Stunde. Material, Anfahrt und Fremdleistungen sind nicht enthalten, sofern nicht separat ausgewiesen.",
    estimated_total_hours_min: numberValue(value.estimated_total_hours_min),
    estimated_total_hours_max: numberValue(value.estimated_total_hours_max),
    estimated_total_cost_min: numberValue(value.estimated_total_cost_min),
    estimated_total_cost_max: numberValue(value.estimated_total_cost_max),
    findings,
    required_material_or_external_services: stringArray(value.required_material_or_external_services),
    limitations: stringArray(value.limitations),
  };
}

export function parseDiagnosticAnalysis(value?: string | null) {
  if (!value) return null;
  try {
    return normalizeDiagnosticAnalysis(JSON.parse(value));
  } catch {
    return null;
  }
}

export function diagnosticAnalysisToPlainText(analysis: DiagnosticStructuredAnalysis) {
  const findingText = analysis.findings
    .map((finding, index) =>
      [
        `Befund ${index + 1}: ${finding.title}`,
        finding.assessment ? `Bewertung: ${finding.assessment}` : "",
        finding.possible_causes.length ? `Mögliche Ursachen: ${finding.possible_causes.map((item) => item.cause).join(", ")}` : "",
        finding.recommended_checks.length ? `Prüfungen: ${finding.recommended_checks.join(", ")}` : "",
        finding.recommended_actions.length ? `Maßnahmen: ${finding.recommended_actions.join(", ")}` : "",
        `Aufwand: ${finding.effort_hours_min}-${finding.effort_hours_max} h`,
        `Kosten: ${finding.cost_min}-${finding.cost_max} EUR`,
      ].filter(Boolean).join("\n"),
    )
    .join("\n\n");

  return [
    analysis.summary,
    analysis.overall_status ? `Gesamtstatus: ${analysis.overall_status}` : "",
    analysis.overall_recommendation ? `Empfehlung: ${analysis.overall_recommendation}` : "",
    findingText,
    analysis.limitations.length ? `Hinweise: ${analysis.limitations.join(" ")}` : "",
  ].filter(Boolean).join("\n\n");
}

