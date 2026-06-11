import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { fullStaffName } from "@/lib/dashboard/team";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ staffId: string }>;
};

function redirectWithMessage(request: Request, status: "success" | "error", message: string) {
  const url = new URL("/dashboard/mitarbeiter", request.url);
  url.searchParams.set("invite_status", status);
  url.searchParams.set("invite_message", message);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request, { params }: RouteContext) {
  await requireDashboardUser();
  const { staffId } = await params;
  const supabase = createSupabaseAdminClient();
  const { data: staff, error } = await supabase
    .from("staff_members")
    .select("first_name, last_name, email, is_active")
    .eq("id", staffId)
    .maybeSingle<{ first_name: string; last_name: string; email: string | null; is_active: boolean }>();

  if (error || !staff) {
    return redirectWithMessage(request, "error", error?.message ?? "Mitarbeiter wurde nicht gefunden.");
  }

  if (!staff.is_active) {
    return redirectWithMessage(request, "error", "Dieser Mitarbeiter ist nicht aktiv.");
  }

  if (!staff.email) {
    return redirectWithMessage(request, "error", "Für diesen Mitarbeiter ist keine E-Mail hinterlegt.");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(staff.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/stunden`,
  });

  if (inviteError) {
    return redirectWithMessage(request, "error", inviteError.message);
  }

  revalidatePath("/dashboard/mitarbeiter");
  return redirectWithMessage(request, "success", `Einladung an ${fullStaffName(staff)} wurde verschickt.`);
}
