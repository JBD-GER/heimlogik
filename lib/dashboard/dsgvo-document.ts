import type { CustomerAddress, CustomerDetail } from "@/lib/dashboard/customer-data";
import { customerName } from "@/lib/dashboard/format";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatAddress(address?: CustomerAddress) {
  if (!address) return "";
  return [
    [address.street, address.house_number].filter(Boolean).join(" "),
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.country,
  ]
    .filter(Boolean)
    .map((value) => escapeHtml(value))
    .join("<br />");
}

export function buildDsgvoConsentHtml({
  customer,
  primaryAddress,
  signatureDataUrl,
  signedAt,
}: {
  customer: CustomerDetail;
  primaryAddress?: CustomerAddress;
  signatureDataUrl?: string | null;
  signedAt?: Date;
}) {
  const name = escapeHtml(customerName(customer));
  const email = customer.email ? escapeHtml(customer.email) : "nicht hinterlegt";
  const phone = customer.phone ?? customer.mobile;
  const signedDate = signedAt
    ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(signedAt)
    : "";

  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>DSGVO Einwilligung - ${name}</title>
  <style>
    body { color: #17211b; font-family: Arial, sans-serif; line-height: 1.55; margin: 40px; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    h2 { font-size: 17px; margin-top: 28px; }
    p, li { font-size: 13px; }
    .muted { color: #64748b; }
    .box { border: 1px solid #d7ded9; border-radius: 8px; margin: 22px 0; padding: 18px; }
    .grid { display: grid; gap: 10px; grid-template-columns: 1fr 1fr; }
    .signature { border-top: 1px solid #17211b; margin-top: 36px; min-height: 90px; padding-top: 10px; }
    .signature img { display: block; max-height: 82px; max-width: 320px; }
  </style>
</head>
<body>
  <h1>Einwilligung zur Datenverarbeitung</h1>
  <p class="muted">Kundenbezogene DSGVO-Unterlage für Heimlogik.</p>

  <div class="box grid">
    <div>
      <strong>Kunde</strong><br />
      ${name}<br />
      ${formatAddress(primaryAddress)}
    </div>
    <div>
      <strong>Kontakt</strong><br />
      E-Mail: ${email}<br />
      Telefon: ${phone ? escapeHtml(phone) : "nicht hinterlegt"}
    </div>
  </div>

  <h2>1. Zweck der Verarbeitung</h2>
  <p>Ich willige ein, dass Heimlogik meine Kontakt-, Objekt-, Projekt- und Kommunikationsdaten verarbeitet, soweit dies für Beratung, Planung, Angebotserstellung, Smart-Home-Installation, Dokumentation, Betreuung und Support erforderlich ist.</p>

  <h2>2. Datenarten</h2>
  <p>Verarbeitet werden können insbesondere Name, Anschrift, E-Mail-Adresse, Telefonnummer, Objektinformationen, Projektangaben, Grundrisse, Fotos, technische Dokumentationen, Diagnosedaten, Angebote, Rechnungen und Supportverlauf.</p>

  <h2>3. Datei- und Projektdokumentation</h2>
  <p>Ich bin damit einverstanden, dass projektbezogene Dateien wie Grundrisse, Bilder, technische Planungen, Dokumentationen und Abnahmeunterlagen intern gespeichert und dem jeweiligen Kunden- oder Projektvorgang zugeordnet werden.</p>

  <h2>4. Kommunikation</h2>
  <p>Heimlogik darf mich für projektbezogene Abstimmungen per E-Mail, Telefon oder sonstigen vereinbarten Kommunikationswegen kontaktieren.</p>

  <h2>5. Widerruf</h2>
  <p>Diese Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt davon unberührt.</p>

  <h2>6. Unterschrift</h2>
  <div class="box">
    <p><strong>Kundenname:</strong> ${name}</p>
    <p><strong>Datum:</strong> ${signedDate || "________________"}</p>
    <div class="signature">
      ${signatureDataUrl ? `<img src="${signatureDataUrl}" alt="Unterschrift ${name}" />` : ""}
      <span class="muted">Unterschrift Kunde</span>
    </div>
  </div>
</body>
</html>`;
}
