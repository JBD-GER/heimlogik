import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

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
  const contactEmail = process.env.CONTACT_EMAIL;

  const lines = [
    `Name: ${data.name}`,
    `Telefon: ${data.phone}`,
    `E-Mail: ${data.email}`,
    `Ort / PLZ: ${data.location}`,
    `Immobilientyp: ${data.propertyType}`,
    `Leistung: ${data.service}`,
    `Räume: ${data.rooms || "-"}`,
    `Heizkörper: ${data.radiators || "-"}`,
    `Thermostate vorhanden: ${data.thermostatsPresent || "-"}`,
    `Gewünschtes System: ${data.preferredSystem || "-"}`,
    `WLAN-Probleme: ${data.wifiIssues || "-"}`,
    "",
    data.message,
  ];

  if (resendApiKey && contactEmail) {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: "Heimlogik Website <onboarding@resend.dev>",
      to: contactEmail,
      subject: `Neue Smart-Home-Anfrage von ${data.name}`,
      text: lines.join("\n"),
      replyTo: data.email,
    });
  } else {
    console.info("Neue Heimlogik Kontaktanfrage", data);
  }

  return NextResponse.json({
    message:
      resendApiKey && contactEmail
        ? "Vielen Dank. Ihre Anfrage wurde gesendet."
        : "Vielen Dank. Ihre Anfrage wurde im Demo-Modus angenommen.",
  });
}
