"use client";

import { useState } from "react";

type CustomerFormValues = {
  customer_type?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  company_name?: string | null;
  contact_person?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  customer_status?: string | null;
  lead_source?: string | null;
  notes?: string | null;
  street?: string | null;
  house_number?: string | null;
  postal_code?: string | null;
  city?: string | null;
};

type CustomerCreateFormProps = {
  action?: string;
  initialValues?: CustomerFormValues;
  submitLabel?: string;
};

const inputClass = "min-h-11 min-w-0 rounded-md border border-slate-200 px-3";
const selectClass = "min-h-11 min-w-0 rounded-md border border-slate-200 bg-white px-3 font-normal";

export function CustomerCreateForm({ action = "/api/dashboard/customers", initialValues, submitLabel = "Kunde speichern" }: CustomerCreateFormProps) {
  const [customerType, setCustomerType] = useState(initialValues?.customer_type === "business" ? "business" : "private");
  const isBusiness = customerType === "business";

  return (
    <form action={action} method="post" className="mt-5 grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Kundentyp
          <select name="customer_type" value={customerType} onChange={(event) => setCustomerType(event.target.value)} className={selectClass}>
            <option value="private">Privatkunde</option>
            <option value="business">Gewerbekunde</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Status
          <select name="customer_status" defaultValue={initialValues?.customer_status ?? "lead"} className={selectClass}>
            <option value="lead">Lead</option>
            <option value="first_contact">Erstkontakt</option>
            <option value="qualified">Qualifiziert</option>
            <option value="active">Aktiv</option>
            <option value="care">Betreuung</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Leadquelle
          <select name="lead_source" defaultValue={initialValues?.lead_source ?? "website"} className={selectClass}>
            <option value="website">Website</option>
            <option value="google_ads">Google Ads</option>
            <option value="referral">Empfehlung</option>
            <option value="partner">Partner</option>
            <option value="electrician">Elektriker</option>
            <option value="existing_customer">Bestand</option>
            <option value="other">Sonstiges</option>
          </select>
        </label>
      </div>

      <div className={`grid gap-4 ${isBusiness ? "md:grid-cols-2" : "md:grid-cols-2"}`}>
        {isBusiness ? (
          <>
            <input name="company_name" required defaultValue={initialValues?.company_name ?? ""} placeholder="Firmenname" className={inputClass} />
            <input name="contact_person" defaultValue={initialValues?.contact_person ?? ""} placeholder="Ansprechpartner" className={inputClass} />
          </>
        ) : (
          <>
            <input name="first_name" defaultValue={initialValues?.first_name ?? ""} placeholder="Vorname" className={inputClass} />
            <input name="last_name" defaultValue={initialValues?.last_name ?? ""} placeholder="Nachname" className={inputClass} />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input name="email" type="email" defaultValue={initialValues?.email ?? ""} placeholder="E-Mail" className={inputClass} />
        <input name="phone" defaultValue={initialValues?.phone ?? ""} placeholder="Telefon" className={inputClass} />
        <input name="mobile" defaultValue={initialValues?.mobile ?? ""} placeholder="Mobil" className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.4fr_0.6fr_0.7fr_1fr]">
        <input name="street" defaultValue={initialValues?.street ?? ""} placeholder="Straße" className={inputClass} />
        <input name="house_number" defaultValue={initialValues?.house_number ?? ""} placeholder="Nr." className={inputClass} />
        <input name="postal_code" defaultValue={initialValues?.postal_code ?? ""} placeholder="PLZ" className={inputClass} />
        <input name="city" defaultValue={initialValues?.city ?? ""} placeholder="Ort" className={inputClass} />
      </div>

      <textarea name="notes" defaultValue={initialValues?.notes ?? ""} placeholder="Notizen" className="min-h-24 rounded-md border border-slate-200 px-3 py-2" />

      <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
        {submitLabel}
      </button>
    </form>
  );
}
