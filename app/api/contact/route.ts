import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/site.config";

export async function POST(request: Request) {
  const formData = await request.formData();
  const raw = Object.fromEntries(formData.entries());
  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        message: "Bitte prüfen Sie die markierten Felder.",
        errors: Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0]])),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.website) {
    return NextResponse.json({ message: "Vielen Dank. Ihre Anfrage wurde übermittelt." });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || siteConfig.email;
  const fromEmail = process.env.RESEND_FROM_EMAIL || siteConfig.email;

  if (resendApiKey) {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);
    await Promise.all([
      resend.emails.send({
        from: `${siteConfig.companyName} <${fromEmail}>`,
        to: contactEmail,
        subject: `Neue Smart-Home-Anfrage: ${data.service} von ${data.name}`,
        html: adminEmailHtml(data),
        text: adminEmailText(data),
        replyTo: data.email,
      }),
      resend.emails.send({
        from: `${siteConfig.companyName} <${fromEmail}>`,
        to: data.email,
        subject: "Ihre Anfrage bei Heimlogik ist angekommen",
        html: customerEmailHtml(data),
        text: customerEmailText(data),
        replyTo: siteConfig.email,
      }),
    ]);
  } else {
    console.info("Neue Heimlogik Kontaktanfrage im Demo-Modus", data);
  }

  return NextResponse.json({
    message: "Vielen Dank. Ihre Anfrage wurde gesendet.",
    redirectTo: "/danke?lead=1",
  });
}

type ContactData = ReturnType<typeof contactSchema.parse>;

const fieldLabels: Array<[keyof ContactData, string]> = [
  ["name", "Name"],
  ["phone", "Telefon"],
  ["email", "E-Mail"],
  ["location", "Ort / PLZ"],
  ["propertyType", "Projektart / Immobilientyp"],
  ["service", "Gewünschte Leistung"],
  ["rooms", "Anzahl Räume"],
  ["radiators", "Anzahl Heizkörper"],
  ["thermostatsPresent", "Thermostate vorhanden"],
  ["preferredSystem", "Gewünschtes System"],
  ["wifiIssues", "WLAN-Probleme"],
];

function adminEmailText(data: ContactData) {
  return [
    "Neue Anfrage über heimlogik.de",
    "",
    ...fieldLabels.map(([key, label]) => `${label}: ${data[key] || "-"}`),
    "",
    "Nachricht:",
    data.message,
  ].join("\n");
}

function customerEmailText(data: ContactData) {
  return [
    `Hallo ${data.name},`,
    "",
    "vielen Dank für Ihre Anfrage bei Heimlogik. Wir haben Ihre Angaben erhalten und melden uns zeitnah mit einer realistischen Einschätzung.",
    "",
    `Gewünschte Leistung: ${data.service}`,
    `Ort / PLZ: ${data.location}`,
    "",
    "Viele Grüße",
    "Heimlogik",
  ].join("\n");
}

function adminEmailHtml(data: ContactData) {
  return emailShell({
    eyebrow: "Neue Website-Anfrage",
    title: "Neue Smart-Home-Anfrage",
    intro: `Eine neue Anfrage ist über das Formular eingegangen. Direkt antworten geht über die Reply-To-Adresse von ${escapeHtml(data.email)}.`,
    content: `
      ${detailTable(data)}
      <div style="margin-top:24px;padding:18px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#64748b;letter-spacing:.04em;margin-bottom:8px;">Nachricht</div>
        <div style="font-size:15px;line-height:1.7;color:#0f172a;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
      </div>
    `,
  });
}

function customerEmailHtml(data: ContactData) {
  return emailShell({
    eyebrow: "Anfrage erhalten",
    title: `Danke, ${escapeHtml(data.name)}.`,
    intro:
      "Ihre Anfrage ist bei Heimlogik angekommen. Wir prüfen Ihre Angaben und melden uns zeitnah mit einer realistischen Einschätzung für die nächsten Schritte.",
    content: `
      <div style="margin:26px 0;padding:18px;border-radius:8px;background:#ecfdf5;border:1px solid #bbf7d0;">
        <div style="font-size:13px;font-weight:700;color:#064e3b;margin-bottom:8px;">Ihr Projekt auf einen Blick</div>
        <div style="font-size:15px;line-height:1.7;color:#0f172a;">
          <strong>Leistung:</strong> ${escapeHtml(data.service)}<br>
          <strong>Immobilie:</strong> ${escapeHtml(data.propertyType)}<br>
          <strong>Ort:</strong> ${escapeHtml(data.location)}
        </div>
      </div>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#334155;">
        Falls noch Rückfragen offen sind, melden wir uns telefonisch oder per E-Mail. Sie müssen im Moment nichts weiter vorbereiten.
      </p>
      <a href="${absoluteUrl("/kontakt")}" style="display:inline-block;margin-top:8px;padding:13px 18px;border-radius:8px;background:#22c55e;color:#0b1220;text-decoration:none;font-weight:700;font-size:14px;">
        Kontakt ansehen
      </a>
    `,
  });
}

function detailTable(data: ContactData) {
  const rows = fieldLabels
    .map(([key, label]) => {
      const value = data[key] || "-";
      return `
        <tr>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:190px;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(String(value))}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
      ${rows}
    </table>
  `;
}

function emailShell({
  eyebrow,
  title,
  intro,
  content,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  content: string;
}) {
  return `
    <!doctype html>
    <html lang="de">
      <body style="margin:0;background:#f8fafc;font-family:Inter,Arial,sans-serif;color:#0f172a;">
        <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(intro)}</div>
        <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;background:#f8fafc;padding:32px 14px;">
          <tr>
            <td align="center">
              <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:26px 28px;background:#0b1220;color:#ffffff;">
                    <div style="font-size:13px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(eyebrow)}</div>
                    <div style="margin-top:10px;font-size:28px;line-height:1.2;font-weight:800;">${title}</div>
                    <div style="margin-top:12px;font-size:15px;line-height:1.7;color:#cbd5e1;">${escapeHtml(intro)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    ${content}
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:13px;line-height:1.6;">
                    ${siteConfig.companyName} · ${siteConfig.email} · ${siteConfig.phone}<br>
                    Smart Home Planung & Installation in ${siteConfig.serviceRadius}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
