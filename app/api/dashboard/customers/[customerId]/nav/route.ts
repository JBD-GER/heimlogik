import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin-auth";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { customerName } from "@/lib/dashboard/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ customerId: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { customerId } = await params;
  const { customer, projects } = await getCustomerContext(customerId);

  if (!customer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    name: customerName(customer),
    email: customer.email,
    status: customer.customer_status,
    careEnabled: projects.some((project) => ["care", "completed"].includes(project.project_status)),
  });
}
