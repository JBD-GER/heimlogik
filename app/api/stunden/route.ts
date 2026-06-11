import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { berlinDateTimeIso, standardHourlyRateNet } from "@/lib/dashboard/billing";
import { getStaffSession } from "@/lib/dashboard/staff-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function parseDecimal(value: FormDataEntryValue | null, fallback = 0) {
  const text = String(value ?? "").trim().replace(/\./g, "").replace(",", ".");
  const number = Number(text);
  return Number.isFinite(number) ? number : fallback;
}

function validTimeValue(value: string | null): value is string {
  return Boolean(value?.match(/^\d{2}:\d{2}$/));
}

function dateStartIso(dateValue: string) {
  return berlinDateTimeIso(dateValue, "00:00");
}

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function trackingUrl(request: Request, formData: FormData, tab = "stunden") {
  const url = new URL("/stunden", request.url);
  const projectId = optionalText(formData.get("project_id"));
  const startDate = optionalText(formData.get("start_date"));
  const endDate = optionalText(formData.get("end_date"));
  if (projectId) url.searchParams.set("projekt", projectId);
  if (tab) url.searchParams.set("tab", tab);
  if (startDate) url.searchParams.set("von", startDate);
  if (endDate) url.searchParams.set("bis", endDate);
  return url;
}

async function assertAssignedProject(projectId: string, staffMemberId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("project_staff_members")
    .select("project_id")
    .eq("project_id", projectId)
    .eq("staff_member_id", staffMemberId)
    .maybeSingle();

  if (error || !data) return false;
  return true;
}

export async function POST(request: Request) {
  const session = await getStaffSession();
  if (!session) return errorResponse("Bitte einloggen.", 401);

  const formData = await request.formData();
  const intent = String(formData.get("_intent") ?? "");
  const projectId = optionalText(formData.get("project_id"));
  if (!projectId) return errorResponse("Bitte Projekt auswählen.");

  const isAssigned = await assertAssignedProject(projectId, session.staffMember.id);
  if (!isAssigned) return errorResponse("Du bist diesem Projekt nicht zugewiesen.", 403);

  const supabase = createSupabaseAdminClient();

  if (intent === "start_time") {
    const title = optionalText(formData.get("title"));
    if (!title) return errorResponse("Bitte Tätigkeit eintragen.");

    const { error } = await supabase.from("time_entries").insert({
      project_id: projectId,
      staff_member_id: session.staffMember.id,
      title,
      description: optionalText(formData.get("description")),
      hourly_rate_net: standardHourlyRateNet,
      started_at: new Date().toISOString(),
      created_by: session.user.id,
    });

    if (error) return errorResponse(error.message);
    revalidatePath("/stunden");
    return NextResponse.redirect(trackingUrl(request, formData, "stunden"), 303);
  }

  if (intent === "manual_time") {
    const title = optionalText(formData.get("title"));
    const manualDate = optionalText(formData.get("manual_date"));
    const manualStartTime = optionalText(formData.get("manual_start_time"));
    const manualEndTime = optionalText(formData.get("manual_end_time"));

    if (!title) return errorResponse("Bitte Tätigkeit eintragen.");
    if (!manualDate || !validTimeValue(manualStartTime) || !validTimeValue(manualEndTime)) {
      return errorResponse("Bitte Datum, Von und Bis eintragen.");
    }

    const startedAt = berlinDateTimeIso(manualDate, manualStartTime);
    const stoppedAt = berlinDateTimeIso(manualDate, manualEndTime);
    if (new Date(stoppedAt).getTime() <= new Date(startedAt).getTime()) {
      return errorResponse("Die Bis-Uhrzeit muss nach der Von-Uhrzeit liegen.");
    }

    const { error } = await supabase.from("time_entries").insert({
      project_id: projectId,
      staff_member_id: session.staffMember.id,
      title,
      description: optionalText(formData.get("description")),
      hourly_rate_net: standardHourlyRateNet,
      started_at: startedAt,
      stopped_at: stoppedAt,
      created_by: session.user.id,
    });

    if (error) return errorResponse(error.message);
    revalidatePath("/stunden");
    return NextResponse.redirect(trackingUrl(request, formData, "stunden"), 303);
  }

  if (intent === "stop_time") {
    const timeEntryId = optionalText(formData.get("time_entry_id"));
    if (!timeEntryId) return errorResponse("Zeiteintrag fehlt.");

    const { error } = await supabase
      .from("time_entries")
      .update({ stopped_at: new Date().toISOString() })
      .eq("id", timeEntryId)
      .eq("project_id", projectId)
      .eq("staff_member_id", session.staffMember.id)
      .is("stopped_at", null)
      .is("billed_at", null);

    if (error) return errorResponse(error.message);
    revalidatePath("/stunden");
    return NextResponse.redirect(trackingUrl(request, formData, "stunden"), 303);
  }

  if (intent === "add_expense") {
    const title = optionalText(formData.get("title"));
    const expenseDate = optionalText(formData.get("expense_date"));
    if (!title || !expenseDate) return errorResponse("Titel und Datum sind Pflichtfelder.");

    const { error } = await supabase.from("expense_entries").insert({
      project_id: projectId,
      staff_member_id: session.staffMember.id,
      title,
      description: optionalText(formData.get("description")),
      expense_at: dateStartIso(expenseDate),
      amount_net: parseDecimal(formData.get("amount_net")),
      tax_rate: parseDecimal(formData.get("tax_rate"), 19),
      created_by: session.user.id,
    });

    if (error) return errorResponse(error.message);
    revalidatePath("/stunden");
    return NextResponse.redirect(trackingUrl(request, formData, "spesen"), 303);
  }

  if (intent === "add_accommodation") {
    const provider = optionalText(formData.get("provider"));
    const checkInDate = optionalText(formData.get("check_in_date"));
    const checkOutDate = optionalText(formData.get("check_out_date"));
    if (!provider || !checkInDate) return errorResponse("Unterkunft und Anreisedatum sind Pflichtfelder.");

    const { error } = await supabase.from("accommodation_entries").insert({
      project_id: projectId,
      staff_member_id: session.staffMember.id,
      provider,
      location: optionalText(formData.get("location")),
      notes: optionalText(formData.get("notes")),
      check_in_at: dateStartIso(checkInDate),
      check_out_at: checkOutDate ? dateStartIso(checkOutDate) : null,
      nights: parseDecimal(formData.get("nights"), 1),
      amount_net: parseDecimal(formData.get("amount_net")),
      tax_rate: parseDecimal(formData.get("tax_rate"), 19),
      created_by: session.user.id,
    });

    if (error) return errorResponse(error.message);
    revalidatePath("/stunden");
    return NextResponse.redirect(trackingUrl(request, formData, "unterkunft"), 303);
  }

  return errorResponse("Unbekannte Aktion.");
}
