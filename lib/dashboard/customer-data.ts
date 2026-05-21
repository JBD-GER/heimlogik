import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CustomerDetail = {
  id: string;
  customer_type: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  notes: string | null;
  lead_source: string;
  customer_status: string;
  created_at: string;
  updated_at: string;
};

export type CustomerAddress = {
  id: string;
  address_type: string;
  street: string;
  house_number: string | null;
  postal_code: string;
  city: string;
  country: string;
  notes: string | null;
};

export type PropertyRow = {
  id: string;
  property_name: string;
  street: string | null;
  house_number: string | null;
  postal_code: string | null;
  city: string | null;
  building_type: string;
  construction_phase: string;
  living_area_sqm: number | null;
  floors_count: number | null;
  rooms_count: number | null;
  has_technical_room: boolean;
  has_network: boolean;
  has_knx: boolean;
  has_dali: boolean;
  has_free_at_home: boolean;
  has_home_assistant: boolean;
  wifi_coverage_known: boolean;
  notes: string | null;
};

export type ProjectRow = {
  id: string;
  property_id: string;
  project_name: string;
  description: string | null;
  project_status: string;
  priority: string;
  next_step: string | null;
  offer_value: number | null;
  rough_budget: number | null;
  planned_start_at: string | null;
  planned_end_at: string | null;
  actual_start_at: string | null;
  actual_end_at: string | null;
  responsible_profile_id: string | null;
  customer_requests: string | null;
  risks: string | null;
  internal_notes: string | null;
  updated_at: string;
};

export type DocumentCategoryRow = {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  is_default: boolean;
  sort_order: number;
};

export type ProjectFileRow = {
  id: string;
  file_name: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  category: string;
  storage_bucket: string;
  storage_path: string;
  document_category_id: string | null;
  notes: string | null;
  created_at: string;
  project_document_categories?: {
    name: string | null;
    slug: string | null;
  } | null;
};

export async function getCustomerContext(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const [customerResult, addressesResult, propertiesResult] = await Promise.all([
    supabase.from("customers").select("*").eq("id", customerId).single(),
    supabase.from("customer_addresses").select("*").eq("customer_id", customerId).order("address_type", { ascending: true }),
    supabase.from("properties").select("*").eq("customer_id", customerId).order("created_at", { ascending: false }),
  ]);

  const customer = customerResult.data as CustomerDetail | null;
  const addresses = (addressesResult.data ?? []) as CustomerAddress[];
  const properties = (propertiesResult.data ?? []) as PropertyRow[];
  const propertyIds = properties.map((property) => property.id);

  const projectsResult = propertyIds.length
    ? await supabase.from("projects").select("*").in("property_id", propertyIds).order("updated_at", { ascending: false })
    : { data: [], error: null };

  const projects = (projectsResult.data ?? []) as ProjectRow[];
  const projectIds = projects.map((project) => project.id);

  return {
    customer,
    addresses,
    properties,
    projects,
    propertyIds,
    projectIds,
    error: customerResult.error ?? addressesResult.error ?? propertiesResult.error ?? projectsResult.error,
  };
}

export async function getProjectContext(customerId: string, projectId: string) {
  const context = await getCustomerContext(customerId);
  const project = context.projects.find((item) => item.id === projectId) ?? null;
  const property = project ? context.properties.find((item) => item.id === project.property_id) ?? null : null;
  return { ...context, project, property };
}

const defaultDocumentCategories = [
  ["Grundrisse", "grundrisse"],
  ["Elektroplanung", "elektroplanung"],
  ["Smart-Home-Planung", "smart-home-planung"],
  ["Netzwerk", "netzwerk"],
  ["KNX", "knx"],
  ["DALI", "dali"],
  ["Fotos", "fotos"],
  ["Abnahme", "abnahme"],
  ["Bedienungsanleitungen", "bedienungsanleitungen"],
  ["Sonstiges", "sonstiges"],
];

export async function ensureProjectDocumentCategories(projectId: string, userId?: string) {
  const supabase = createSupabaseAdminClient();
  const { data: existing, error } = await supabase
    .from("project_document_categories")
    .select("id, project_id, name, slug, is_default, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  if (existing?.length) {
    return existing as DocumentCategoryRow[];
  }

  const defaults = defaultDocumentCategories.map(([name, slug], index) => ({
    project_id: projectId,
    name,
    slug,
    is_default: true,
    sort_order: index,
    created_by: userId ?? null,
  }));

  const { data, error: insertError } = await supabase
    .from("project_document_categories")
    .insert(defaults)
    .select("id, project_id, name, slug, is_default, sort_order")
    .order("sort_order", { ascending: true });

  if (insertError) {
    throw insertError;
  }

  return (data ?? []) as DocumentCategoryRow[];
}

export async function getProjectFiles(projectId: string, documentCategorySlug?: string) {
  const supabase = createSupabaseAdminClient();
  const fullQuery = await supabase
    .from("files")
    .select("id, file_name, mime_type, file_size_bytes, category, storage_bucket, storage_path, document_category_id, notes, created_at, project_document_categories(name, slug)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  const result = fullQuery.error
    ? await supabase
        .from("files")
        .select("id, file_name, mime_type, file_size_bytes, category, storage_bucket, storage_path, created_at")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
    : fullQuery;

  const { data, error } = result;
  if (error) throw error;

  const rows = (data ?? []) as unknown as ProjectFileRow[];
  if (!documentCategorySlug) return rows;

  return rows.filter((row) => {
    if (row.project_document_categories?.slug === documentCategorySlug) return true;
    return row.storage_path.includes(`/documents/${documentCategorySlug}/`);
  });
}

export async function getCustomerFiles(customerId: string, category?: string) {
  const supabase = createSupabaseAdminClient();
  const { propertyIds, projectIds } = await getCustomerContext(customerId);
  const requests = [
    supabase.from("files").select("*").eq("customer_id", customerId),
    ...(propertyIds.length ? [supabase.from("files").select("*").in("property_id", propertyIds)] : []),
    ...(projectIds.length ? [supabase.from("files").select("*").in("project_id", projectIds)] : []),
  ].map((query) => (category ? query.eq("category", category) : query));

  const results = await Promise.all(requests);
  const rows = results.flatMap((result) => result.data ?? []) as Array<{
    id: string;
    file_name: string;
    mime_type: string | null;
    category: string;
    storage_bucket: string;
    storage_path: string;
    created_at: string;
  }>;

  return Array.from(new Map(rows.map((row) => [row.id, row])).values()).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getLatestCustomerDsgvoConsent(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("files")
    .select("id, file_name, mime_type, category, storage_bucket, storage_path, created_at")
    .eq("customer_id", customerId)
    .eq("mime_type", "application/pdf")
    .like("storage_path", `customers/${customerId}/dsgvo/%`)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) return null;

  return data?.[0] ?? null;
}
