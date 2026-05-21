import { notFound } from "next/navigation";
import { getCustomerContext } from "@/lib/dashboard/customer-data";

type CustomerDetailLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ customerId: string }>;
};

export default async function CustomerDetailLayout({ children, params }: CustomerDetailLayoutProps) {
  const { customerId } = await params;
  const { customer } = await getCustomerContext(customerId);

  if (!customer) {
    notFound();
  }

  return children;
}
