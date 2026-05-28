export const diagnosticDefaultHourlyRateNet = 190;
export const diagnosticReducedHourlyRateNet = 190;

export function diagnosticHourlyRateForProject() {
  return diagnosticDefaultHourlyRateNet;
}

export function diagnosticCostBasis(hourlyRateNet = diagnosticDefaultHourlyRateNet) {
  return `Stundensatz ${hourlyRateNet} EUR netto pro Stunde. Material, Anfahrt und Fremdleistungen sind nicht enthalten, sofern nicht separat ausgewiesen.`;
}
