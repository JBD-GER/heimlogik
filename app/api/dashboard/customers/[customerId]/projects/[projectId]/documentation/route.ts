import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { ensureProjectDocumentCategories, getProjectContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string }>;
};

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

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function documentationUrl(request: Request, customerId: string, projectId: string, categorySlug?: string) {
  const url = new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/dokumentation`, request.url);
  if (categorySlug) url.searchParams.set("kategorie", categorySlug);
  return url;
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await requireDashboardUser();
  const { customerId, projectId } = await params;
  const formData = await request.formData();
  const intent = String(formData.get("_intent") ?? "upload");
  const { project } = await getProjectContext(customerId, projectId);

  if (!project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  if (intent === "category") {
    const name = optionalText(formData.get("name"));
    if (!name) {
      return errorResponse("Kategorie-Name fehlt.");
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
      return errorResponse(error.message);
    }

    revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/dokumentation`);
    return NextResponse.redirect(documentationUrl(request, customerId, projectId, slug), 303);
  }

  const categoryId = String(formData.get("document_category_id") ?? "");
  const file = formData.get("file");

  if (!categoryId) {
    return errorResponse("Bitte eine Kategorie auswählen.");
  }

  if (!(file instanceof File) || file.size === 0) {
    return errorResponse("Bitte eine Datei auswählen.");
  }

  const categories = await ensureProjectDocumentCategories(projectId, user.id);
  const category = categories.find((item) => item.id === categoryId);

  if (!category) {
    return errorResponse("Kategorie wurde nicht gefunden.");
  }

  const supabase = createSupabaseAdminClient();
  const fileName = safeFileName(file.name) || `datei-${randomUUID()}`;
  const storagePath = `customers/${customerId}/projects/${projectId}/documents/${category.slug}/${randomUUID()}-${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage.from("project-files").upload(storagePath, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (uploadError) {
    return errorResponse(uploadError.message);
  }

  const fileRecord = {
    customer_id: customerId,
    project_id: projectId,
    file_name: optionalText(formData.get("title")) ?? file.name,
    mime_type: file.type || null,
    file_size_bytes: file.size,
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
      await supabase.storage.from("project-files").remove([storagePath]);
      return errorResponse(fallback.error.message);
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
    await supabase.storage.from("project-files").remove([storagePath]);
    return errorResponse(error.message);
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
  return NextResponse.redirect(documentationUrl(request, customerId, projectId, category.slug), 303);
}
