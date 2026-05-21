import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { getCustomerContext, getCustomerFiles } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ customerId: string }>;
};

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

async function updateCustomer(request: Request, customerId: string, formData: FormData) {
  await requireDashboardUser();
  const supabase = createSupabaseAdminClient();
  const customerType = String(formData.get("customer_type") ?? "private");
  const normalizedCustomerType = customerType === "business" ? "business" : "private";

  const { customer, addresses } = await getCustomerContext(customerId);
  if (!customer) {
    return errorResponse("Kunde wurde nicht gefunden.", 404);
  }

  const { error } = await supabase
    .from("customers")
    .update({
      customer_type: normalizedCustomerType,
      first_name: normalizedCustomerType === "business" ? null : optionalText(formData.get("first_name")),
      last_name: normalizedCustomerType === "business" ? null : optionalText(formData.get("last_name")),
      company_name: normalizedCustomerType === "business" ? optionalText(formData.get("company_name")) : null,
      contact_person: normalizedCustomerType === "business" ? optionalText(formData.get("contact_person")) : null,
      email: optionalText(formData.get("email")),
      phone: optionalText(formData.get("phone")),
      mobile: optionalText(formData.get("mobile")),
      notes: optionalText(formData.get("notes")),
      lead_source: String(formData.get("lead_source") ?? "website"),
      customer_status: String(formData.get("customer_status") ?? "lead"),
    })
    .eq("id", customerId);

  if (error) {
    return errorResponse(error.message);
  }

  const street = optionalText(formData.get("street"));
  const postalCode = optionalText(formData.get("postal_code"));
  const city = optionalText(formData.get("city"));
  const primaryAddress = addresses.find((address) => address.address_type === "primary");

  if (street && postalCode && city) {
    const addressPayload = {
      customer_id: customerId,
      address_type: "primary",
      street,
      house_number: optionalText(formData.get("house_number")),
      postal_code: postalCode,
      city,
      country: "Deutschland",
    };

    if (primaryAddress) {
      const { error: addressError } = await supabase.from("customer_addresses").update(addressPayload).eq("id", primaryAddress.id);
      if (addressError) return errorResponse(addressError.message);
    } else {
      const { error: addressError } = await supabase.from("customer_addresses").insert(addressPayload);
      if (addressError) return errorResponse(addressError.message);
    }
  } else if (primaryAddress) {
    const { error: addressError } = await supabase.from("customer_addresses").delete().eq("id", primaryAddress.id);
    if (addressError) return errorResponse(addressError.message);
  }

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    activity_type: "note",
    title: "Kunde aktualisiert",
    description: "Die Kundendaten wurden bearbeitet.",
  });

  revalidatePath("/dashboard/kunden");
  revalidatePath(`/dashboard/kunden/${customerId}`);

  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}`, request.url), 303);
}

async function deleteCustomer(request: Request, customerId: string) {
  await requireDashboardUser();
  const supabase = createSupabaseAdminClient();
  const files = await getCustomerFiles(customerId);
  const pathsByBucket = files.reduce<Record<string, string[]>>((buckets, file) => {
    buckets[file.storage_bucket] ??= [];
    buckets[file.storage_bucket].push(file.storage_path);
    return buckets;
  }, {});

  for (const [bucket, paths] of Object.entries(pathsByBucket)) {
    if (paths.length) {
      await supabase.storage.from(bucket).remove(paths);
    }
  }

  const { error } = await supabase.from("customers").delete().eq("id", customerId);
  if (error) {
    return errorResponse(error.message);
  }

  revalidatePath("/dashboard/kunden");

  return NextResponse.redirect(new URL("/dashboard/kunden", request.url), 303);
}

export async function POST(request: Request, { params }: RouteContext) {
  const { customerId } = await params;
  const formData = await request.formData();
  const intent = String(formData.get("_intent") ?? "update");

  if (intent === "delete") {
    return deleteCustomer(request, customerId);
  }

  return updateCustomer(request, customerId, formData);
}
