import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, Plus, Smartphone } from "lucide-react";
import { CustomerCreateForm } from "@/components/dashboard/CustomerCreateForm";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { customerName, formatDate } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Kunden",
};

type CustomerRow = {
  id: string;
  customer_type: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  customer_status: string;
  lead_source: string;
  created_at: string;
  customer_addresses?: Array<{
    address_type: string;
    street: string;
    house_number: string | null;
    postal_code: string;
    city: string;
  }>;
};

export default async function KundenPage() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id, customer_type, first_name, last_name, company_name, contact_person, email, phone, mobile, customer_status, lead_source, created_at, customer_addresses(address_type, street, house_number, postal_code, city)")
    .order("created_at", { ascending: false })
    .limit(100);

  const customers = (data ?? []) as CustomerRow[];

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Kunden"
        description="Auflistung aller Kunden mit Status, Kontaktwegen und Adresse."
        action={
          <a href="#kunde-hinzufuegen" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
            Kunde hinzufügen
          </a>
        }
      />

      <section id="kunde-hinzufuegen" className="order-3 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <Plus className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="text-xl font-bold text-ink">Kunde anlegen</h2>
        </div>
        <CustomerCreateForm />
      </section>

      {error ? (
        <EmptyState title="Kunden konnten nicht geladen werden" description={error.message} />
      ) : customers.length === 0 ? (
        <EmptyState title="Noch keine Kunden" description="Lege den ersten Kunden über das Formular an." />
      ) : (
        <div className="grid gap-4">
          {customers.map((customer) => {
            const primaryAddress = customer.customer_addresses?.find((address) => address.address_type === "primary");
            return (
              <Link key={customer.id} href={`/dashboard/kunden/${customer.id}`} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm hover:border-accent">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-ink">{customerName(customer)}</h2>
                      <StatusBadge value={customer.customer_status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {labelFor(customer.customer_type)} · {labelFor(customer.lead_source)} · angelegt am {formatDate(customer.created_at)}
                    </p>
                    {primaryAddress ? (
                      <p className="mt-2 text-sm text-slate-600">
                        {primaryAddress.street} {primaryAddress.house_number}, {primaryAddress.postal_code} {primaryAddress.city}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-2 text-sm text-slate-600 md:min-w-64">
                    {customer.email ? (
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        {customer.email}
                      </span>
                    ) : null}
                    {customer.phone ? (
                      <span className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        {customer.phone}
                      </span>
                    ) : null}
                    {customer.mobile ? (
                      <span className="inline-flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        {customer.mobile}
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
