import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { professionalPartnerAreaOptions } from "@/lib/dashboard/team";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function safeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function partnerArea(value: FormDataEntryValue | null) {
  const area = optionalText(value) ?? "sonstiges";
  return professionalPartnerAreaOptions.some((option) => option.value === area) ? area : "sonstiges";
}

export async function POST(request: Request) {
  const user = await requireDashboardUser();
  const formData = await request.formData();
  const companyName = optionalText(formData.get("company_name"));

  if (!companyName) {
    return errorResponse("Firmenname ist ein Pflichtfeld.");
  }

  const supabase = createSupabaseAdminClient();
  const partnerId = randomUUID();
  const logo = formData.get("logo");
  let logoStorageBucket: string | null = null;
  let logoStoragePath: string | null = null;

  if (logo instanceof File && logo.size > 0) {
    const fileName = safeFileName(logo.name) || `fachpartner-${partnerId}`;
    const storagePath = `team/partners/${partnerId}/${randomUUID()}-${fileName}`;
    const buffer = Buffer.from(await logo.arrayBuffer());
    const { error } = await supabase.storage.from("project-files").upload(storagePath, buffer, {
      contentType: logo.type || "application/octet-stream",
      upsert: false,
    });

    if (error) {
      return errorResponse(error.message);
    }

    logoStorageBucket = "project-files";
    logoStoragePath = storagePath;
  }

  const { error } = await supabase.from("professional_partners").insert({
    id: partnerId,
    company_name: companyName,
    area: partnerArea(formData.get("area")),
    street: optionalText(formData.get("street")),
    house_number: optionalText(formData.get("house_number")),
    postal_code: optionalText(formData.get("postal_code")),
    city: optionalText(formData.get("city")),
    country: optionalText(formData.get("country")) ?? "Deutschland",
    phone: optionalText(formData.get("phone")),
    email: optionalText(formData.get("email")),
    website: optionalText(formData.get("website")),
    logo_storage_bucket: logoStorageBucket,
    logo_storage_path: logoStoragePath,
    created_by: user.id,
  });

  if (error) {
    if (logoStorageBucket && logoStoragePath) {
      await supabase.storage.from(logoStorageBucket).remove([logoStoragePath]);
    }
    return errorResponse(error.message);
  }

  revalidatePath("/dashboard/fachpartner");
  return NextResponse.redirect(new URL("/dashboard/fachpartner", request.url), 303);
}
