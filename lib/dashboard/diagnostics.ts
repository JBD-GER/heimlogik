import "server-only";
import { diagnosticCostBasis, diagnosticDefaultHourlyRateNet } from "@/lib/dashboard/diagnostic-pricing";
import { labelFor } from "@/lib/dashboard/labels";

export type DiagnosticModulePreset = {
  key: string;
  label: string;
  description: string;
};

export const diagnosticModulePresets: DiagnosticModulePreset[] = [
  { key: "situation", label: "Ist-Situation", description: "Allgemeiner Zustand, Ausgangslage und Kontext beim Kunden." },
  { key: "customer_issue", label: "Kundenmeldung", description: "Wortlaut, Häufigkeit und konkrete Auswirkung aus Kundensicht." },
  { key: "functional_test", label: "Funktionstest", description: "Geprüfte Funktion, Soll-Verhalten und tatsächliches Verhalten." },
  { key: "knx_bus", label: "KNX / Bus", description: "Busspannung, Telegramme, Linien, Schnittstelle und ETS-Beobachtungen." },
  { key: "dali", label: "DALI / Licht", description: "DALI-Gateway, EVGs, Leuchten, Adressen und Lichtszenen." },
  { key: "network", label: "Netzwerk / WLAN", description: "IP-Adressen, Switch, Router, VLAN, WLAN-Abdeckung und Erreichbarkeit." },
  { key: "visualization_app", label: "Visualisierung / App", description: "App, Visualisierung, Logik, Bedienoberfläche und Nutzerrechte." },
  { key: "hardware", label: "Hardware", description: "Aktoren, Sensoren, Netzteile, Gateways und Gerätezustand." },
  { key: "remote_access", label: "Fernzugriff", description: "VPN, Tailscale, Remote Gateway und externe Erreichbarkeit." },
  { key: "measurement", label: "Messung / Prüfung", description: "Messwerte, Fotos, Prüfmittel, Auffälligkeiten und Nachweise." },
  { key: "recommendation", label: "Empfehlung", description: "Technische Empfehlung, nächste Schritte und Aufwandsschätzung." },
  { key: "custom", label: "Individuell", description: "Freier Befundbaustein für besondere Situationen." },
];

export function diagnosticModuleLabel(value?: string | null) {
  return diagnosticModulePresets.find((item) => item.key === value)?.label ?? labelFor(value);
}

export function splitList(value?: string | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function buildDiagnosticAnalysisInput({
  customerName,
  projectName,
  propertyName,
  hourlyRateNet = diagnosticDefaultHourlyRateNet,
  diagnostic,
  modules,
}: {
  customerName: string;
  projectName: string;
  propertyName?: string | null;
  hourlyRateNet?: number;
  diagnostic: {
    title: string;
    customer_report?: string | null;
    problem_description?: string | null;
    internal_assessment?: string | null;
    error_category?: string | null;
    priority?: string | null;
    result?: string | null;
    recommended_action?: string | null;
    effort_estimate?: string | null;
  };
  modules: Array<{
    module_type: string;
    title: string;
    affected_area?: string | null;
    affected_systems?: string[] | null;
    observation?: string | null;
    expected_state?: string | null;
    actual_state?: string | null;
    evidence?: string | null;
    recommendation?: string | null;
    severity?: string | null;
    notes?: string | null;
  }>;
}) {
  const moduleText = modules.length
    ? modules
        .map((item, index) =>
          [
            `Befund ${index + 1}: ${item.title}`,
            `Typ: ${diagnosticModuleLabel(item.module_type)}`,
            item.affected_area ? `Bereich: ${item.affected_area}` : "",
            item.affected_systems?.length ? `Betroffene Systeme: ${item.affected_systems.join(", ")}` : "",
            item.severity ? `Schweregrad: ${labelFor(item.severity)}` : "",
            item.observation ? `Beobachtung: ${item.observation}` : "",
            item.expected_state ? `Soll-Zustand: ${item.expected_state}` : "",
            item.actual_state ? `Ist-Zustand: ${item.actual_state}` : "",
            item.evidence ? `Nachweis: ${item.evidence}` : "",
            item.recommendation ? `Empfehlung: ${item.recommendation}` : "",
            item.notes ? `Notizen: ${item.notes}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        )
        .join("\n\n")
    : "Es wurden noch keine modularen Befunde erfasst.";

  return [
    `Kunde: ${customerName}`,
    `Projekt: ${projectName}`,
    propertyName ? `Objekt/Gebäude: ${propertyName}` : "",
    `Kalkulationsgrundlage: ${diagnosticCostBasis(hourlyRateNet)} Führe Material, Anfahrt und Fremdleistungen nur auf, wenn sie aus den Befunden erkennbar sind; ansonsten als nicht enthalten kennzeichnen. Nenne keine internen Gründe für den verwendeten Stundensatz.`,
    `Diagnostik: ${diagnostic.title}`,
    `Kategorie: ${labelFor(diagnostic.error_category)}`,
    `Priorität: ${labelFor(diagnostic.priority)}`,
    diagnostic.customer_report ? `Kundenmeldung:\n${diagnostic.customer_report}` : "",
    diagnostic.problem_description ? `Problembeschreibung / Ist-Situation:\n${diagnostic.problem_description}` : "",
    diagnostic.internal_assessment ? `Interne Einschätzung:\n${diagnostic.internal_assessment}` : "",
    diagnostic.result ? `Bisheriges Ergebnis:\n${diagnostic.result}` : "",
    diagnostic.recommended_action ? `Bereits empfohlene Maßnahme:\n${diagnostic.recommended_action}` : "",
    diagnostic.effort_estimate ? `Aufwandsschätzung:\n${diagnostic.effort_estimate}` : "",
    `Modulare Befunde:\n${moduleText}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
