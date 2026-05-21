import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomerCreateForm } from "@/components/dashboard/CustomerCreateForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { customerName } from "@/lib/dashboard/format";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

export default async function EditCustomerPage({ params }: PageProps) {
  const { customerId } = await params;
  const { customer, addresses } = await getCustomerContext(customerId);

  if (!customer) notFound();

  const primaryAddress = addresses.find((address) => address.address_type === "primary");

  return (
    <div className="grid gap-6">
      <PageHeader
        eyebrow="Kunde"
        title="Kunde bearbeiten"
        description={customerName(customer)}
        action={
          <Link href={`/dashboard/kunden/${customerId}`} className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Zurück zur Übersicht
          </Link>
        }
      />

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <CustomerCreateForm
          action={`/api/dashboard/customers/${customerId}`}
          submitLabel="Änderungen speichern"
          initialValues={{
            customer_type: customer.customer_type,
            first_name: customer.first_name,
            last_name: customer.last_name,
            company_name: customer.company_name,
            contact_person: customer.contact_person,
            email: customer.email,
            phone: customer.phone,
            mobile: customer.mobile,
            customer_status: customer.customer_status,
            lead_source: customer.lead_source,
            notes: customer.notes,
            street: primaryAddress?.street,
            house_number: primaryAddress?.house_number,
            postal_code: primaryAddress?.postal_code,
            city: primaryAddress?.city,
          }}
        />
      </section>
    </div>
  );
}
