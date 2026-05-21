"use server";

import { redirect } from "next/navigation";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

export async function createCustomer(formData: FormData) {
  const user = await requireDashboardUser();
  const supabase = createSupabaseAdminClient();

  const customerType = String(formData.get("customer_type") ?? "private");
  const leadSource = String(formData.get("lead_source") ?? "website");
  const customerStatus = String(formData.get("customer_status") ?? "lead");

  const { data: customer, error } = await supabase
    .from("customers")
    .insert({
      customer_type: customerType === "business" ? "business" : "private",
      first_name: customerType === "business" ? null : optionalText(formData.get("first_name")),
      last_name: customerType === "business" ? null : optionalText(formData.get("last_name")),
      company_name: customerType === "business" ? optionalText(formData.get("company_name")) : null,
      contact_person: customerType === "business" ? optionalText(formData.get("contact_person")) : null,
      email: optionalText(formData.get("email")),
      phone: optionalText(formData.get("phone")),
      mobile: optionalText(formData.get("mobile")),
      notes: optionalText(formData.get("notes")),
      lead_source: leadSource,
      customer_status: customerStatus,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !customer) {
    throw new Error(error?.message ?? "Kunde konnte nicht angelegt werden.");
  }

  const street = optionalText(formData.get("street"));
  const postalCode = optionalText(formData.get("postal_code"));
  const city = optionalText(formData.get("city"));

  if (street && postalCode && city) {
    await supabase.from("customer_addresses").insert({
      customer_id: customer.id,
      address_type: "primary",
      street,
      house_number: optionalText(formData.get("house_number")),
      postal_code: postalCode,
      city,
      country: "Deutschland",
    });
  }

  await supabase.from("activity_logs").insert({
    customer_id: customer.id,
    activity_type: "note",
    title: "Kunde angelegt",
    description: "Der Kunde wurde im Heimlogik Dashboard angelegt.",
    created_by: user.id,
  });

  redirect(`/dashboard/kunden/${customer.id}`);
}
