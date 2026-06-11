import "server-only";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffSession = {
  user: {
    id: string;
    email?: string | null;
  };
  staffMember: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    title: string | null;
  };
};

export async function findActiveStaffMemberByEmail(email?: string | null) {
  if (!email) return null;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("staff_members")
    .select("id, first_name, last_name, email, title")
    .ilike("email", email.trim())
    .eq("is_active", true)
    .maybeSingle<StaffSession["staffMember"]>();

  return data ?? null;
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const staffMember = await findActiveStaffMemberByEmail(user.email);
  if (!staffMember) return null;

  const admin = createSupabaseAdminClient();
  await admin.from("profiles").upsert({
    id: user.id,
    full_name: [staffMember.first_name, staffMember.last_name].filter(Boolean).join(" ") || user.email,
    role: isAdminEmail(user.email) ? "admin" : "technician",
    is_active: true,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    staffMember,
  };
}

export async function requireStaffSession() {
  const session = await getStaffSession();
  if (!session) {
    redirect("/admin/login?next=/stunden");
  }
  return session;
}
