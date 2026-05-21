import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin-auth";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { customerName } from "@/lib/dashboard/format";
import { labelFor } from "@/lib/dashboard/labels";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { customerId, projectId } = await params;
  const { customer, project } = await getProjectContext(customerId, projectId);

  if (!customer || !project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    name: project.project_name,
    status: labelFor(project.project_status),
    customerName: customerName(customer),
  });
}
