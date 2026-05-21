import Link from "next/link";
import { BedDouble, Calculator, Clock3, Euro, Play, ReceiptText, Square } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { berlinDateEndExclusiveIso, berlinDateStartIso, dateInputInBerlin, durationHours, formatHours, monthRange } from "@/lib/dashboard/billing";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/dashboard/format";
import { fullStaffName, staffTitleLabel } from "@/lib/dashboard/team";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = {
  params: Promise<{ customerId: string; projectId: string }>;
  searchParams?: Promise<{ tab?: string; von?: string; bis?: string }>;
};

type StaffRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
};

type TimeEntryRow = {
  id: string;
  title: string;
  description: string | null;
  started_at: string;
  stopped_at: string | null;
  hourly_rate_net: number | null;
  billable: boolean;
  billed_at: string | null;
  invoice_id: string | null;
  staff_members?: StaffRow | null;
};

type ExpenseEntryRow = {
  id: string;
  title: string;
  description: string | null;
  expense_at: string;
  amount_net: number | null;
  tax_rate: number | null;
  billable: boolean;
  billed_at: string | null;
  invoice_id: string | null;
  staff_members?: StaffRow | null;
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
  billable: boolean;
  billed_at: string | null;
  invoice_id: string | null;
  staff_members?: StaffRow | null;
};

const tabs = [
  { value: "stunden", label: "Stunden", icon: Clock3 },
  { value: "spesen", label: "Spesen", icon: ReceiptText },
  { value: "unterkunft", label: "Unterkunft", icon: BedDouble },
];

function isUnbilled(entry: { billed_at: string | null; invoice_id: string | null; billable: boolean }) {
  return entry.billable && !entry.billed_at && !entry.invoice_id;
}

function netAmount(value?: number | null) {
  return Number(value ?? 0);
}

function pageUrl(customerId: string, projectId: string, tab: string, startDate: string, endDate: string) {
  return `/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung?tab=${tab}&von=${startDate}&bis=${endDate}`;
}

function StaffSelect({ staffMembers }: { staffMembers: StaffRow[] }) {
  return (
    <select name="staff_member_id" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
      <option value="">Mitarbeiter wählen</option>
      {staffMembers.map((staff) => (
        <option key={staff.id} value={staff.id}>
          {fullStaffName(staff)} · {staffTitleLabel(staff.title)}
        </option>
      ))}
    </select>
  );
}

function EntryStatus({ entry }: { entry: { stopped_at?: string | null; billed_at: string | null; invoice_id: string | null; billable: boolean } }) {
  if (!entry.billable) return <StatusBadge value="inactive" />;
  if (entry.billed_at || entry.invoice_id) return <StatusBadge value="paid" />;
  if ("stopped_at" in entry && !entry.stopped_at) return <StatusBadge value="in_progress" />;
  return <StatusBadge value="open" />;
}

export default async function ProjectBillingPage({ params, searchParams }: PageProps) {
  const { customerId, projectId } = await params;
  const query = (await searchParams) ?? {};
  const activeTab = tabs.some((tab) => tab.value === query.tab) ? query.tab ?? "stunden" : "stunden";
  const currentMonth = monthRange(0);
  const startDate = query.von ?? currentMonth.startDate;
  const endDate = query.bis ?? currentMonth.endDate;
  const fromIso = berlinDateStartIso(startDate);
  const untilIso = berlinDateEndExclusiveIso(endDate);
  const billingApiPath = `/api/dashboard/customers/${customerId}/projects/${projectId}/billing`;
  const supabase = createSupabaseAdminClient();

  const [staffResult, timeResult, openTimeResult, expensesResult, accommodationsResult] = await Promise.all([
    supabase.from("staff_members").select("id, first_name, last_name, title").eq("is_active", true).order("last_name", { ascending: true }),
    supabase
      .from("time_entries")
      .select("id, title, description, started_at, stopped_at, hourly_rate_net, billable, billed_at, invoice_id, staff_members(id, first_name, last_name, title)")
      .eq("project_id", projectId)
      .gte("started_at", fromIso)
      .lt("started_at", untilIso)
      .order("started_at", { ascending: false }),
    supabase
      .from("time_entries")
      .select("id, title, description, started_at, stopped_at, hourly_rate_net, billable, billed_at, invoice_id, staff_members(id, first_name, last_name, title)")
      .eq("project_id", projectId)
      .is("stopped_at", null)
      .is("billed_at", null)
      .order("started_at", { ascending: false }),
    supabase
      .from("expense_entries")
      .select("id, title, description, expense_at, amount_net, tax_rate, billable, billed_at, invoice_id, staff_members(id, first_name, last_name, title)")
      .eq("project_id", projectId)
      .gte("expense_at", fromIso)
      .lt("expense_at", untilIso)
      .order("expense_at", { ascending: false }),
    supabase
      .from("accommodation_entries")
      .select("id, provider, location, notes, check_in_at, check_out_at, nights, amount_net, tax_rate, billable, billed_at, invoice_id, staff_members(id, first_name, last_name, title)")
      .eq("project_id", projectId)
      .gte("check_in_at", fromIso)
      .lt("check_in_at", untilIso)
      .order("check_in_at", { ascending: false }),
  ]);

  const migrationMissing = Boolean(timeResult.error || openTimeResult.error || expensesResult.error || accommodationsResult.error);
  const staffMembers = (staffResult.data ?? []) as unknown as StaffRow[];
  const timeEntries = Array.from(new Map([...(openTimeResult.data ?? []), ...(timeResult.data ?? [])].map((entry) => [entry.id, entry])).values()) as unknown as TimeEntryRow[];
  const expenseEntries = (expensesResult.data ?? []) as unknown as ExpenseEntryRow[];
  const accommodationEntries = (accommodationsResult.data ?? []) as unknown as AccommodationEntryRow[];
  const unbilledTimeEntries = timeEntries.filter((entry) => entry.stopped_at && isUnbilled(entry));
  const unbilledExpenseEntries = expenseEntries.filter(isUnbilled);
  const unbilledAccommodationEntries = accommodationEntries.filter(isUnbilled);
  const unbilledHours = unbilledTimeEntries.reduce((sum, entry) => sum + durationHours(entry.started_at, entry.stopped_at), 0);
  const unbilledTimeNet = unbilledTimeEntries.reduce((sum, entry) => sum + durationHours(entry.started_at, entry.stopped_at) * netAmount(entry.hourly_rate_net ?? 120), 0);
  const unbilledExpenseNet = unbilledExpenseEntries.reduce((sum, entry) => sum + netAmount(entry.amount_net), 0);
  const unbilledAccommodationNet = unbilledAccommodationEntries.reduce((sum, entry) => sum + netAmount(entry.amount_net), 0);
  const unbilledNetTotal = unbilledTimeNet + unbilledExpenseNet + unbilledAccommodationNet;
  const shortcuts = [monthRange(0), monthRange(-1), monthRange(-2), monthRange(-3)];

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Projekt"
        title="Abrechnung"
        description="Stunden, Spesen und Unterkünfte erfassen, nach Zeitraum auswerten und nur nicht abgerechnete Einträge in eine Rechnung übernehmen."
      />

      {migrationMissing ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
          Die Abrechnungstabellen fehlen noch. Bitte die Migration <strong>supabase/time_tracking_and_billing.sql</strong> in Supabase ausführen.
        </section>
      ) : null}

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <form action={`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <input type="hidden" name="tab" value={activeTab} />
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Von
              <input type="date" name="von" defaultValue={startDate} className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              Bis
              <input type="date" name="bis" defaultValue={endDate} className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
            </label>
            <button className="focus-ring inline-flex min-h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-bold text-ink hover:bg-slate-50">
              Zeitraum anzeigen
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {shortcuts.map((shortcut) => (
              <Link
                key={`${shortcut.startDate}-${shortcut.endDate}`}
                href={pageUrl(customerId, projectId, activeTab, shortcut.startDate, shortcut.endDate)}
                className="focus-ring rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                {shortcut.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Offene Stunden</p>
            <p className="mt-2 text-2xl font-bold text-ink">{formatHours(unbilledHours)} h</p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Stunden netto</p>
            <p className="mt-2 text-2xl font-bold text-ink">{formatCurrency(unbilledTimeNet)}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Spesen / Unterkunft</p>
            <p className="mt-2 text-2xl font-bold text-ink">{formatCurrency(unbilledExpenseNet + unbilledAccommodationNet)}</p>
          </div>
          <div className="rounded-md bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase text-green-700">Abrechenbar netto</p>
            <p className="mt-2 text-2xl font-bold text-ink">{formatCurrency(unbilledNetTotal)}</p>
          </div>
        </div>
        <form action={billingApiPath} method="post" className="flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
          <input type="hidden" name="_intent" value="create_invoice" />
          <input type="hidden" name="start_date" value={startDate} />
          <input type="hidden" name="end_date" value={endDate} />
          <p className="text-sm leading-6 text-slate-600">
            Rechnung wird aus nicht abgerechneten Stunden, Spesen und Unterkünften im Zeitraum {formatDate(fromIso)} bis {formatDate(berlinDateStartIso(endDate))} erstellt.
          </p>
          <button className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white hover:bg-slate-800">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Rechnung erstellen
          </button>
        </form>
      </section>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const href = pageUrl(customerId, projectId, tab.value, startDate, endDate);
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
            <div className="flex items-center gap-3">
              <Play className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-xl font-bold text-ink">Stundenerfassung starten</h2>
            </div>
            <form action={billingApiPath} method="post" className="mt-5 grid gap-4">
              <input type="hidden" name="_intent" value="start_time" />
              <input type="hidden" name="start_date" value={startDate} />
              <input type="hidden" name="end_date" value={endDate} />
              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Mitarbeiter
                  <StaffSelect staffMembers={staffMembers} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
                  Tätigkeit
                  <input name="title" required placeholder="z.B. KNX Parametrierung" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Stundensatz netto
                  <input name="hourly_rate_net" inputMode="decimal" defaultValue="120,00" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
                  Beschreibung / geplant
                  <input name="description" placeholder="Was wird gemacht?" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
              </div>
              <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                <Play className="h-4 w-4" aria-hidden="true" />
                Start
              </button>
            </form>
          </section>

          {timeEntries.length === 0 ? (
            <EmptyState title="Noch keine Stunden im Zeitraum" description="Starte oben den ersten Zeiteintrag. Offene Zeiten bleiben sichtbar, bis sie gestoppt werden." />
          ) : (
            <div className="grid gap-3">
              {timeEntries.map((entry) => {
                const hours = durationHours(entry.started_at, entry.stopped_at);
                return (
                  <article key={entry.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <EntryStatus entry={entry} />
                          <span className="text-sm font-semibold text-slate-500">{fullStaffName(entry.staff_members ?? {})}</span>
                        </div>
                        <h2 className="mt-3 text-xl font-bold text-ink">{entry.title}</h2>
                        <p className="mt-2 text-sm text-slate-600">
                          {formatDateTime(entry.started_at)} bis {entry.stopped_at ? formatDateTime(entry.stopped_at) : "läuft"}
                        </p>
                        {entry.description ? <p className="mt-3 text-sm leading-6 text-slate-700">{entry.description}</p> : null}
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:min-w-80">
                        <div className="rounded-md bg-slate-50 p-3">
                          <p className="text-xs font-bold uppercase text-slate-500">Dauer</p>
                          <p className="mt-1 text-lg font-bold text-ink">{entry.stopped_at ? `${formatHours(hours)} h` : "läuft"}</p>
                        </div>
                        <div className="rounded-md bg-slate-50 p-3">
                          <p className="text-xs font-bold uppercase text-slate-500">Netto</p>
                          <p className="mt-1 text-lg font-bold text-ink">{formatCurrency(hours * netAmount(entry.hourly_rate_net ?? 120))}</p>
                        </div>
                        {!entry.stopped_at ? (
                          <form action={billingApiPath} method="post" className="sm:col-span-2">
                            <input type="hidden" name="_intent" value="stop_time" />
                            <input type="hidden" name="time_entry_id" value={entry.id} />
                            <input type="hidden" name="start_date" value={startDate} />
                            <input type="hidden" name="end_date" value={endDate} />
                            <button className="focus-ring inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50">
                              <Square className="h-4 w-4" aria-hidden="true" />
                              Stoppen
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {activeTab === "spesen" ? (
        <div className="grid gap-5">
          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Euro className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-xl font-bold text-ink">Spesen erfassen</h2>
            </div>
            <form action={billingApiPath} method="post" className="mt-5 grid gap-4">
              <input type="hidden" name="_intent" value="add_expense" />
              <input type="hidden" name="start_date" value={startDate} />
              <input type="hidden" name="end_date" value={endDate} />
              <div className="grid gap-4 md:grid-cols-4">
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Mitarbeiter
                  <StaffSelect staffMembers={staffMembers} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Datum
                  <input type="date" name="expense_date" defaultValue={dateInputInBerlin()} required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Netto
                  <input name="amount_net" inputMode="decimal" placeholder="0,00" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  MwSt %
                  <input name="tax_rate" inputMode="decimal" defaultValue="19" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
                  Titel
                  <input name="title" required placeholder="z.B. Parkticket, Materialfahrt, Verpflegung" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
                  Beschreibung
                  <input name="description" placeholder="Optionaler Hinweis" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
              </div>
              <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                Spesen speichern
              </button>
            </form>
          </section>

          {expenseEntries.length === 0 ? (
            <EmptyState title="Keine Spesen im Zeitraum" description="Spesen werden mit Datum gespeichert und später mit dem Zeitraum in die Rechnung gezogen." />
          ) : (
            <div className="grid gap-3">
              {expenseEntries.map((entry) => (
                <article key={entry.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <EntryStatus entry={entry} />
                        <span className="text-sm font-semibold text-slate-500">{formatDate(entry.expense_at)} · {fullStaffName(entry.staff_members ?? {})}</span>
                      </div>
                      <h2 className="mt-3 text-xl font-bold text-ink">{entry.title}</h2>
                      {entry.description ? <p className="mt-2 text-sm leading-6 text-slate-700">{entry.description}</p> : null}
                    </div>
                    <p className="text-xl font-bold text-ink">{formatCurrency(entry.amount_net)}</p>
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
            <div className="flex items-center gap-3">
              <BedDouble className="h-5 w-5 text-accent" aria-hidden="true" />
              <h2 className="text-xl font-bold text-ink">Unterkunft erfassen</h2>
            </div>
            <form action={billingApiPath} method="post" className="mt-5 grid gap-4">
              <input type="hidden" name="_intent" value="add_accommodation" />
              <input type="hidden" name="start_date" value={startDate} />
              <input type="hidden" name="end_date" value={endDate} />
              <div className="grid gap-4 md:grid-cols-4">
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Mitarbeiter
                  <StaffSelect staffMembers={staffMembers} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Unterkunft
                  <input name="provider" required placeholder="Hotel / Pension" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Ort
                  <input name="location" placeholder="z.B. Leese" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Nächte
                  <input name="nights" inputMode="decimal" defaultValue="1" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
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
                  Gesamt netto
                  <input name="amount_net" inputMode="decimal" placeholder="0,00" required className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  MwSt %
                  <input name="tax_rate" inputMode="decimal" defaultValue="19" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-4">
                  Notiz
                  <input name="notes" placeholder="Optionaler Hinweis zur Unterkunft" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
                </label>
              </div>
              <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
                Unterkunft speichern
              </button>
            </form>
          </section>

          {accommodationEntries.length === 0 ? (
            <EmptyState title="Keine Unterkünfte im Zeitraum" description="Unterkünfte werden mit Anreisedatum gespeichert und später mit dem Zeitraum in die Rechnung gezogen." />
          ) : (
            <div className="grid gap-3">
              {accommodationEntries.map((entry) => (
                <article key={entry.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <EntryStatus entry={entry} />
                        <span className="text-sm font-semibold text-slate-500">{formatDate(entry.check_in_at)} · {fullStaffName(entry.staff_members ?? {})}</span>
                      </div>
                      <h2 className="mt-3 text-xl font-bold text-ink">{entry.provider}</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        {entry.location ?? "Ort offen"} · {formatHours(netAmount(entry.nights ?? 1))} Nächte
                      </p>
                      {entry.notes ? <p className="mt-2 text-sm leading-6 text-slate-700">{entry.notes}</p> : null}
                    </div>
                    <p className="text-xl font-bold text-ink">{formatCurrency(entry.amount_net)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
