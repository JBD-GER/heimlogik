export const berlinTimeZone = "Europe/Berlin";
export const standardHourlyRateNet = 190;

export function billingHourlyRateNet(value?: number | string | null) {
  return Number(value ?? standardHourlyRateNet) === 0 ? 0 : standardHourlyRateNet;
}

export function dateInputInBerlin(date = new Date()) {
  const parts = new Intl.DateTimeFormat("de-DE", {
    timeZone: berlinTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "1970";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${year}-${month}-${day}`;
}

export function monthRange(offset = 0) {
  const [year, month] = dateInputInBerlin().split("-").map(Number);
  const start = new Date(year, month - 1 + offset, 1);
  const end = new Date(year, month + offset, 0);
  return {
    label: new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(start),
    startDate: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-01`,
    endDate: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`,
  };
}

function berlinOffsetMinutes(utcDate: Date) {
  const timeZoneName = new Intl.DateTimeFormat("en-US", {
    timeZone: berlinTimeZone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(utcDate)
    .find((part) => part.type === "timeZoneName")?.value;
  const match = timeZoneName?.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return 60;
  const sign = match[1] === "+" ? 1 : -1;
  const hours = Number(match[2] ?? 0);
  const minutes = Number(match[3] ?? 0);
  return sign * (hours * 60 + minutes);
}

function addDays(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function berlinDateStartIso(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const offset = berlinOffsetMinutes(new Date(Date.UTC(year, month - 1, day, 12)));
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - offset * 60_000).toISOString();
}

export function berlinDateTimeIso(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  const offset = berlinOffsetMinutes(new Date(Date.UTC(year, month - 1, day, hours || 12)));
  return new Date(Date.UTC(year, month - 1, day, hours || 0, minutes || 0, 0) - offset * 60_000).toISOString();
}

export function berlinDateEndExclusiveIso(dateValue: string) {
  return berlinDateStartIso(addDays(dateValue, 1));
}

export function durationHours(startedAt?: string | null, stoppedAt?: string | null) {
  if (!startedAt || !stoppedAt) return 0;
  const ms = new Date(stoppedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.round((ms / 3_600_000) * 100) / 100;
}

export function formatHours(value: number) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
