import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getCustomerContext } from "@/lib/dashboard/customer-data";

type PageProps = { params: Promise<{ customerId: string }> };

export default async function CustomerPropertiesPage({ params }: PageProps) {
  const { customerId } = await params;
  const { properties } = await getCustomerContext(customerId);

  if (properties.length === 0) {
    return <EmptyState title="Noch keine Objekte" description="Hier erscheinen Immobilien, Bauphase und technische Grunddaten." />;
  }

  return (
    <div className="grid gap-4">
      {properties.map((property) => (
        <article key={property.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink">{property.property_name}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {[property.street, property.house_number].filter(Boolean).join(" ")} {property.postal_code} {property.city}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={property.building_type} />
              <StatusBadge value={property.construction_phase} />
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
            <span>Wohnfläche: {property.living_area_sqm ?? "—"} m²</span>
            <span>Etagen: {property.floors_count ?? "—"}</span>
            <span>Räume: {property.rooms_count ?? "—"}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
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
          {property.notes ? <p className="mt-4 text-sm leading-6 text-slate-600">{property.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}
