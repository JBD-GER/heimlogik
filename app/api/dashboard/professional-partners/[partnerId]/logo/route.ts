import { NextResponse } from "next/server";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ partnerId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  await requireDashboardUser();
  const { partnerId } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: partner } = await supabase
    .from("professional_partners")
    .select("logo_storage_bucket, logo_storage_path")
    .eq("id", partnerId)
    .maybeSingle<{ logo_storage_bucket: string | null; logo_storage_path: string | null }>();

  if (!partner?.logo_storage_bucket || !partner.logo_storage_path) {
    return new NextResponse("Logo wurde nicht gefunden.", { status: 404 });
  }

  const { data, error } = await supabase.storage.from(partner.logo_storage_bucket).download(partner.logo_storage_path);
  if (error || !data) {
    return new NextResponse(error?.message ?? "Logo konnte nicht geladen werden.", { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": data.type || "application/octet-stream",
      "Cache-Control": "private, max-age=300",
    },
  });
}

