"use client";

import { useMemo, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { billingHourlyRateNet, formatHours, standardHourlyRateNet } from "@/lib/dashboard/billing";
import { fullStaffName, staffTitleLabel } from "@/lib/dashboard/team";

type StaffRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
};

type TimeEntryEditorRow = {
  id: string;
  title: string;
  description: string | null;
  started_at: string;
  stopped_at: string | null;
  hourly_rate_net: number | null;
  billed_at: string | null;
  invoice_id: string | null;
  staff_members?: StaffRow | null;
};

function berlinInputParts(value?: string | null) {
  if (!value) return { date: "", time: "" };
  const parts = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    time: `${part("hour")}:${part("minute")}`,
  };
}

function durationFromInputs(dateValue: string, startTime: string, endTime: string) {
  if (!dateValue || !startTime || !endTime) return 0;
  const start = new Date(`${dateValue}T${startTime}`);
  const end = new Date(`${dateValue}T${endTime}`);
  const ms = end.getTime() - start.getTime();
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.round((ms / 3_600_000) * 100) / 100;
}

function rateMode(hourlyRateNet?: number | null) {
  if (billingHourlyRateNet(hourlyRateNet) === 0) return "free";
  return "default";
}

export function BillingTimeEntryEditor({
  action,
  startDate,
  endDate,
  entry,
  staffMembers,
}: {
  action: string;
  startDate: string;
  endDate: string;
  entry: TimeEntryEditorRow;
  staffMembers: StaffRow[];
}) {
  const started = berlinInputParts(entry.started_at);
  const stopped = berlinInputParts(entry.stopped_at);
  const [entryDate, setEntryDate] = useState(started.date);
  const [startTime, setStartTime] = useState(started.time);
  const [endTime, setEndTime] = useState(stopped.time);
  const [freeOfCharge, setFreeOfCharge] = useState(rateMode(entry.hourly_rate_net) === "free");
  const canChange = !entry.billed_at && !entry.invoice_id;
  const hours = useMemo(() => durationFromInputs(entryDate, startTime, endTime), [entryDate, startTime, endTime]);
  const hourlyRate = freeOfCharge ? "0,00" : `${standardHourlyRateNet},00`;

  if (!canChange) return null;

  return (
    <details className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
      <summary className="cursor-pointer text-sm font-bold text-ink">Stunden bearbeiten</summary>
      <form action={action} method="post" className="mt-4 grid gap-4">
        <input type="hidden" name="_intent" value="update_time" />
        <input type="hidden" name="time_entry_id" value={entry.id} />
        <input type="hidden" name="start_date" value={startDate} />
        <input type="hidden" name="end_date" value={endDate} />
        <input type="hidden" name="free_of_charge" value={freeOfCharge ? "on" : ""} />

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Mitarbeiter
            <select name="staff_member_id" defaultValue={entry.staff_members?.id ?? ""} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
              <option value="">Mitarbeiter wählen</option>
              {staffMembers.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {fullStaffName(staff)} · {staffTitleLabel(staff.title)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
            Tätigkeit
            <input name="title" required defaultValue={entry.title} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Datum
            <input type="date" name="manual_date" value={entryDate} onChange={(event) => setEntryDate(event.target.value)} required className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Von
            <input type="time" name="manual_start_time" value={startTime} onChange={(event) => setStartTime(event.target.value)} required className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Bis
            <input type="time" name="manual_end_time" value={endTime} onChange={(event) => setEndTime(event.target.value)} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Stundensatz netto
            <input name="hourly_rate_net" value={hourlyRate} readOnly className="min-h-11 rounded-md border border-slate-200 bg-slate-100 px-3 font-normal text-slate-700" />
          </label>
          <div className="rounded-md bg-white p-3">
            <p className="text-xs font-bold uppercase text-slate-500">Gesamtstunden</p>
            <p className="mt-1 text-lg font-bold text-ink">{endTime ? `${formatHours(hours)} h` : "läuft"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex w-fit items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-ink">
            <input
              type="checkbox"
              checked={freeOfCharge}
              onChange={(event) => setFreeOfCharge(event.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            Kostenlos
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-ink">
          Beschreibung
          <textarea name="description" defaultValue={entry.description ?? ""} rows={3} className="rounded-md border border-slate-200 bg-white px-3 py-2 font-normal" />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button className="focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400">
            <Save className="h-4 w-4" aria-hidden="true" />
            Speichern
          </button>
        </div>
      </form>
      <form action={action} method="post" className="mt-3">
        <input type="hidden" name="_intent" value="delete_time" />
        <input type="hidden" name="time_entry_id" value={entry.id} />
        <input type="hidden" name="start_date" value={startDate} />
        <input type="hidden" name="end_date" value={endDate} />
        <button className="focus-ring inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 text-sm font-bold text-red-700 hover:bg-red-50 sm:w-fit">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Stunden löschen
        </button>
      </form>
    </details>
  );
}
