export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatTime(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatCurrency(value?: number | string | null) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatFileSize(value?: number | null) {
  if (!value) return "—";
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

export function customerName(customer: {
  customer_type?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  company_name?: string | null;
  contact_person?: string | null;
}) {
  if (customer.customer_type === "business") {
    return customer.company_name || customer.contact_person || "Gewerbekunde";
  }

  return [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.company_name || "Privatkunde";
}
