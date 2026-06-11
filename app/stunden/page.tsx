import type { Metadata } from "next";
import Link from "next/link";
import { BedDouble, Clock3, Euro, LogOut, Play, ReceiptText, Square } from "lucide-react";
import { signOut } from "@/app/admin/login/actions";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { berlinDateEndExclusiveIso, berlinDateStartIso, dateInputInBerlin, durationHours, formatHours, monthRange } from "@/lib/dashboard/billing";
import { customerName, formatCurrency, formatDate, formatDateTime } from "@/lib/dashboard/format";
import { requireStaffSession } from "@/lib/dashboard/staff-auth";
import { fullStaffName } from "@/lib/dashboard/team";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Stunden",
  robots: { index: false, follow: false, nocache: true },
};

type PageProps = {
  searchParams?: Promise<{ projekt?: string; tab?: string; von?: string; bis?: string }>;
};

type ProjectRow = {
  id: string;
  project_name: string;
  project_status: string | null;
  properties?: {
    property_name: string | null;
    customers?: {
      customer_type?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      company_name?: string | null;
      contact_person?: string | null;
    } | null;
  } | null;
};

type AssignmentRow = {
  project_id: string;
  projects?: ProjectRow | null;
};

type TimeEntryRow = {
  id: string;
  title: string;
  description: string | null;
  started_at: string;
  stopped_at: string | null;
  billed_at: string | null;
  invoice_id: string | null;
};

type ExpenseEntryRow = {
  id: string;
  title: string;
  description: string | null;
  expense_at: string;
  amount_net: number | null;
  tax_rate: number | null;
  billed_at: string | null;
  invoice_id: string | null;
};

type AccommodationEntryRow = {
  id: string;
  provider: string;
  location: string | null;
  notes: string | null;
  check_in_at: string;
  check_out_at: string | null;
  nights: number | null;
  amount_net: number | null;
  tax_rate: number | null;
  billed_at: string | null;
  invoice_id: string | null;
};

const tabs = [
  { value: "stunden", label: "Stunden", icon: Clock3 },
  { value: "spesen", label: "Spesen", icon: ReceiptText },
  { value: "unterkunft", label: "Unterkunft", icon: BedDouble },
];

function projectLabel(project: ProjectRow) {
  const customer = project.properties?.customers;
  return [customer ? customerName(customer) : null, project.project_name].filter(Boolean).join(" · ");
}

function pageUrl(projectId: string, tab: string, startDate: string, endDate: string) {
  return `/stunden?projekt=${projectId}&tab=${tab}&von=${startDate}&bis=${endDate}`;
}

function HiddenContext({ projectId, startDate, endDate }: { projectId: string; startDate: string; endDate: string }) {
  return (
    <>
      <input type="hidden" name="project_id" value={projectId} />
      <input type="hidden" name="start_date" value={startDate} />
      <input type="hidden" name="end_date" value={endDate} />
    </>
  );
}

function EntryStatus({ billed_at, invoice_id, stopped_at }: { billed_at?: string | null; invoice_id?: string | null; stopped_at?: string | null }) {
  if (billed_at || invoice_id) return <StatusBadge value="paid" />;
  if (stopped_at === null) return <StatusBadge value="in_progress" />;
  return <StatusBadge value="open" />;
}

export default async function StaffHoursPage({ searchParams }: PageProps) {
  const session = await requireStaffSession();
  const query = (await searchParams) ?? {};
  const activeTab = tabs.some((tab) => tab.value === query.tab) ? query.tab ?? "stunden" : "stunden";
  const currentMonth = monthRange(0);
  const startDate = query.von ?? currentMonth.startDate;
  const endDate = query.bis ?? currentMonth.endDate;
  const fromIso = berlinDateStartIso(startDate);
  const untilIso = berlinDateEndExclusiveIso(endDate);
  const supabase = createSupabaseAdminClient();

  const assignmentsResult = await supabase
    .from("project_staff_members")
    .select("project_id, projects(id, project_name, project_status, properties(property_name, customers(customer_type, first_name, last_name, company_name, contact_person)))")
    .eq("staff_member_id", session.staffMember.id)
    .order("created_at", { ascending: false });

  const assignments = (assignmentsResult.data ?? []) as unknown as AssignmentRow[];
  const projects = assignments.map((assignment) => assignment.projects).filter(Boolean) as ProjectRow[];
  const selectedProject = projects.find((project) => project.id === query.projekt) ?? projects[0] ?? null;
  const selectedProjectId = selectedProject?.id ?? "";
  const shortcuts = [monthRange(0), monthRange(-1), monthRange(-2)];

  const [timeResult, openTimeResult, expensesResult, accommodationsResult] = selectedProjectId
    ? await Promise.all([
        supabase
          .from("time_entries")
          .select("id, title, description, started_at, stopped_at, billed_at, invoice_id")
          .eq("project_id", selectedProjectId)
          .eq("staff_member_id", session.staffMember.id)
          .gte("started_at", fromIso)
          .lt("started_at", untilIso)
          .order("started_at", { ascending: false }),
        supabase
          .from("time_entries")
          .select("id, title, description, started_at, stopped_at, billed_at, invoice_id")
          .eq("project_id", selectedProjectId)
          .eq("staff_member_id", session.staffMember.id)
          .is("stopped_at", null)
          .is("billed_at", null)
          .order("started_at", { ascending: false }),
        supabase
          .from("expense_entries")
          .select("id, title, description, expense_at, amount_net, tax_rate, billed_at, invoice_id")
          .eq("project_id", selectedProjectId)
          .eq("staff_member_id", session.staffMember.id)
          .gte("expense_at", fromIso)
          .lt("expense_at", untilIso)
          .order("expense_at", { ascending: false }),
        supabase
          .from("accommodation_entries")
          .select("id, provider, location, notes, check_in_at, check_out_at, nights, amount_net, tax_rate, billed_at, invoice_id")
          .eq("project_id", selectedProjectId)
          .eq("staff_member_id", session.staffMember.id)
          .gte("check_in_at", fromIso)
          .lt("check_in_at", untilIso)
          .order("check_in_at", { ascending: false }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const timeEntries = Array.from(new Map([...(openTimeResult.data ?? []), ...(timeResult.data ?? [])].map((entry) => [entry.id, entry])).values()) as unknown as TimeEntryRow[];
  const expenseEntries = (expensesResult.data ?? []) as unknown as ExpenseEntryRow[];
  const accommodationEntries = (accommodationsResult.data ?? []) as unknown as AccommodationEntryRow[];
  const trackedHours = timeEntries.reduce((sum, entry) => sum + durationHours(entry.started_at, entry.stopped_at), 0);

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-black text-ink">{siteConfig.companyName}</p>
            <p className="text-xs font-semibold text-slate-500">{fullStaffName(session.staffMember)}</p>
          </div>
          <form action={signOut}>
            <button className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-ink hover:bg-slate-50">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1180px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-2">
          <p className="text-sm font-semibold uppercase text-accent">Mitarbeiterbereich</p>
          <h1 className="text-3xl font-bold tracking-normal text-ink">Stunden</h1>
        </section>

        {assignmentsResult.error ? (
          <section className="rounded-md border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Projektzuweisungen konnten nicht geladen werden. Bitte Team-Migration prüfen.
          </section>
        ) : null}

        {projects.length === 0 ? (
          <EmptyState title="Keine Projekte zugewiesen" description="Du siehst hier Projekte, sobald du im Admin-Dashboard als Mitarbeiter hinterlegt bist." />
        ) : (
          <>
            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <form action="/stunden" className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end">
                <input type="hidden" name="tab" value={activeTab} />
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Projekt
                  <select name="projekt" defaultValue={selectedProjectId} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {projectLabel(project)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Von
                  <input type="date" name="von" defaultValue={startDate} className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Bis
                  <input type="date" name="bis" defaultValue={endDate} className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <button className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
                  Anzeigen
                </button>
              </form>
              {selectedProject ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {shortcuts.map((shortcut) => (
                    <Link key={shortcut.label} href={pageUrl(selectedProject.id, activeTab, shortcut.startDate, shortcut.endDate)} className="focus-ring rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                      {shortcut.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>

            {selectedProject ? (
              <>
                <section className="grid gap-3 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Projekt</p>
                    <p className="mt-1 font-bold text-ink">{selectedProject.project_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Zeitraum</p>
                    <p className="mt-1 font-bold text-ink">{formatDate(fromIso)} bis {formatDate(berlinDateStartIso(endDate))}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Erfasste Stunden</p>
                    <p className="mt-1 font-bold text-ink">{formatHours(trackedHours)} h</p>
                  </div>
                </section>

                <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const href = pageUrl(selectedProject.id, tab.value, startDate, endDate);
                    return (
                      <Link
                        key={tab.value}
                        href={href}
                        className={`focus-ring inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-bold ${activeTab === tab.value ? "bg-accent text-ink" : "bg-white text-slate-700 hover:bg-slate-100"}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {tab.label}
                      </Link>
                    );
                  })}
                </div>

                {activeTab === "stunden" ? (
                  <div className="grid gap-5">
                    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="text-xl font-bold text-ink">Stundenerfassung</h2>
                      <form action="/api/stunden" method="post" className="mt-5 grid gap-4 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
                        <input type="hidden" name="_intent" value="start_time" />
                        <HiddenContext projectId={selectedProject.id} startDate={startDate} endDate={endDate} />
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Tätigkeit
                          <input name="title" required placeholder="z.B. KNX Parametrierung" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Beschreibung
                          <input name="description" placeholder="Optionaler Hinweis" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <button className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
                          <Play className="h-4 w-4" aria-hidden="true" />
                          Start
                        </button>
                      </form>
                    </section>

                    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="text-xl font-bold text-ink">Stunden nachtragen</h2>
                      <form action="/api/stunden" method="post" className="mt-5 grid gap-4 md:grid-cols-5">
                        <input type="hidden" name="_intent" value="manual_time" />
                        <HiddenContext projectId={selectedProject.id} startDate={startDate} endDate={endDate} />
                        <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
                          Tätigkeit
                          <input name="title" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Datum
                          <input type="date" name="manual_date" defaultValue={dateInputInBerlin()} required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Von
                          <input type="time" name="manual_start_time" defaultValue="09:00" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Bis
                          <input type="time" name="manual_end_time" defaultValue="10:00" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-4">
                          Beschreibung
                          <input name="description" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <button className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
                          Speichern
                        </button>
                      </form>
                    </section>

                    {timeEntries.length === 0 ? (
                      <EmptyState title="Keine Stunden im Zeitraum" description="Starte eine Zeiterfassung oder trage Stunden nach." />
                    ) : (
                      <div className="grid gap-3">
                        {timeEntries.map((entry) => (
                          <article key={entry.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div>
                                <EntryStatus billed_at={entry.billed_at} invoice_id={entry.invoice_id} stopped_at={entry.stopped_at} />
                                <h2 className="mt-3 text-lg font-bold text-ink">{entry.title}</h2>
                                <p className="mt-2 text-sm text-slate-600">{formatDateTime(entry.started_at)} bis {entry.stopped_at ? formatDateTime(entry.stopped_at) : "läuft"}</p>
                                {entry.description ? <p className="mt-2 text-sm leading-6 text-slate-700">{entry.description}</p> : null}
                              </div>
                              <div className="grid gap-3 sm:min-w-56 sm:grid-cols-2">
                                <div className="rounded-md bg-slate-50 p-3">
                                  <p className="text-xs font-bold uppercase text-slate-500">Dauer</p>
                                  <p className="mt-1 text-lg font-bold text-ink">{entry.stopped_at ? `${formatHours(durationHours(entry.started_at, entry.stopped_at))} h` : "läuft"}</p>
                                </div>
                                {!entry.stopped_at ? (
                                  <form action="/api/stunden" method="post">
                                    <input type="hidden" name="_intent" value="stop_time" />
                                    <input type="hidden" name="time_entry_id" value={entry.id} />
                                    <HiddenContext projectId={selectedProject.id} startDate={startDate} endDate={endDate} />
                                    <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50">
                                      <Square className="h-4 w-4" aria-hidden="true" />
                                      Stoppen
                                    </button>
                                  </form>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {activeTab === "spesen" ? (
                  <div className="grid gap-5">
                    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="text-xl font-bold text-ink">Spesen erfassen</h2>
                      <form action="/api/stunden" method="post" className="mt-5 grid gap-4 md:grid-cols-4">
                        <input type="hidden" name="_intent" value="add_expense" />
                        <HiddenContext projectId={selectedProject.id} startDate={startDate} endDate={endDate} />
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Datum
                          <input type="date" name="expense_date" defaultValue={dateInputInBerlin()} required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Netto
                          <input name="amount_net" inputMode="decimal" required placeholder="0,00" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          MwSt %
                          <input name="tax_rate" inputMode="decimal" defaultValue="19" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Titel
                          <input name="title" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-4">
                          Beschreibung
                          <input name="description" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <button className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                          <Euro className="h-4 w-4" aria-hidden="true" />
                          Spesen speichern
                        </button>
                      </form>
                    </section>

                    {expenseEntries.length === 0 ? (
                      <EmptyState title="Keine Spesen im Zeitraum" description="Erfasse oben den ersten Speseneintrag." />
                    ) : (
                      <div className="grid gap-3">
                        {expenseEntries.map((entry) => (
                          <article key={entry.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <EntryStatus billed_at={entry.billed_at} invoice_id={entry.invoice_id} />
                                <h2 className="mt-3 text-lg font-bold text-ink">{entry.title}</h2>
                                <p className="mt-2 text-sm text-slate-600">{formatDate(entry.expense_at)}</p>
                                {entry.description ? <p className="mt-2 text-sm leading-6 text-slate-700">{entry.description}</p> : null}
                              </div>
                              <p className="text-lg font-bold text-ink">{formatCurrency(entry.amount_net)}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                {activeTab === "unterkunft" ? (
                  <div className="grid gap-5">
                    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                      <h2 className="text-xl font-bold text-ink">Unterkunft erfassen</h2>
                      <form action="/api/stunden" method="post" className="mt-5 grid gap-4 md:grid-cols-4">
                        <input type="hidden" name="_intent" value="add_accommodation" />
                        <HiddenContext projectId={selectedProject.id} startDate={startDate} endDate={endDate} />
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Unterkunft
                          <input name="provider" required placeholder="Hotel / Anbieter" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Ort
                          <input name="location" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Anreise
                          <input type="date" name="check_in_date" defaultValue={dateInputInBerlin()} required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Abreise
                          <input type="date" name="check_out_date" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Nächte
                          <input name="nights" inputMode="decimal" defaultValue="1" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          Netto gesamt
                          <input name="amount_net" inputMode="decimal" required placeholder="0,00" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink">
                          MwSt %
                          <input name="tax_rate" inputMode="decimal" defaultValue="19" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-4">
                          Notiz
                          <input name="notes" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                        </label>
                        <button className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                          Unterkunft speichern
                        </button>
                      </form>
                    </section>

                    {accommodationEntries.length === 0 ? (
                      <EmptyState title="Keine Unterkünfte im Zeitraum" description="Erfasse oben die erste Unterkunft." />
                    ) : (
                      <div className="grid gap-3">
                        {accommodationEntries.map((entry) => (
                          <article key={entry.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <EntryStatus billed_at={entry.billed_at} invoice_id={entry.invoice_id} />
                                <h2 className="mt-3 text-lg font-bold text-ink">{entry.provider}</h2>
                                <p className="mt-2 text-sm text-slate-600">
                                  {formatDate(entry.check_in_at)}{entry.check_out_at ? ` bis ${formatDate(entry.check_out_at)}` : ""} · {entry.nights ?? 1} Nacht/Nächte
                                </p>
                                {entry.location ? <p className="mt-2 text-sm text-slate-600">{entry.location}</p> : null}
                                {entry.notes ? <p className="mt-2 text-sm leading-6 text-slate-700">{entry.notes}</p> : null}
                              </div>
                              <p className="text-lg font-bold text-ink">{formatCurrency(entry.amount_net)}</p>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
