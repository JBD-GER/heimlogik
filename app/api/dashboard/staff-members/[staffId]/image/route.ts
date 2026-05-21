import { NextResponse } from "next/server";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ staffId: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  await requireDashboardUser();
  const { staffId } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: staff } = await supabase
    .from("staff_members")
    .select("image_storage_bucket, image_storage_path")
    .eq("id", staffId)
    .maybeSingle<{ image_storage_bucket: string | null; image_storage_path: string | null }>();

  if (!staff?.image_storage_bucket || !staff.image_storage_path) {
    return new NextResponse("Bild wurde nicht gefunden.", { status: 404 });
  }

  const { data, error } = await supabase.storage.from(staff.image_storage_bucket).download(staff.image_storage_path);
  if (error || !data) {
    return new NextResponse(error?.message ?? "Bild konnte nicht geladen werden.", { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": data.type || "application/octet-stream",
      "Cache-Control": "private, max-age=300",
    },
  });
}

