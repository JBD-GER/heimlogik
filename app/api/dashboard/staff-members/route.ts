import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
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

export async function POST(request: Request) {
  const user = await requireDashboardUser();
  const formData = await request.formData();
  const firstName = optionalText(formData.get("first_name"));
  const lastName = optionalText(formData.get("last_name"));

  if (!firstName || !lastName) {
    return errorResponse("Vorname und Nachname sind Pflichtfelder.");
  }

  const supabase = createSupabaseAdminClient();
  const staffId = randomUUID();
  const image = formData.get("image");
  let imageStorageBucket: string | null = null;
  let imageStoragePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const fileName = safeFileName(image.name) || `mitarbeiter-${staffId}`;
    const storagePath = `team/staff/${staffId}/${randomUUID()}-${fileName}`;
    const buffer = Buffer.from(await image.arrayBuffer());
    const { error } = await supabase.storage.from("project-files").upload(storagePath, buffer, {
      contentType: image.type || "application/octet-stream",
      upsert: false,
    });

    if (error) {
      return errorResponse(error.message);
    }

    imageStorageBucket = "project-files";
    imageStoragePath = storagePath;
  }

  const { error } = await supabase.from("staff_members").insert({
    id: staffId,
    first_name: firstName,
    last_name: lastName,
    email: optionalText(formData.get("email")),
    phone: optionalText(formData.get("phone")),
    title: String(formData.get("title") ?? "techniker"),
    image_storage_bucket: imageStorageBucket,
    image_storage_path: imageStoragePath,
    created_by: user.id,
  });

  if (error) {
    if (imageStorageBucket && imageStoragePath) {
      await supabase.storage.from(imageStorageBucket).remove([imageStoragePath]);
    }
    return errorResponse(error.message);
  }

  revalidatePath("/dashboard/mitarbeiter");
  return NextResponse.redirect(new URL("/dashboard/mitarbeiter", request.url), 303);
}

