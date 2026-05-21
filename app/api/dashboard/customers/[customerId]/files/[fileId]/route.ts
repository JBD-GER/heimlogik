import { NextResponse } from "next/server";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ customerId: string; fileId: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  await requireDashboardUser();
  const { customerId, fileId } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: file, error } = await supabase
    .from("files")
    .select("id, customer_id, file_name, mime_type, storage_bucket, storage_path")
    .eq("id", fileId)
    .eq("customer_id", customerId)
    .single();

  if (error || !file) {
    return new NextResponse("Datei wurde nicht gefunden.", { status: 404 });
  }

  const { data, error: downloadError } = await supabase.storage.from(file.storage_bucket).download(file.storage_path);

  if (downloadError || !data) {
    return new NextResponse("Datei konnte nicht geladen werden.", { status: 404 });
  }

  const arrayBuffer = await data.arrayBuffer();
  const fileName = encodeURIComponent(file.file_name);
  const disposition = new URL(request.url).searchParams.get("inline") === "1" ? "inline" : "attachment";

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": file.mime_type ?? "application/octet-stream",
      "Content-Disposition": `${disposition}; filename*=UTF-8''${fileName}`,
      "Cache-Control": "private, no-store",
    },
  });
}
