import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { berlinDateEndExclusiveIso, berlinDateStartIso, berlinDateTimeIso, billingHourlyRateNet, durationHours, standardHourlyRateNet } from "@/lib/dashboard/billing";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { customerName, formatDate, formatDateTime } from "@/lib/dashboard/format";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string }>;
};

type TimeEntry = {
  id: string;
  title: string;
  description: string | null;
  started_at: string;
  stopped_at: string;
  hourly_rate_net: number | string | null;
};

type ExpenseEntry = {
  id: string;
  title: string;
  description: string | null;
  expense_at: string;
  amount_net: number | string | null;
  tax_rate: number | string | null;
};

type AccommodationEntry = {
  id: string;
  provider: string;
  location: string | null;
  notes: string | null;
  check_in_at: string;
  check_out_at: string | null;
  nights: number | string | null;
  amount_net: number | string | null;
  tax_rate: number | string | null;
};

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

function hourlyRateFromForm(formData: FormData) {
  if (optionalText(formData.get("free_of_charge")) === "on") return 0;
  return standardHourlyRateNet;
}

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function billingUrl(request: Request, customerId: string, projectId: string, formData: FormData, tab = "stunden") {
  const url = new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`, request.url);
  url.searchParams.set("tab", tab);
  const startDate = optionalText(formData.get("start_date"));
  const endDate = optionalText(formData.get("end_date"));
  if (startDate) url.searchParams.set("von", startDate);
  if (endDate) url.searchParams.set("bis", endDate);
  return url;
}

function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export async function POST(request: Request, { params }: RouteContext) {
  const user = await requireDashboardUser();
  const { customerId, projectId } = await params;
  const formData = await request.formData();
  const intent = String(formData.get("_intent") ?? "");
  const { customer, project } = await getProjectContext(customerId, projectId);

  if (!customer || !project) {
    return errorResponse("Projekt wurde nicht gefunden.", 404);
  }

  const supabase = createSupabaseAdminClient();

  if (intent === "start_time") {
    const title = optionalText(formData.get("title"));
    if (!title) return errorResponse("Bitte Tätigkeit eintragen.");

    const timeMode = optionalText(formData.get("time_mode"));
    const manualDate = optionalText(formData.get("manual_date"));
    const manualStartTime = optionalText(formData.get("manual_start_time"));
    const manualEndTime = optionalText(formData.get("manual_end_time"));
    let startedAt = new Date().toISOString();
    let stoppedAt: string | null = null;

    if (timeMode === "manual") {
      if (!manualDate || !validTimeValue(manualStartTime) || !validTimeValue(manualEndTime)) {
        return errorResponse("Bitte Datum, Von und Bis für die nachgereichten Stunden eintragen.");
      }
      startedAt = berlinDateTimeIso(manualDate, manualStartTime);
      stoppedAt = berlinDateTimeIso(manualDate, manualEndTime);
      if (!stoppedAt || new Date(stoppedAt).getTime() <= new Date(startedAt).getTime()) {
        return errorResponse("Die Bis-Uhrzeit muss nach der Von-Uhrzeit liegen.");
      }
    }

    const { error } = await supabase.from("time_entries").insert({
      project_id: projectId,
      staff_member_id: optionalText(formData.get("staff_member_id")),
      title,
      description: optionalText(formData.get("description")),
      hourly_rate_net: hourlyRateFromForm(formData),
      started_at: startedAt,
      stopped_at: stoppedAt,
      created_by: user.id,
    });

    if (error) return errorResponse(error.message);
    revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`);
    return NextResponse.redirect(billingUrl(request, customerId, projectId, formData, "stunden"), 303);
  }

  if (intent === "stop_time") {
    const timeEntryId = optionalText(formData.get("time_entry_id"));
    if (!timeEntryId) return errorResponse("Zeiteintrag fehlt.");

    const { error } = await supabase
      .from("time_entries")
      .update({ stopped_at: new Date().toISOString() })
      .eq("id", timeEntryId)
      .eq("project_id", projectId)
      .is("stopped_at", null)
      .is("billed_at", null);

    if (error) return errorResponse(error.message);
    revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`);
    return NextResponse.redirect(billingUrl(request, customerId, projectId, formData, "stunden"), 303);
  }

  if (intent === "update_time") {
    const timeEntryId = optionalText(formData.get("time_entry_id"));
    const title = optionalText(formData.get("title"));
    const manualDate = optionalText(formData.get("manual_date"));
    const manualStartTime = optionalText(formData.get("manual_start_time"));
    const manualEndTime = optionalText(formData.get("manual_end_time"));

    if (!timeEntryId) return errorResponse("Zeiteintrag fehlt.");
    if (!title) return errorResponse("Bitte Tätigkeit eintragen.");
    if (!manualDate || !validTimeValue(manualStartTime)) return errorResponse("Bitte Datum und Von-Uhrzeit eintragen.");

    const startedAt = berlinDateTimeIso(manualDate, manualStartTime);
    let stoppedAt: string | null = null;
    if (manualEndTime) {
      if (!validTimeValue(manualEndTime)) return errorResponse("Bitte eine gültige Bis-Uhrzeit eintragen.");
      stoppedAt = berlinDateTimeIso(manualDate, manualEndTime);
      if (new Date(stoppedAt).getTime() <= new Date(startedAt).getTime()) {
        return errorResponse("Die Bis-Uhrzeit muss nach der Von-Uhrzeit liegen.");
      }
    }

    const { error } = await supabase
      .from("time_entries")
      .update({
        staff_member_id: optionalText(formData.get("staff_member_id")),
        title,
        description: optionalText(formData.get("description")),
        hourly_rate_net: hourlyRateFromForm(formData),
        started_at: startedAt,
        stopped_at: stoppedAt,
      })
      .eq("id", timeEntryId)
      .eq("project_id", projectId)
      .is("invoice_id", null)
      .is("billed_at", null);

    if (error) return errorResponse(error.message);
    revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`);
    return NextResponse.redirect(billingUrl(request, customerId, projectId, formData, "stunden"), 303);
  }

  if (intent === "delete_time") {
    const timeEntryId = optionalText(formData.get("time_entry_id"));
    if (!timeEntryId) return errorResponse("Zeiteintrag fehlt.");

    const { error } = await supabase
      .from("time_entries")
      .delete()
      .eq("id", timeEntryId)
      .eq("project_id", projectId)
      .is("invoice_id", null)
      .is("billed_at", null);

    if (error) return errorResponse(error.message);
    revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`);
    return NextResponse.redirect(billingUrl(request, customerId, projectId, formData, "stunden"), 303);
  }

  if (intent === "add_expense") {
    const title = optionalText(formData.get("title"));
    const expenseDate = optionalText(formData.get("expense_date"));
    if (!title || !expenseDate) return errorResponse("Titel und Datum sind Pflichtfelder.");

    const { error } = await supabase.from("expense_entries").insert({
      project_id: projectId,
      staff_member_id: optionalText(formData.get("staff_member_id")),
      title,
      description: optionalText(formData.get("description")),
      expense_at: berlinDateStartIso(expenseDate),
      amount_net: parseDecimal(formData.get("amount_net")),
      tax_rate: parseDecimal(formData.get("tax_rate"), 19),
      created_by: user.id,
    });

    if (error) return errorResponse(error.message);
    revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`);
    return NextResponse.redirect(billingUrl(request, customerId, projectId, formData, "spesen"), 303);
  }

  if (intent === "add_accommodation") {
    const provider = optionalText(formData.get("provider"));
    const checkInDate = optionalText(formData.get("check_in_date"));
    const checkOutDate = optionalText(formData.get("check_out_date"));
    if (!provider || !checkInDate) return errorResponse("Unterkunft und Anreisedatum sind Pflichtfelder.");

    const { error } = await supabase.from("accommodation_entries").insert({
      project_id: projectId,
      staff_member_id: optionalText(formData.get("staff_member_id")),
      provider,
      location: optionalText(formData.get("location")),
      notes: optionalText(formData.get("notes")),
      check_in_at: berlinDateStartIso(checkInDate),
      check_out_at: checkOutDate ? berlinDateStartIso(checkOutDate) : null,
      nights: parseDecimal(formData.get("nights"), 1),
      amount_net: parseDecimal(formData.get("amount_net")),
      tax_rate: parseDecimal(formData.get("tax_rate"), 19),
      created_by: user.id,
    });

    if (error) return errorResponse(error.message);
    revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`);
    return NextResponse.redirect(billingUrl(request, customerId, projectId, formData, "unterkunft"), 303);
  }

  if (intent !== "create_invoice") {
    return errorResponse("Unbekannte Aktion.");
  }

  const startDate = optionalText(formData.get("start_date"));
  const endDate = optionalText(formData.get("end_date"));
  if (!startDate || !endDate) return errorResponse("Bitte Zeitraum auswählen.");

  const fromIso = berlinDateStartIso(startDate);
  const untilIso = berlinDateEndExclusiveIso(endDate);
  const [timeResult, expensesResult, accommodationsResult] = await Promise.all([
    supabase
      .from("time_entries")
      .select("id, title, description, started_at, stopped_at, hourly_rate_net")
      .eq("project_id", projectId)
      .eq("billable", true)
      .is("invoice_id", null)
      .is("billed_at", null)
      .not("stopped_at", "is", null)
      .gte("started_at", fromIso)
      .lt("started_at", untilIso)
      .order("started_at", { ascending: true }),
    supabase
      .from("expense_entries")
      .select("id, title, description, expense_at, amount_net, tax_rate")
      .eq("project_id", projectId)
      .eq("billable", true)
      .is("invoice_id", null)
      .is("billed_at", null)
      .gte("expense_at", fromIso)
      .lt("expense_at", untilIso)
      .order("expense_at", { ascending: true }),
    supabase
      .from("accommodation_entries")
      .select("id, provider, location, notes, check_in_at, check_out_at, nights, amount_net, tax_rate")
      .eq("project_id", projectId)
      .eq("billable", true)
      .is("invoice_id", null)
      .is("billed_at", null)
      .gte("check_in_at", fromIso)
      .lt("check_in_at", untilIso)
      .order("check_in_at", { ascending: true }),
  ]);

  if (timeResult.error || expensesResult.error || accommodationsResult.error) {
    return errorResponse(timeResult.error?.message ?? expensesResult.error?.message ?? accommodationsResult.error?.message ?? "Abrechnungsdaten konnten nicht geladen werden.");
  }

  const timeEntries = ((timeResult.data ?? []) as unknown as TimeEntry[]).map((entry) => ({
    sourceType: "time" as const,
    sourceId: entry.id,
    sortDate: entry.started_at,
    description: [
      `${formatDate(entry.started_at)} · ${entry.title}`,
      `${formatDateTime(entry.started_at)} bis ${formatDateTime(entry.stopped_at)}`,
      entry.description,
    ]
      .filter(Boolean)
      .join("\n"),
    quantity: durationHours(entry.started_at, entry.stopped_at),
    unit: "Std.",
    unitPriceNet: billingHourlyRateNet(entry.hourly_rate_net),
    taxRate: 19,
  }));

  const expenseEntries = ((expensesResult.data ?? []) as unknown as ExpenseEntry[]).map((entry) => ({
    sourceType: "expense" as const,
    sourceId: entry.id,
    sortDate: entry.expense_at,
    description: [`Spesen · ${formatDate(entry.expense_at)} · ${entry.title}`, entry.description].filter(Boolean).join("\n"),
    quantity: 1,
    unit: "Pausch.",
    unitPriceNet: Number(entry.amount_net ?? 0),
    taxRate: Number(entry.tax_rate ?? 19),
  }));

  const accommodationEntries = ((accommodationsResult.data ?? []) as unknown as AccommodationEntry[]).map((entry) => ({
    sourceType: "accommodation" as const,
    sourceId: entry.id,
    sortDate: entry.check_in_at,
    description: [
      `Unterkunft · ${entry.provider}`,
      `${formatDate(entry.check_in_at)}${entry.check_out_at ? ` bis ${formatDate(entry.check_out_at)}` : ""}`,
      entry.location ? `Ort: ${entry.location}` : null,
      entry.notes,
    ]
      .filter(Boolean)
      .join("\n"),
    quantity: Number(entry.nights ?? 1),
    unit: "Nacht",
    unitPriceNet: Number(entry.amount_net ?? 0) / Math.max(Number(entry.nights ?? 1), 1),
    taxRate: Number(entry.tax_rate ?? 19),
  }));

  const billableItems = [...timeEntries, ...expenseEntries, ...accommodationEntries].sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  if (!billableItems.length) {
    return errorResponse("In diesem Zeitraum gibt es keine nicht abgerechneten Einträge.");
  }

  const netAmount = roundCurrency(billableItems.reduce((sum, item) => sum + item.quantity * item.unitPriceNet, 0));
  const taxAmount = roundCurrency(billableItems.reduce((sum, item) => sum + item.quantity * item.unitPriceNet * (item.taxRate / 100), 0));
  const grossAmount = roundCurrency(netAmount + taxAmount);
  const invoiceYear = new Date().getFullYear();
  const invoiceNumberResult = await supabase.rpc("next_invoice_number", { invoice_year: invoiceYear });

  if (invoiceNumberResult.error || !invoiceNumberResult.data) {
    return errorResponse(`Rechnungsnummer konnte nicht erstellt werden. Bitte Migration supabase/time_tracking_and_billing.sql ausführen. ${invoiceNumberResult.error?.message ?? ""}`);
  }

  const invoiceAt = new Date();
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      project_id: projectId,
      invoice_number: invoiceNumberResult.data,
      status: "draft",
      title: `Abrechnung ${formatDate(fromIso)} - ${formatDate(berlinDateStartIso(endDate))}`,
      net_amount: netAmount,
      tax_amount: taxAmount,
      gross_amount: grossAmount,
      invoice_at: invoiceAt.toISOString(),
      due_at: addDays(invoiceAt, 14).toISOString(),
      notes: `Automatisch aus nicht abgerechneten Stunden, Spesen und Unterkünften im Zeitraum ${formatDate(fromIso)} bis ${formatDate(berlinDateStartIso(endDate))} erstellt. Kunde: ${customerName(customer)}.`,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (invoiceError || !invoice) {
    return errorResponse(invoiceError?.message ?? "Rechnung konnte nicht erstellt werden.");
  }

  const invoiceItems = billableItems.map((item, index) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unit_price_net: roundCurrency(item.unitPriceNet),
    category: item.sourceType === "time" ? "programming" : "other",
    sort_order: index,
  }));
  const { data: createdItems, error: itemsError } = await supabase.from("invoice_items").insert(invoiceItems).select("id, sort_order");

  if (itemsError || !createdItems) {
    return errorResponse(itemsError?.message ?? "Rechnungspositionen konnten nicht erstellt werden.");
  }

  const billedAt = new Date().toISOString();
  await Promise.all(
    billableItems.map((item, index) => {
      const invoiceItemId = createdItems.find((created) => created.sort_order === index)?.id ?? null;
      const table = item.sourceType === "time" ? "time_entries" : item.sourceType === "expense" ? "expense_entries" : "accommodation_entries";
      return supabase
        .from(table)
        .update({ invoice_id: invoice.id, invoice_item_id: invoiceItemId, billed_at: billedAt })
        .eq("id", item.sourceId)
        .eq("project_id", projectId)
        .is("invoice_id", null)
        .is("billed_at", null);
    }),
  );

  await supabase.from("activity_logs").insert({
    customer_id: customerId,
    project_id: projectId,
    activity_type: "invoice_created",
    title: "Abrechnung erstellt",
    description: `${invoiceNumberResult.data} aus ${billableItems.length} Einträgen im Zeitraum ${startDate} bis ${endDate}`,
    created_by: user.id,
  });

  revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/abrechnung`);
  revalidatePath(`/dashboard/kunden/${customerId}/rechnungen`);
  revalidatePath("/dashboard/rechnungen");
  return NextResponse.redirect(new URL(`/dashboard/kunden/${customerId}/rechnungen`, request.url), 303);
}
