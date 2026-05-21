export const staffTitleOptions = [
  { value: "geschaeftsfuehrer", label: "Geschäftsführer" },
  { value: "projektleiter", label: "Projektleiter" },
  { value: "smart_home_planer", label: "Smart-Home-Planer" },
  { value: "systemintegrator", label: "Systemintegrator" },
  { value: "knx_spezialist", label: "KNX-Spezialist" },
  { value: "techniker", label: "Techniker" },
  { value: "programmierer", label: "Programmierer" },
  { value: "vertrieb", label: "Vertrieb" },
  { value: "buchhaltung", label: "Buchhaltung" },
  { value: "assistenz", label: "Assistenz" },
];

export const professionalPartnerAreaOptions = [
  { value: "elektrobetrieb", label: "Elektrobetrieb" },
  { value: "knx_gebaeudeautomation", label: "KNX / Gebäudeautomation" },
  { value: "heizung_sanitaer", label: "Heizung / Sanitär" },
  { value: "energieberatung", label: "Energieberatung" },
  { value: "pv_speicher_wallbox", label: "PV / Speicher / Wallbox" },
  { value: "netzwerk_it", label: "Netzwerk / IT" },
  { value: "sicherheitstechnik", label: "Sicherheitstechnik" },
  { value: "audio_video", label: "Audio / Video" },
  { value: "beschattung_sonnenschutz", label: "Beschattung / Sonnenschutz" },
  { value: "architektur_planung", label: "Architektur / Planung" },
  { value: "trockenbau_innenausbau", label: "Trockenbau / Innenausbau" },
  { value: "bauunternehmen_gu", label: "Bauunternehmen / GU" },
  { value: "hersteller_lieferant", label: "Hersteller / Lieferant" },
  { value: "sonstiges", label: "Sonstiges" },
];

export function staffTitleLabel(value?: string | null) {
  return staffTitleOptions.find((option) => option.value === value)?.label ?? "Mitarbeiter";
}

export function partnerAreaLabel(value?: string | null) {
  return professionalPartnerAreaOptions.find((option) => option.value === value)?.label ?? "Fachpartner";
}

export function fullStaffName(staff: { first_name?: string | null; last_name?: string | null }) {
  return [staff.first_name, staff.last_name].filter(Boolean).join(" ") || "Ohne Namen";
}
