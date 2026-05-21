import { notFound } from "next/navigation";
import { getProjectContext } from "@/lib/dashboard/customer-data";

type ProjectLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ customerId: string; projectId: string }>;
};

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { customerId, projectId } = await params;
  const { customer, project } = await getProjectContext(customerId, projectId);

  if (!customer || !project) {
    notFound();
  }

  return children;
}
