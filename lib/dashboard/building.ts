export const floorOptions = [
  { level: -1, label: "Keller", shortLabel: "KG" },
  { level: 0, label: "Erdgeschoss", shortLabel: "EG" },
  ...Array.from({ length: 20 }, (_, index) => {
    const level = index + 1;
    return { level, label: `${level}. Obergeschoss`, shortLabel: `${level}. OG` };
  }),
  { level: 100, label: "Außenanlage", shortLabel: "Außen" },
];

export const roomTypeOptions = [
  { value: "living_room", label: "Wohnzimmer" },
  { value: "kitchen", label: "Küche" },
  { value: "bathroom", label: "Bad" },
  { value: "bedroom", label: "Schlafzimmer" },
  { value: "children_room", label: "Kinderzimmer" },
  { value: "office", label: "Büro" },
  { value: "technical_room", label: "Technikraum" },
  { value: "hallway", label: "Flur" },
  { value: "dining_room", label: "Esszimmer" },
  { value: "utility_room", label: "Hauswirtschaft" },
  { value: "garage", label: "Garage" },
  { value: "outdoor", label: "Außenbereich" },
  { value: "other", label: "Sonstiger Raum" },
];

export function floorLabelForLevel(level: number) {
  return floorOptions.find((option) => option.level === level)?.label ?? `${level}. Etage`;
}

export function floorShortLabelForLevel(level: number) {
  return floorOptions.find((option) => option.level === level)?.shortLabel ?? `${level}`;
}

export function roomTypeExists(value: string) {
  return roomTypeOptions.some((option) => option.value === value);
}
