import "server-only";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireDashboardUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?next=/dashboard");
  }

  if (!isAdminEmail(user.email)) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const admin = createSupabaseAdminClient();
  await admin.from("profiles").upsert({
    id: user.id,
    full_name: user.email ?? "Heimlogik Admin",
    role: "admin",
    is_active: true,
  });

  return user;
}
