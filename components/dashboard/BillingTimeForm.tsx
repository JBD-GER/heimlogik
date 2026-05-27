"use client";

import { useMemo, useState } from "react";
import { Clock3, Play } from "lucide-react";
import { formatHours } from "@/lib/dashboard/billing";
import { fullStaffName, staffTitleLabel } from "@/lib/dashboard/team";

type StaffRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
};

function durationFromInputs(dateValue: string, startTime: string, endTime: string) {
  if (!dateValue || !startTime || !endTime) return 0;
  const start = new Date(`${dateValue}T${startTime}`);
  const end = new Date(`${dateValue}T${endTime}`);
  const ms = end.getTime() - start.getTime();
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.round((ms / 3_600_000) * 100) / 100;
}

export function BillingTimeForm({
  action,
  startDate,
  endDate,
  staffMembers,
  todayDate,
}: {
  action: string;
  startDate: string;
  endDate: string;
  staffMembers: StaffRow[];
  todayDate: string;
}) {
  const [manualMode, setManualMode] = useState(false);
  const [freeOfCharge, setFreeOfCharge] = useState(false);
  const [partnerRate, setPartnerRate] = useState(false);
  const [entryDate, setEntryDate] = useState(todayDate);
  const [manualStartTime, setManualStartTime] = useState("09:00");
  const [manualEndTime, setManualEndTime] = useState("10:00");
  const manualHours = useMemo(() => durationFromInputs(entryDate, manualStartTime, manualEndTime), [entryDate, manualStartTime, manualEndTime]);
  const hourlyRate = freeOfCharge ? "0,00" : partnerRate ? "190,00" : "210,00";

  return (
    <form action={action} method="post" className="mt-5 grid gap-4">
      <input type="hidden" name="_intent" value="start_time" />
      <input type="hidden" name="time_mode" value={manualMode ? "manual" : "live"} />
      <input type="hidden" name="free_of_charge" value={freeOfCharge ? "on" : ""} />
      <input type="hidden" name="partner_rate" value={partnerRate ? "on" : ""} />
      <input type="hidden" name="start_date" value={startDate} />
      <input type="hidden" name="end_date" value={endDate} />

      <div className="flex flex-wrap gap-3">
        <label className="flex w-fit items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-ink">
          <input type="checkbox" checked={manualMode} onChange={(event) => setManualMode(event.target.checked)} className="h-4 w-4 accent-ink" />
          Stunden nachreichen
        </label>
        <label className="flex w-fit items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-ink">
          <input
            type="checkbox"
            checked={freeOfCharge}
            onChange={(event) => {
              setFreeOfCharge(event.target.checked);
              if (event.target.checked) setPartnerRate(false);
            }}
            className="h-4 w-4 accent-ink"
          />
          Kostenlos
        </label>
        <label className="flex w-fit items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-ink">
          <input
            type="checkbox"
            checked={partnerRate}
            onChange={(event) => {
              setPartnerRate(event.target.checked);
              if (event.target.checked) setFreeOfCharge(false);
            }}
            className="h-4 w-4 accent-ink"
          />
          Partnersatz
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Mitarbeiter
          <select name="staff_member_id" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal">
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
          <input name="title" required placeholder="z.B. KNX Parametrierung" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Stundensatz netto
          <input
            name="hourly_rate_net"
            inputMode="decimal"
            value={hourlyRate}
            readOnly
            className="min-h-11 rounded-md border border-slate-200 bg-slate-100 px-3 font-normal text-slate-700"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink md:col-span-2">
          Beschreibung / geplant
          <input name="description" placeholder="Was wird gemacht?" className="min-h-11 rounded-md border border-slate-200 px-3 font-normal" />
        </label>
      </div>

      {manualMode ? (
        <div className="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Datum
            <input type="date" name="manual_date" value={entryDate} onChange={(event) => setEntryDate(event.target.value)} required className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Von
            <input type="time" name="manual_start_time" value={manualStartTime} onChange={(event) => setManualStartTime(event.target.value)} required className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Bis
            <input type="time" name="manual_end_time" value={manualEndTime} onChange={(event) => setManualEndTime(event.target.value)} required className="min-h-11 rounded-md border border-slate-200 bg-white px-3 font-normal" />
          </label>
          <div className="rounded-md bg-white p-3">
            <p className="text-xs font-bold uppercase text-slate-500">Gesamtstunden</p>
            <p className="mt-1 text-lg font-bold text-ink">{formatHours(manualHours)} h</p>
          </div>
        </div>
      ) : null}

      <button className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 md:w-fit">
        {manualMode ? <Clock3 className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        {manualMode ? "Stunden speichern" : "Start"}
      </button>
    </form>
  );
}
