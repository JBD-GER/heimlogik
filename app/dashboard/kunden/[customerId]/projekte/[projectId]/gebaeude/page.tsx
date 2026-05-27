import { Building2, DoorOpen, Layers3, Plus, Ruler, StickyNote, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { floorOptions, floorShortLabelForLevel, roomTypeOptions } from "@/lib/dashboard/building";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { labelFor } from "@/lib/dashboard/labels";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string; projectId: string }> };

type FloorRow = {
  id: string;
  floor_name: string;
  level_number: number;
  notes: string | null;
};

type RoomRow = {
  id: string;
  floor_id: string | null;
  room_name: string;
  room_type: string;
  area_sqm: number | null;
  notes: string | null;
};

function roomsForFloor(rooms: RoomRow[], floorId: string) {
  return rooms.filter((room) => room.floor_id === floorId);
}

export default async function ProjectBuildingPage({ params }: PageProps) {
  const { customerId, projectId } = await params;
  const { property } = await getProjectContext(customerId, projectId);
  const supabase = createSupabaseAdminClient();
  const buildingApiPath = `/api/dashboard/customers/${customerId}/projects/${projectId}/building`;

  if (!property) {
    return <EmptyState title="Kein Gebäude verknüpft" description="Dieses Projekt hat noch kein Gebäude." />;
  }

  const [floorsResult, roomsResult] = await Promise.all([
    supabase.from("floors").select("id, floor_name, level_number, notes").eq("property_id", property.id).order("level_number", { ascending: true }),
    supabase.from("rooms").select("id, floor_id, room_name, room_type, area_sqm, notes").eq("property_id", property.id).order("room_name", { ascending: true }),
  ]);

  const floors = (floorsResult.data ?? []) as FloorRow[];
  const rooms = (roomsResult.data ?? []) as RoomRow[];
  const existingLevels = new Set(floors.map((floor) => floor.level_number));
  const availableFloorOptions = floorOptions.filter((option) => !existingLevels.has(option.level));

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Projekt" title="Gebäude" description="Objektdaten, Etagen und Räume für Planung, Diagnostik und spätere Gerätezuordnung." />

      <InfoCard title={property.property_name}>
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={property.building_type} />
              <StatusBadge value={property.construction_phase} />
            </div>
            <dl className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
              <div>
                <dt className="font-bold text-ink">Adresse</dt>
                <dd className="mt-1">
                  {[property.street, property.house_number].filter(Boolean).join(" ")} {property.postal_code} {property.city}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-ink">Wohnfläche</dt>
                <dd className="mt-1">{property.living_area_sqm ?? "—"} m²</dd>
              </div>
              <div>
                <dt className="font-bold text-ink">Etagen/Räume</dt>
                <dd className="mt-1">
                  {floors.length} / {rooms.length}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
              {[
                ["Technikraum", property.has_technical_room],
                ["Netzwerk", property.has_network],
                ["KNX", property.has_knx],
                ["DALI", property.has_dali],
                ["free@home", property.has_free_at_home],
                ["Home Assistant", property.has_home_assistant],
                ["WLAN bekannt", property.wifi_coverage_known],
              ].map(([label, active]) => (
                <span key={String(label)} className="rounded-md bg-slate-100 px-2.5 py-1">
                  {label}: {active ? "ja" : "nein"}
                </span>
              ))}
            </div>
          </div>

          <form action={buildingApiPath} method="post" className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
            <input type="hidden" name="_intent" value="add_floor" />
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <Layers3 className="h-4 w-4 text-accent" aria-hidden="true" />
              Etage hinzufügen
            </div>
            <select name="level_number" disabled={!availableFloorOptions.length} className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm">
              {availableFloorOptions.map((option) => (
                <option key={option.level} value={option.level}>
                  {option.label}
                </option>
              ))}
            </select>
            <input name="notes" placeholder="Notiz optional" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
            <button disabled={!availableFloorOptions.length} className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-ink hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Etage anlegen
            </button>
          </form>
        </div>
      </InfoCard>

      {floors.length === 0 ? (
        <EmptyState title="Noch keine Etagen" description="Lege zuerst Keller, Erdgeschoss oder ein Obergeschoss an." />
      ) : (
        <section className="grid gap-4">
          {floors.map((floor) => {
            const floorRooms = roomsForFloor(rooms, floor.id);

            return (
              <article key={floor.id} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-4 border-b border-slate-100 bg-slate-50 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-ink text-sm font-black text-white">
                      {floorShortLabelForLevel(floor.level_number)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-bold text-ink">{floor.floor_name}</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {floorRooms.length} {floorRooms.length === 1 ? "Raum" : "Räume"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600 md:justify-end">
                    <span className="inline-flex min-h-8 items-center gap-1 rounded-md bg-white px-2.5">
                      <Building2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      Ebene {floor.level_number}
                    </span>
                    <form action={buildingApiPath} method="post">
                      <input type="hidden" name="_intent" value="delete_floor" />
                      <input type="hidden" name="floor_id" value={floor.id} />
                      <button className="focus-ring inline-flex min-h-8 items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 text-xs font-bold text-red-700 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Etage löschen
                      </button>
                    </form>
                  </div>
                </div>

                <div className="grid gap-4 p-4 lg:grid-cols-[1fr_360px]">
                  <div className="min-w-0">
                    {floorRooms.length === 0 ? (
                      <div className="rounded-md border border-dashed border-slate-300 bg-white p-5 text-sm font-semibold text-slate-500">
                        Noch keine Räume auf dieser Etage.
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {floorRooms.map((room) => (
                          <div key={room.id} className="rounded-md border border-slate-200 bg-white p-4">
                            <div className="flex items-start gap-3">
                              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-emerald-50 text-accent">
                                <DoorOpen className="h-5 w-5" aria-hidden="true" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="truncate text-base font-bold text-ink">{room.room_name}</h3>
                                <p className="mt-1 text-xs font-bold text-slate-500">{labelFor(room.room_type)}</p>
                              </div>
                              <form action={buildingApiPath} method="post" className="shrink-0">
                                <input type="hidden" name="_intent" value="delete_room" />
                                <input type="hidden" name="room_id" value={room.id} />
                                <button className="focus-ring grid h-8 w-8 place-items-center rounded-md border border-red-200 text-red-700 hover:bg-red-50" aria-label={`${room.room_name} löschen`}>
                                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </form>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                              <span className="inline-flex min-h-8 items-center gap-1 rounded-md bg-slate-100 px-2.5">
                                <Ruler className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                                {room.area_sqm ?? "—"} m²
                              </span>
                              <span className="inline-flex min-h-8 items-center rounded-md bg-slate-100 px-2.5">Geräte</span>
                            </div>
                            {room.notes ? (
                              <p className="mt-3 flex items-start gap-2 text-sm leading-5 text-slate-600">
                                <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                                <span>{room.notes}</span>
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                    {floor.notes ? <p className="mt-4 text-sm leading-6 text-slate-600">{floor.notes}</p> : null}
                  </div>

                  <form action={buildingApiPath} method="post" className="grid content-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                    <input type="hidden" name="_intent" value="add_room" />
                    <input type="hidden" name="floor_id" value={floor.id} />
                    <div className="flex items-center gap-2 text-sm font-bold text-ink">
                      <DoorOpen className="h-4 w-4 text-accent" aria-hidden="true" />
                      Raum hinzufügen
                    </div>
                    <input name="room_name" required placeholder="Raumname" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
                    <div className="grid gap-3 sm:grid-cols-[1fr_110px] lg:grid-cols-1 xl:grid-cols-[1fr_110px]">
                      <select name="room_type" defaultValue="other" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm">
                        {roomTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input name="area_sqm" inputMode="decimal" placeholder="m²" className="min-h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" />
                    </div>
                    <textarea name="notes" placeholder="Notiz optional" className="min-h-20 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" />
                    <button className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-4 text-sm font-bold text-white hover:bg-slate-700">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Raum anlegen
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
