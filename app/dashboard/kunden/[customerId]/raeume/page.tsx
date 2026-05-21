import { EmptyState } from "@/components/dashboard/EmptyState";
import { labelFor } from "@/lib/dashboard/labels";
import { getCustomerContext } from "@/lib/dashboard/customer-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type PageProps = { params: Promise<{ customerId: string }> };
type RoomRow = { id: string; room_name: string; room_type: string; area_sqm: number | null; notes: string | null; floors?: { floor_name: string | null } | null };

export default async function CustomerRoomsPage({ params }: PageProps) {
  const { customerId } = await params;
  const { propertyIds } = await getCustomerContext(customerId);
  const supabase = createSupabaseAdminClient();
  const { data } = propertyIds.length
    ? await supabase.from("rooms").select("id, room_name, room_type, area_sqm, notes, floors(floor_name)").in("property_id", propertyIds).order("room_name", { ascending: true })
    : { data: [] };
  const rooms = (data ?? []) as unknown as RoomRow[];

  if (rooms.length === 0) return <EmptyState title="Noch keine Räume" description="Räume werden pro Objekt und Etage erfasst." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rooms.map((room) => (
        <article key={room.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-ink">{room.room_name}</h2>
          <p className="mt-2 text-sm text-slate-600">{labelFor(room.room_type)} · {room.floors?.floor_name ?? "Etage offen"} · {room.area_sqm ?? "—"} m²</p>
          {room.notes ? <p className="mt-4 text-sm leading-6 text-slate-600">{room.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}
