import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { floorLabelForLevel, floorOptions, roomTypeExists } from "@/lib/dashboard/building";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ customerId: string; projectId: string }>;
};

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

function numberOrNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").replace(",", ".").trim();
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function errorResponse(message: string, status = 400) {
  return new NextResponse(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

function buildingUrl(request: Request, customerId: string, projectId: string) {
  return new URL(`/dashboard/kunden/${customerId}/projekte/${projectId}/gebaeude`, request.url);
}

async function refreshPropertyCounts(supabase: ReturnType<typeof createSupabaseAdminClient>, propertyId: string) {
  const [floorsResult, roomsResult] = await Promise.all([
    supabase.from("floors").select("id", { count: "exact", head: true }).eq("property_id", propertyId),
    supabase.from("rooms").select("id", { count: "exact", head: true }).eq("property_id", propertyId),
  ]);

  const { error } = await supabase
    .from("properties")
    .update({
      floors_count: floorsResult.count ?? 0,
      rooms_count: roomsResult.count ?? 0,
    })
    .eq("id", propertyId);

  if (error) {
    console.error("Building count refresh failed", error);
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    await requireDashboardUser();
    const { customerId, projectId } = await params;
    const formData = await request.formData();
    const intent = String(formData.get("_intent") ?? "");
    const { property } = await getProjectContext(customerId, projectId);

    if (!property) {
      return errorResponse("Gebäude wurde nicht gefunden.", 404);
    }

    const supabase = createSupabaseAdminClient();

    if (intent === "add_floor") {
      const levelNumber = Number(formData.get("level_number"));
      const levelAllowed = floorOptions.some((option) => option.level === levelNumber);

      if (!levelAllowed) {
        return errorResponse("Diese Etage ist nicht vorgesehen.");
      }

      const { data: existingFloor, error: existingFloorError } = await supabase
        .from("floors")
        .select("id")
        .eq("property_id", property.id)
        .eq("level_number", levelNumber)
        .maybeSingle<{ id: string }>();

      if (existingFloorError) {
        return errorResponse(existingFloorError.message);
      }

      if (existingFloor) {
        return errorResponse("Diese Etage ist bereits angelegt.");
      }

      const { error } = await supabase.from("floors").insert({
        property_id: property.id,
        floor_name: floorLabelForLevel(levelNumber),
        level_number: levelNumber,
        notes: optionalText(formData.get("notes")),
      });

      if (error) {
        return errorResponse(error.message);
      }

      await refreshPropertyCounts(supabase, property.id);
      revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/gebaeude`);
      return NextResponse.redirect(buildingUrl(request, customerId, projectId), 303);
    }

    if (intent === "add_room") {
      const floorId = optionalText(formData.get("floor_id"));
      const roomName = optionalText(formData.get("room_name"));
      const roomType = String(formData.get("room_type") ?? "other");

      if (!floorId || !roomName) {
        return errorResponse("Bitte Etage und Raumname eintragen.");
      }

      const { data: floor, error: floorError } = await supabase
        .from("floors")
        .select("id")
        .eq("id", floorId)
        .eq("property_id", property.id)
        .maybeSingle<{ id: string }>();

      if (floorError) {
        return errorResponse(floorError.message);
      }

      if (!floor) {
        return errorResponse("Etage wurde nicht gefunden.");
      }

      const { error } = await supabase.from("rooms").insert({
        property_id: property.id,
        floor_id: floor.id,
        room_name: roomName,
        room_type: roomTypeExists(roomType) ? roomType : "other",
        area_sqm: numberOrNull(formData.get("area_sqm")),
        notes: optionalText(formData.get("notes")),
      });

      if (error) {
        return errorResponse(error.message);
      }

      await refreshPropertyCounts(supabase, property.id);
      revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/gebaeude`);
      return NextResponse.redirect(buildingUrl(request, customerId, projectId), 303);
    }

    if (intent === "delete_room") {
      const roomId = optionalText(formData.get("room_id"));

      if (!roomId) {
        return errorResponse("Raum wurde nicht gefunden.");
      }

      const { error } = await supabase.from("rooms").delete().eq("id", roomId).eq("property_id", property.id);

      if (error) {
        return errorResponse(error.message);
      }

      await refreshPropertyCounts(supabase, property.id);
      revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/gebaeude`);
      return NextResponse.redirect(buildingUrl(request, customerId, projectId), 303);
    }

    if (intent === "delete_floor") {
      const floorId = optionalText(formData.get("floor_id"));

      if (!floorId) {
        return errorResponse("Etage wurde nicht gefunden.");
      }

      const { error: roomsError } = await supabase.from("rooms").delete().eq("floor_id", floorId).eq("property_id", property.id);

      if (roomsError) {
        return errorResponse(roomsError.message);
      }

      const { error } = await supabase.from("floors").delete().eq("id", floorId).eq("property_id", property.id);

      if (error) {
        return errorResponse(error.message);
      }

      await refreshPropertyCounts(supabase, property.id);
      revalidatePath(`/dashboard/kunden/${customerId}/projekte/${projectId}/gebaeude`);
      return NextResponse.redirect(buildingUrl(request, customerId, projectId), 303);
    }

    return errorResponse("Aktion wurde nicht erkannt.");
  } catch (error) {
    console.error("Building route failed", error);
    return errorResponse(error instanceof Error ? error.message : "Gebäude konnte nicht gespeichert werden.", 500);
  }
}
