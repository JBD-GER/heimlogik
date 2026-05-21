import { EmptyState } from "@/components/dashboard/EmptyState";
import { InfoCard } from "@/components/dashboard/InfoCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getProjectContext } from "@/lib/dashboard/customer-data";
import { labelFor } from "@/lib/dashboard/labels";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string; projectId: string }> };

type RoomRow = {
  id: string;
  room_name: string;
  room_type: string;
  area_sqm: number | null;
  notes: string | null;
  floors?: { floor_name: string | null } | null;
};

export default async function ProjectBuildingPage({ params }: PageProps) {
  const { customerId, projectId } = await params;
  const { property } = await getProjectContext(customerId, projectId);
  const supabase = createSupabaseAdminClient();
  const { data: roomsData } = property
    ? await supabase.from("rooms").select("id, room_name, room_type, area_sqm, notes, floors(floor_name)").eq("property_id", property.id).order("room_name", { ascending: true })
    : { data: [] };
  const rooms = (roomsData ?? []) as unknown as RoomRow[];

  if (!property) {
    return <EmptyState title="Kein Gebäude verknüpft" description="Dieses Projekt hat noch kein Gebäude." />;
  }

  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Projekt" title="Gebäude" description="Objektdaten, technische Grundausstattung und Räume." />
      <InfoCard title={property.property_name}>
        <div className="flex flex-wrap gap-2">
          <StatusBadge value={property.building_type} />
          <StatusBadge value={property.construction_phase} />
        </div>
        <dl className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
          <div>
            <dt className="font-bold text-ink">Adresse</dt>
            <dd className="mt-1">{[property.street, property.house_number].filter(Boolean).join(" ")} {property.postal_code} {property.city}</dd>
          </div>
          <div>
            <dt className="font-bold text-ink">Wohnfläche</dt>
            <dd className="mt-1">{property.living_area_sqm ?? "—"} m²</dd>
          </div>
          <div>
            <dt className="font-bold text-ink">Etagen/Räume</dt>
            <dd className="mt-1">{property.floors_count ?? "—"} / {property.rooms_count ?? "—"}</dd>
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
            <span key={String(label)} className="rounded-md bg-slate-100 px-2.5 py-1">{label}: {active ? "ja" : "nein"}</span>
          ))}
        </div>
      </InfoCard>

      {rooms.length === 0 ? (
        <EmptyState title="Noch keine Räume" description="Räume können später dem Gebäude zugeordnet und für Planung/Funktionen verwendet werden." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <article key={room.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-ink">{room.room_name}</h2>
              <p className="mt-2 text-sm text-slate-600">{labelFor(room.room_type)} · {room.floors?.floor_name ?? "Etage offen"} · {room.area_sqm ?? "—"} m²</p>
              {room.notes ? <p className="mt-4 text-sm leading-6 text-slate-600">{room.notes}</p> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
