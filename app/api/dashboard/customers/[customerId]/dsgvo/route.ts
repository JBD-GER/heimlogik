import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { renderHeimlogikPdf } from "@/lib/dashboard/document-pdf";
import { customerName } from "@/lib/dashboard/format";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ customerId: string }>;
};

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function assertSignature(value: FormDataEntryValue | null) {
  const signature = String(value ?? "");
  if (!signature.startsWith("data:image/png;base64,")) {
    return null;
  }

  return signature;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function addressLines(address?: { street: string; house_number: string | null; postal_code: string; city: string; country: string }) {
  if (!address) return [];
  return [
    [address.street, address.house_number].filter(Boolean).join(" "),
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.country,
  ].filter(Boolean);
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const user = await requireDashboardUser();
    const { customerId } = await params;
    const formData = await request.formData();
    const signatureDataUrl = assertSignature(formData.get("signature_data"));

    if (!signatureDataUrl) {
      return errorResponse("Bitte zuerst im Unterschriftsfeld unterschreiben.");
    }

    const { customer, addresses } = await getCustomerContext(customerId);
    if (!customer) {
      return errorResponse("Kunde wurde nicht gefunden.", 404);
    }

    const signedAt = new Date();
    const primaryAddress = addresses.find((address) => address.address_type === "primary");
    const displayName = customerName(customer);
    const fileName = `DSGVO-Einwilligung-${slugify(displayName) || customerId}-${signedAt.toISOString().slice(0, 10)}.pdf`;
    const storagePath = `customers/${customerId}/dsgvo/${randomUUID()}-${fileName}`;
    const fileBuffer = await renderHeimlogikPdf({
      meta: {
        title: "Einwilligung zur Datenverarbeitung",
        subtitle: "Kundenbezogene DSGVO-Unterlage für Beratung, Planung, Installation, Dokumentation und Betreuung durch Heimlogik.",
        documentType: "DSGVO-Einwilligung",
        reference: `Kunde ${displayName}`,
        createdAt: signedAt,
      },
      party: {
        label: "Kunde",
        name: displayName,
        lines: [
          ...addressLines(primaryAddress),
          customer.email ? `E-Mail: ${customer.email}` : "",
          customer.phone || customer.mobile ? `Telefon: ${customer.phone ?? customer.mobile}` : "",
        ].filter(Boolean),
      },
      sections: [
        {
          title: "Zweck der Verarbeitung",
          body: "Ich willige ein, dass Heimlogik meine Kontakt-, Objekt-, Projekt- und Kommunikationsdaten verarbeitet, soweit dies für Beratung, Planung, Angebotserstellung, Smart-Home-Installation, Dokumentation, Betreuung und Support erforderlich ist.",
        },
        {
          title: "Datenarten",
          body: "Verarbeitet werden können insbesondere Name, Anschrift, E-Mail-Adresse, Telefonnummer, Objektinformationen, Projektangaben, Grundrisse, Fotos, technische Dokumentationen, Diagnosedaten, Angebote, Rechnungen und Supportverlauf.",
        },
        {
          title: "Datei- und Projektdokumentation",
          body: "Ich bin damit einverstanden, dass projektbezogene Dateien wie Grundrisse, Bilder, technische Planungen, Dokumentationen und Abnahmeunterlagen intern gespeichert und dem jeweiligen Kunden- oder Projektvorgang zugeordnet werden.",
        },
        {
          title: "Kommunikation",
          body: "Heimlogik darf mich für projektbezogene Abstimmungen per E-Mail, Telefon oder sonstigen vereinbarten Kommunikationswegen kontaktieren.",
        },
        {
          title: "Widerruf",
          body: "Diese Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt davon unberührt.",
        },
      ],
      signature: {
        name: displayName,
        signedAt,
        dataUrl: signatureDataUrl,
      },
    });
    const supabase = createSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage.from("project-files").upload(storagePath, fileBuffer, {
      contentType: "application/pdf",
      upsert: false,
    });

    if (uploadError) {
      return errorResponse(uploadError.message);
    }

    const { error: fileError } = await supabase.from("files").insert({
      customer_id: customerId,
      file_name: fileName,
      mime_type: "application/pdf",
      file_size_bytes: fileBuffer.byteLength,
      category: "other",
      storage_bucket: "project-files",
      storage_path: storagePath,
      uploaded_by: user.id,
    });

    if (fileError) {
      return errorResponse(fileError.message);
    }

    await supabase.from("activity_logs").insert({
      customer_id: customerId,
      activity_type: "file_uploaded",
      title: "DSGVO-Einwilligung unterschrieben",
      description: fileName,
      created_by: user.id,
    });

    revalidatePath(`/dashboard/kunden/${customerId}`);
    revalidatePath(`/dashboard/kunden/${customerId}/dsgvo`);

    return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}`, request.url), 303);
  } catch (error) {
    const message = error instanceof Error ? error.message : "DSGVO-PDF konnte nicht erzeugt werden.";
    return errorResponse(message, 500);
  }
}
