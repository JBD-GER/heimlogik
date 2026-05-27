"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { ensureProjectDocumentCategories, getProjectContext } from "@/lib/dashboard/customer-data";
import { normalizeUploadImageFile } from "@/lib/dashboard/image-files";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function safeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

function fileCategoryForSlug(slug: string) {
  if (slug.includes("grundriss")) return "floor_plan";
  if (slug.includes("foto") || slug.includes("bild")) return "photo";
  if (slug.includes("abnahme")) return "acceptance_protocol";
  return "documentation";
}

export async function createDocumentCategory(formData: FormData) {
  const user = await requireDashboardUser();
  const customerId = String(formData.get("customer_id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const name = optionalText(formData.get("name"));

  if (!customerId || !projectId || !name) {
    throw new Error("Kategorie-Name fehlt.");
  }

  const { project } = await getProjectContext(customerId, projectId);
  if (!project) {
    throw new Error("Projekt wurde nicht gefunden.");
  }

  const slug = slugify(name);
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("project_document_categories").upsert(
    {
      project_id: projectId,
      name,
      slug,
      is_default: false,
      sort_order: 100,
      created_by: user.id,
    },
    { onConflict: "project_id,slug" },
  );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/dokumentation`);
}

export async function uploadProjectDocument(formData: FormData) {
  const user = await requireDashboardUser();
  const customerId = String(formData.get("customer_id") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const categoryId = String(formData.get("document_category_id") ?? "");
  const file = formData.get("file");

  if (!customerId || !projectId || !categoryId) {
    throw new Error("Projekt und Kategorie sind Pflichtfelder.");
  }

  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Bitte eine Datei auswählen.");
  }

  const { project } = await getProjectContext(customerId, projectId);
  if (!project) {
    throw new Error("Projekt wurde nicht gefunden.");
  }

  const categories = await ensureProjectDocumentCategories(projectId, user.id);
  const category = categories.find((item) => item.id === categoryId);
  if (!category) {
    throw new Error("Kategorie wurde nicht gefunden.");
  }

  const supabase = createSupabaseAdminClient();
  const normalizedFile = await normalizeUploadImageFile(file);
  const fileName = safeFileName(normalizedFile.fileName) || `datei-${randomUUID()}`;
  const storagePath = `customers/${customerId}/projects/${projectId}/documents/${category.slug}/${randomUUID()}-${fileName}`;

  const { error: uploadError } = await supabase.storage.from("project-files").upload(storagePath, normalizedFile.buffer, {
    contentType: normalizedFile.mimeType,
    upsert: false,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const fileRecord = {
    customer_id: customerId,
    project_id: projectId,
    file_name: optionalText(formData.get("title")) ?? normalizedFile.fileName,
    mime_type: normalizedFile.mimeType,
    file_size_bytes: normalizedFile.size,
    category: fileCategoryForSlug(category.slug),
    storage_bucket: "project-files",
    storage_path: storagePath,
    document_category_id: category.id,
    notes: optionalText(formData.get("notes")),
    uploaded_by: user.id,
  };

  const { error } = await supabase.from("files").insert(fileRecord);

  if (error && (error.message.includes("document_category_id") || error.message.includes("notes"))) {
    const fallbackRecord: Record<string, unknown> = { ...fileRecord };
    const noteText = typeof fallbackRecord.notes === "string" ? fallbackRecord.notes : null;
    delete fallbackRecord.document_category_id;
    delete fallbackRecord.notes;
    const fallback = await supabase.from("files").insert(fallbackRecord);
    if (fallback.error) {
      throw new Error(fallback.error.message);
    }

    if (noteText) {
      await supabase.from("activity_logs").insert({
        customer_id: customerId,
        project_id: projectId,
        activity_type: "note",
        title: `Notiz zu ${file.name}`,
        description: noteText,
        created_by: user.id,
      });
    }
  } else if (error) {
    throw new Error(error.message);
  }

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    activity_type: "file_uploaded",
    title: "Dokument hochgeladen",
    description: `${file.name} in ${category.name}`,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/dokumentation`);
}
