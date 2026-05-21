export type ProjectSystemOption = {
  value: string;
  label: string;
  systemType: string;
  manufacturer?: string;
  model?: string;
  description?: string;
};

export const projectSystemOptions: ProjectSystemOption[] = [
  { value: "knx", label: "KNX", systemType: "knx" },
  { value: "dali", label: "DALI", systemType: "dali" },
  { value: "busch_jaeger_free_at_home", label: "Busch-Jaeger free@home", systemType: "busch_jaeger_free_at_home", manufacturer: "Busch-Jaeger", model: "free@home" },
  { value: "home_assistant", label: "Home Assistant", systemType: "home_assistant" },
  { value: "apple_home", label: "Apple Home", systemType: "other", manufacturer: "Apple", model: "Home" },
  { value: "loxone", label: "Loxone", systemType: "loxone" },
  { value: "shelly", label: "Shelly", systemType: "shelly" },
  { value: "matter", label: "Matter", systemType: "matter" },
  { value: "zigbee", label: "Zigbee", systemType: "zigbee" },
  { value: "network", label: "Netzwerk", systemType: "network" },
  { value: "wifi", label: "WLAN", systemType: "wifi" },
  { value: "sonos", label: "Sonos", systemType: "sonos" },
  { value: "cameras", label: "Kameras", systemType: "cameras" },
  { value: "alarm_system", label: "Alarmanlage", systemType: "alarm_system" },
  { value: "door_communication", label: "Türkommunikation", systemType: "door_communication" },
  { value: "energy_management", label: "Energiemanagement", systemType: "energy_management" },
  { value: "wallbox", label: "Wallbox", systemType: "wallbox" },
  { value: "pv_system", label: "PV-Anlage", systemType: "pv_system" },
];

export type ProjectSystemLike = {
  system_type: string;
  manufacturer: string | null;
  model: string | null;
  description: string | null;
};

export function projectSystemDisplayName(system: ProjectSystemLike) {
  return [system.manufacturer, system.model].filter(Boolean).join(" ") || system.description || system.system_type.replaceAll("_", " ");
}

export function projectSystemOptionExists(option: ProjectSystemOption, systems: ProjectSystemLike[]) {
  const optionLabel = option.label.toLowerCase();
  const optionManufacturer = option.manufacturer?.toLowerCase() ?? null;
  const optionModel = option.model?.toLowerCase() ?? null;

  return systems.some((system) => {
    const displayName = projectSystemDisplayName(system).toLowerCase();
    const typeMatches = option.systemType === system.system_type && option.systemType !== "other";
    const labelMatches = displayName === optionLabel;
    const manufacturerMatches = optionManufacturer && system.manufacturer?.toLowerCase() === optionManufacturer;
    const modelMatches = optionModel && system.model?.toLowerCase() === optionModel;

    return typeMatches || labelMatches || Boolean(manufacturerMatches && (!optionModel || modelMatches));
  });
}
