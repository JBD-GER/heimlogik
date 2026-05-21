"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthState = {
  message?: string;
  status?: "error" | "success";
};

export async function authenticate(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const mode = String(formData.get("mode") ?? "login");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    return { status: "error", message: "Bitte E-Mail und Passwort ausfüllen." };
  }

  if (!isAdminEmail(email)) {
    return { status: "error", message: "Diese E-Mail ist nicht für das Admin-Dashboard freigegeben." };
  }

  const supabase = await createSupabaseServerClient();

  if (mode === "signup") {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      return { status: "error", message: error.message };
    }

    return {
      status: "success",
      message: "Bestätigungsmail ist raus. Danach kannst du dich hier einloggen.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: error.message };
  }

  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
