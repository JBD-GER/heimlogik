import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/dashboard";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAdminEmail(user.email)) {
    redirect(nextPath);
  }

  return (
    <section className="section-pad bg-white">
      <div className="container-page grid min-h-[62vh] items-center">
        <div className="mx-auto w-full max-w-md rounded-md border border-slate-200 bg-paper p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">Heimlogik Admin</p>
          <h1 className="mt-3 text-3xl font-bold tracking-normal text-ink">Einloggen</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Zugang nur für freigegebene Admin-E-Mail-Adressen. Bei der ersten Registrierung sendet Supabase eine Bestätigungsmail.
          </p>
          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </section>
  );
}
