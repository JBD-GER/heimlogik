import type { Metadata } from "next";
import { Mail, Phone, UserRound } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { fullStaffName, staffTitleLabel, staffTitleOptions } from "@/lib/dashboard/team";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Mitarbeiter",
};

type StaffMemberRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  title: string;
  image_storage_path: string | null;
  is_active: boolean;
};

export default async function MitarbeiterPage() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("staff_members")
    .select("id, first_name, last_name, email, phone, title, image_storage_path, is_active")
    .order("created_at", { ascending: false });
  const staffMembers = (data ?? []) as StaffMemberRow[];

  return (
    <div className="grid gap-8">
      <PageHeader
        title="Mitarbeiter"
        description="Interne Ansprechpartner, Rollen, Kontaktdaten und Projektzuweisungen für Heimlogik."
        action={
          <a href="#mitarbeiter-hinzufuegen" className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
            Mitarbeiter hinzufügen
          </a>
        }
      />

      {error ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Die Mitarbeiter-Tabelle fehlt noch. Bitte die Migration <strong>supabase/team_and_partners.sql</strong> in Supabase ausführen.
        </section>
      ) : null}

      <section id="mitarbeiter-hinzufuegen" className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-ink">Mitarbeiter hinzufügen</h2>
        <form action="/api/dashboard/staff-members" method="post" encType="multipart/form-data" className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Vorname
              <input name="first_name" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Nachname
              <input name="last_name" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              E-Mail
              <input name="email" type="email" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Telefonnummer
              <input name="phone" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Titel
              <select name="title" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                {staffTitleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Bild
              <input name="image" type="file" accept="image/*" className="rounded-md border border-slate-200 bg-white px-3 py-2 font-normal" />
            </label>
          </div>
          <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
            Mitarbeiter speichern
          </button>
        </form>
      </section>

      {staffMembers.length === 0 && !error ? (
        <EmptyState title="Noch keine Mitarbeiter" description="Lege oben den ersten internen Ansprechpartner an." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {staffMembers.map((staff) => (
            <article key={staff.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100 text-slate-500">
                  {staff.image_storage_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/dashboard/staff-members/${staff.id}/image`} alt={fullStaffName(staff)} className="h-full w-full object-cover" />
                  ) : (
                    <UserRound className="h-7 w-7" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="truncate text-xl font-bold text-ink">{fullStaffName(staff)}</h2>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{staffTitleLabel(staff.title)}</p>
                    </div>
                    <StatusBadge value={staff.is_active ? "active" : "inactive"} />
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {staff.email ?? "Keine E-Mail"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {staff.phone ?? "Keine Telefonnummer"}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

