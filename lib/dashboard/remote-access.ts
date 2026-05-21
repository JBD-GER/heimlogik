export type RemoteAccessField = {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea";
};

export type RemoteAccessModule = {
  key: string;
  title: string;
  eyebrow: string;
  description: string;
  fields: RemoteAccessField[];
};

export const remoteAccessModules: RemoteAccessModule[] = [
  {
    key: "knx_ip_interface",
    eyebrow: "KNX-Bus",
    title: "KNX-IP-Endgerät",
    description: "KNX-IP-Schnittstelle oder KNX-IP-Router im Kundennetz dokumentieren und als lokalen Buszugang prüfen.",
    fields: [
      { key: "device_present", label: "Vorhanden / geplant", placeholder: "z.B. vorhanden" },
      { key: "manufacturer_model", label: "Hersteller / Modell", placeholder: "z.B. Weinzierl 730, MDT SCN-IP000.03" },
      { key: "ip_address", label: "IP-Adresse", placeholder: "z.B. 192.168.178.50" },
      { key: "knx_bus_power", label: "Busspannung geprüft", placeholder: "z.B. ja" },
      { key: "lan_port", label: "LAN / Switch-Port", placeholder: "z.B. Technikraum Switch Port 7" },
    ],
  },
  {
    key: "ets_local_test",
    eyebrow: "Vor Ort",
    title: "ETS lokal getestet",
    description: "Vor Ort prüfen, ob ETS über die KNX-IP-Schnittstelle Telegramme sieht und Geräte lesen/programmiert werden können.",
    fields: [
      { key: "ets_project", label: "ETS-Projekt", placeholder: "z.B. Mueller_Leese_KNX_v1.knxproj" },
      { key: "connection_mode", label: "Verbindung", placeholder: "z.B. KNXnet/IP Tunneling, Port 3671" },
      { key: "group_monitor", label: "Gruppenmonitor", placeholder: "z.B. Telegramme sichtbar" },
      { key: "test_result", label: "Testergebnis", type: "textarea", placeholder: "Was wurde lokal geprüft?" },
    ],
  },
  {
    key: "remote_gateway",
    eyebrow: "Gateway",
    title: "Heimlogik Remote Gateway",
    description: "GL.iNet Gateway vorbereiten, benennen, aktualisieren und eindeutig dem Kundenprojekt zuordnen.",
    fields: [
      { key: "gateway_model", label: "Gateway-Modell", placeholder: "z.B. GL.iNet Brume 2 / GL-MT2500" },
      { key: "gateway_name", label: "Gateway-Name", placeholder: "z.B. heimlogik-mueller-leese" },
      { key: "admin_setup", label: "Admin / Firmware", placeholder: "z.B. Passwort gesetzt, Firmware aktuell" },
      { key: "wan_source", label: "WAN / Uplink", placeholder: "z.B. Kundenrouter LAN 3" },
    ],
  },
  {
    key: "tailscale",
    eyebrow: "VPN",
    title: "Tailscale aktiviert",
    description: "Gateway im Heimlogik-Tailscale-Account autorisieren und Online-Status prüfen.",
    fields: [
      { key: "tailscale_name", label: "Tailscale-Name", placeholder: "z.B. heimlogik-mueller-leese" },
      { key: "account", label: "Account / Tailnet", placeholder: "z.B. Heimlogik Admin" },
      { key: "online_status", label: "Online-Status", placeholder: "z.B. online geprüft" },
    ],
  },
  {
    key: "subnet_route",
    eyebrow: "Routing",
    title: "Subnet Route / LAN-Zugriff",
    description: "LAN-Zugriff hinter dem Gateway freigeben und Route in der Tailscale Admin Console genehmigen.",
    fields: [
      { key: "customer_network", label: "Kundennetz", placeholder: "z.B. 192.168.178.0/24" },
      { key: "approved_route", label: "Genehmigte Route", placeholder: "z.B. 192.168.178.0/24 approved" },
      { key: "technical_network", label: "Techniknetz optional", placeholder: "z.B. 10.10.10.0/24" },
    ],
  },
  {
    key: "customer_installation",
    eyebrow: "Installation",
    title: "Gateway beim Kunden installiert",
    description: "Gateway mit Strom und Kundennetz verbinden, Internet prüfen und Online-Status dokumentieren.",
    fields: [
      { key: "location", label: "Einbauort", placeholder: "z.B. Technikraum / Netzwerkschrank" },
      { key: "power", label: "Stromversorgung", placeholder: "z.B. Netzteil beschriftet" },
      { key: "online_check", label: "Online geprüft", placeholder: "z.B. 21.05.2026, 14:30 Uhr" },
    ],
  },
  {
    key: "remote_knx_reachability",
    eyebrow: "Remote-Test",
    title: "KNX-IP remote erreichbar",
    description: "Von außerhalb per Tailscale prüfen, ob KNX-IP-Adresse erreichbar ist und ETS manuell verbunden werden kann.",
    fields: [
      { key: "ping_result", label: "Ping / Erreichbarkeit", placeholder: "z.B. 192.168.178.50 erreichbar" },
      { key: "ets_manual_target", label: "ETS Ziel", placeholder: "z.B. 192.168.178.50:3671" },
      { key: "remote_result", label: "Remote-Ergebnis", type: "textarea", placeholder: "Was wurde aus der Ferne geprüft?" },
    ],
  },
  {
    key: "documentation",
    eyebrow: "Akte",
    title: "Kundenakte dokumentiert",
    description: "Gateway, Tailscale, Kundennetz, KNX-IP und ETS-Projekt sauber für spätere Fernwartung ablegen.",
    fields: [
      { key: "access_type", label: "Zugriff", placeholder: "z.B. Tailscale Subnet Route" },
      { key: "status", label: "Status", placeholder: "z.B. Fernwartung aktiv" },
      { key: "notes", label: "Hinweise", type: "textarea", placeholder: "Keine Klartext-Passwörter speichern." },
    ],
  },
];
