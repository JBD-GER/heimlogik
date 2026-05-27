export const diagnosticDefaultHourlyRateNet = 210;
export const diagnosticReducedHourlyRateNet = 190;

export function diagnosticHourlyRateForProject(hasProfessionalPartner: boolean) {
  return hasProfessionalPartner ? diagnosticReducedHourlyRateNet : diagnosticDefaultHourlyRateNet;
}

export function diagnosticCostBasis(hourlyRateNet = diagnosticDefaultHourlyRateNet) {
  return `Stundensatz ${hourlyRateNet} EUR netto pro Stunde. Material, Anfahrt und Fremdleistungen sind nicht enthalten, sofern nicht separat ausgewiesen.`;
}
