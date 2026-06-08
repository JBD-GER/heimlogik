import { siteConfig } from "@/site.config";

export type GuideCategory = {
  slug: string;
  title: string;
  description: string;
};

export type GuideLink = {
  label: string;
  href: string;
};

export type GuideSection = {
  id: string;
  title: string;
  body: string[];
  bullets?: string[];
};

export type GuideArticle = {
  slug: string;
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  excerpt: string;
  intro: string;
  image: string;
  imageAlt: string;
  graphicTitle: string;
  localNote: string;
  sections: GuideSection[];
  faqs: { question: string; answer: string }[];
  serviceLinks: GuideLink[];
  locationLinks: GuideLink[];
  guideLinks: GuideLink[];
  midCta?: string;
  finalCta: string;
};

export const guideCategories: GuideCategory[] = [
  {
    slug: "grundlagen",
    title: "Smart Home Grundlagen",
    description:
      "Orientierung für Eigentümer, Bauherren und Sanierer: Kosten, Planung, Prioritäten und typische Entscheidungen vor dem ersten Gerätekauf.",
  },
  {
    slug: "nachruestung-bestand",
    title: "Nachrüstung & Bestandsimmobilien",
    description:
      "Was in bestehenden Häusern ohne Komplettumbau funktioniert, wo Funklösungen reichen und wann Fachplanung oder Elektroarbeiten nötig werden.",
  },
  {
    slug: "systeme",
    title: "KNX, Home Assistant & Systeme",
    description:
      "Einordnung von Bus-Systemen, offenen Integrationsplattformen, Funkstandards und Kombinationen für robuste Gebäudetechnik.",
  },
  {
    slug: "heizung-energie-komfort",
    title: "Heizung, Energie & Komfort",
    description:
      "Smarte Raumtemperatur, Heizungssteuerung, Energiemanagement und Komfortfunktionen realistisch gedacht statt mit pauschalen Sparversprechen.",
  },
  {
    slug: "audio-licht-sicherheit",
    title: "Audio, Licht & Sicherheit",
    description:
      "Praxiswissen zu Licht, Beschattung, Multiroom-Audio, Zutritt und Sensorik als Teil eines verständlichen Gesamtsystems.",
  },
  {
    slug: "komfort-sicherheit-alltag",
    title: "Komfort, Sicherheit & Alltag",
    description:
      "Anwendungsnahe Smart-Home-Ideen für Menschen, Routinen und Alltagshilfe - verständlich, ruhig und ohne Techniküberforderung.",
  },
  {
    slug: "immobilien-vermietung",
    title: "Smart Home für Immobilien & Vermietung",
    description:
      "Smart-Home-Lösungen für Ferienimmobilien, Vermietung, Fernzugriff, Gäste-Bedienung und weniger organisatorischen Aufwand.",
  },
  {
    slug: "planung-beratung",
    title: "Planung & Beratung",
    description:
      "Typische Fehler, Entscheidungsgrundlagen und Checklisten, damit Smart Home vor dem Gerätekauf sinnvoll geplant wird.",
  },
];

export const guideOverviewLinks = {
  services: [
    { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
    { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
    { label: "KNX & Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
    { label: "Smart Home Planung für Neubau", href: "/smart-home-planung" },
  ],
  locations: [
    { label: "Smart Home Hannover", href: "/smart-home-hannover" },
    { label: "Smart Home Nienburg", href: "/smart-home-nienburg" },
    { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
    { label: "Smart Home Leese", href: "/smart-home-leese" },
    { label: "Smart Home Neustadt am Rübenberge", href: "/smart-home-neustadt-am-ruebenberge" },
  ],
};

const contactLink = { label: "Beratung anfragen", href: "/kontakt" };

export const guideArticles: GuideArticle[] = [
  {
    slug: "smart-home-nachruesten-ohne-waende-aufzureissen",
    path: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen",
    title: "Smart Home nachrüsten ohne Wände aufzureißen - was ist wirklich möglich?",
    metaTitle: "Smart Home nachrüsten ohne Umbau | Heimlogik",
    metaDescription:
      "Smart Home im Bestand nachrüsten: Funklösungen, Heizung, Licht, Rollläden, Sensoren und Grenzen ehrlich erklärt.",
    category: "Nachrüstung & Bestandsimmobilien",
    excerpt:
      "Was in bestehenden Einfamilienhäusern realistisch ist, welche Funklösungen funktionieren und wann Kabel oder Fachpartner sinnvoller sind.",
    intro:
      "Ein bestehendes Haus lässt sich oft erstaunlich gut smarter machen. Entscheidend ist aber, nicht jede Funktion zwanghaft drahtlos lösen zu wollen. Gute Nachrüstung beginnt mit einer ehrlichen Prüfung von Funkabdeckung, vorhandener Elektroinstallation, Bedienwunsch und späterer Erweiterbarkeit.",
    image: "/images/ratgeber/smart-home-nachruestung-bestand.svg",
    imageAlt:
      "Grafik zur Smart-Home-Nachrüstung mit Heizkörperthermostaten, Sensoren, Lichtsteuerung und zentraler Steuerung",
    graphicTitle: "Smart Home Nachrüstung im Bestand",
    localNote:
      "Gerade in Bestandsimmobilien rund um Hannover, Nienburg, Wunstorf, Leese und Neustadt am Rübenberge lohnt sich ein Vor-Ort-Blick, bevor Geräte gekauft werden.",
    sections: [
      {
        id: "realistisch",
        title: "Was bei Bestandsimmobilien realistisch ist",
        body: [
          "Nachrüstung funktioniert besonders gut bei Funktionen, die wenig Eingriff in die Bausubstanz brauchen: Heizkörperthermostate, Sensoren, Zwischenstecker, einzelne Lichtfunktionen, Rollladensteuerung und Automationen über eine Zentrale.",
          "Schwieriger wird es, wenn viele Lichtkreise, Unterverteilungen, motorisierte Beschattung oder feste 230V-Komponenten sauber eingebunden werden sollen. Dann ist ein Elektriker beziehungsweise ein Fachpartner nötig.",
        ],
        bullets: ["Heizung und Sensorik sind oft schnelle Einstiege", "Licht und Rollläden hängen stärker von vorhandenen Schaltern ab", "Netzwerk und Funkabdeckung entscheiden über Stabilität"],
      },
      {
        id: "funkstandards",
        title: "Funklösungen: Zigbee, WLAN, Matter und Thread",
        body: [
          "Zigbee und Thread arbeiten meist energieeffizient und eignen sich gut für Sensoren, Taster und Thermostate. WLAN-Geräte sind schnell eingebunden, belasten bei vielen Geräten aber das Heimnetz stärker. Matter kann helfen, Geräte verschiedener Hersteller einheitlicher einzubinden, löst aber nicht automatisch jedes Kompatibilitätsproblem.",
          "Für ein Einfamilienhaus ist wichtig, dass Funk nicht nur im Technikraum gut funktioniert. Keller, Anbau, massive Decken und ältere Bausubstanz können Reichweite und Zuverlässigkeit deutlich beeinflussen.",
        ],
      },
      {
        id: "funktionen",
        title: "Heizung, Licht, Rollläden und Sensoren nachrüsten",
        body: [
          "Smarte Heizkörperthermostate ermöglichen Zeitpläne und raumweise Steuerung. Fenstersensoren können die Heizung ergänzen und Meldungen auslösen. Bewegungsmelder helfen bei Flur, Eingang, Keller oder Nachtlicht.",
          "Lichtsteuerung ohne große Umbauten ist möglich, wenn passende Leuchtmittel, smarte Schalter oder geeignete Unterputzmodule genutzt werden können. Rollladensteuerung hängt davon ab, ob Motoren vorhanden sind und wie die Schalter verdrahtet wurden.",
        ],
        bullets: ["Fensterkontakte für Heizung und Sicherheit", "Bewegungsmelder für Komfort und Orientierung", "Rollläden nur nach Prüfung von Motor und Verdrahtung"],
      },
      {
        id: "grenzen",
        title: "Grenzen von Funklösungen und wann KNX sinnvoller ist",
        body: [
          "Funk ist kein Makel. Aber Funk braucht Planung. Batterien, Reichweite, Mesh-Struktur, Updates und Herstellerabhängigkeiten müssen berücksichtigt werden.",
          "Wenn ohnehin saniert wird, Wände geöffnet werden oder ein Neubau geplant ist, kann eine kabelgebundene Basis wie KNX langlebiger und stabiler sein. Für viele Bestandsobjekte ist eine Mischung sinnvoll: robuste feste Funktionen dort, wo es passt, flexible Funkkomponenten dort, wo Umbau unverhältnismäßig wäre.",
        ],
      },
    ],
    faqs: [
      { question: "Kann man Smart Home ohne neue Kabel nachrüsten?", answer: "Ja, viele Funktionen lassen sich per Funk nachrüsten. Wichtig sind Funkabdeckung, Stromversorgung, kompatible Geräte und eine saubere zentrale Struktur." },
      { question: "Welche Systeme eignen sich für Bestandsimmobilien?", answer: "Häufig eignen sich Home Assistant, Zigbee-, Thread-, Matter- oder ausgewählte Herstellersysteme. Die Wahl hängt vom Objekt und den gewünschten Funktionen ab." },
      { question: "Brauche ich für Smart Home einen Elektriker?", answer: "Für Thermostate, Sensoren und App-Einrichtung oft nicht. Bei Unterputzmodulen, Rollladenmotoren, Schaltschrank oder 230V-Arbeiten ist ein Elektriker nötig." },
      { question: "Was kostet eine Smart-Home-Nachrüstung?", answer: "Das hängt stark vom Umfang ab. Ein Einstieg mit Heizung und Sensorik ist deutlich günstiger als Licht, Rollläden, Sicherheit und zentrale Visualisierung im ganzen Haus." },
      { question: "Ist Funk-Smart-Home zuverlässig?", answer: "Ja, wenn es sauber geplant wird. Zuverlässigkeit hängt von Funkstandard, Gebäude, Reichweite, Batterien, Netzwerk und Systempflege ab." },
    ],
    serviceLinks: [
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      { label: "Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      { label: "Smarte Heizungssteuerung", href: "/energiemanagement-heizung" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Nienburg", href: "/smart-home-nienburg" },
    ],
    guideLinks: [
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
      { label: "Smart Home Rollladensteuerung", href: "/ratgeber/smart-home-rollladensteuerung-beschattung" },
      { label: "Home Assistant einrichten lassen", href: "/ratgeber/home-assistant-professionell-einrichten-lassen" },
      { label: "Smart Home für Senioren", href: "/ratgeber/smart-home-fuer-senioren" },
      { label: "Smart Home Fehler vermeiden", href: "/ratgeber/smart-home-fehler-vermeiden" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smarte Heizkörperthermostate", href: "/ratgeber/smarte-heizkoerperthermostate-heizungssteuerung" },
    ],
    finalCta:
      "Sie möchten Ihr Haus in Hannover, Nienburg oder Umgebung smart nachrüsten? Heimlogik unterstützt bei Planung, Systemauswahl und Einrichtung.",
  },
  {
    slug: "knx-oder-home-assistant",
    path: "/ratgeber/knx-oder-home-assistant",
    title: "KNX oder Home Assistant - welches System passt besser zum Einfamilienhaus?",
    metaTitle: "KNX oder Home Assistant? Vergleich | Heimlogik",
    metaDescription:
      "KNX und Home Assistant verständlich verglichen: Neubau, Bestand, Kosten, Wartung, Kombination und Empfehlung.",
    category: "KNX, Home Assistant & Systeme",
    excerpt:
      "Der ehrliche Vergleich zwischen kabelgebundener Gebäudebasis und offener Integrationsplattform - inklusive sinnvoller Kombination.",
    intro:
      "KNX und Home Assistant werden oft gegeneinander gestellt, erfüllen aber unterschiedliche Aufgaben. KNX ist eine professionelle Gebäudebasis. Home Assistant ist eine flexible Integrationsplattform, die viele Systeme zusammenführt. In guten Projekten können beide zusammen sehr sinnvoll sein.",
    image: "/images/ratgeber/knx-vs-home-assistant-vergleich.svg",
    imageAlt:
      "Vergleichsgrafik von KNX als kabelgebundener Basis und Home Assistant als zentrale Integrationsplattform",
    graphicTitle: "KNX vs. Home Assistant",
    localNote:
      "Für Neubauten und Sanierungen in der Region Hannover ist die Systementscheidung besonders wichtig, weil sie vor der Elektroplanung getroffen werden sollte.",
    sections: [
      {
        id: "was-ist-knx",
        title: "Was ist KNX?",
        body: [
          "KNX ist ein kabelgebundenes Bussystem für Gebäudeautomation. Taster, Sensoren und Aktoren kommunizieren über eine eigene Busleitung. Dadurch entstehen robuste Grundfunktionen für Licht, Beschattung, Heizung und Szenen.",
          "Im Neubau oder bei größerer Sanierung ist KNX oft interessant, weil Leitungen, Verteilungen und Funktionen von Anfang an geplant werden können.",
        ],
      },
      {
        id: "was-ist-home-assistant",
        title: "Was ist Home Assistant?",
        body: [
          "Home Assistant ist eine offene Smart-Home-Plattform. Sie verbindet Geräte, Schnittstellen und Dienste verschiedener Hersteller in einer Oberfläche. Besonders stark ist Home Assistant, wenn bereits unterschiedliche Systeme vorhanden sind oder Funkgeräte, Energie, Audio und Visualisierung zusammengeführt werden sollen.",
          "Der Vorteil liegt in Flexibilität. Die Verantwortung liegt dafür stärker bei sauberer Einrichtung, Updates und Dokumentation.",
        ],
      },
      {
        id: "vergleich",
        title: "Bus-System oder Integrationsplattform?",
        body: [
          "KNX bildet eine feste Gebäudebasis. Home Assistant verbindet und visualisiert Systeme. Ein KNX-Taster kann auch ohne Cloud zuverlässig das Licht schalten. Home Assistant kann zusätzlich Energieflüsse, Wetterdaten, Audio, Apps, Sensoren und Szenen elegant zusammenführen.",
          "Deshalb ist die Frage selten: entweder oder. Häufig lautet sie: Welche Grundfunktionen brauchen eine robuste Basis, und welche Funktionen sollen flexibel integriert werden?",
        ],
        bullets: ["KNX: stark im Neubau und bei festen Gebäudefunktionen", "Home Assistant: stark bei Integration, Visualisierung und Nachrüstung", "Kombination: oft die beste Lösung für anspruchsvolle Häuser"],
      },
      {
        id: "kosten-wartung",
        title: "Kosten, Wartung und Zukunftssicherheit",
        body: [
          "KNX verursacht im Neubau höhere Planungs- und Installationskosten, kann aber über viele Jahre sehr stabil betrieben werden. Home Assistant ist beim Einstieg oft günstiger und flexibler, braucht aber ein gutes Konzept für Wartung, Backups und Updates.",
          "Zukunftssicher ist nicht das System mit den meisten Logos auf der Verpackung. Zukunftssicher ist eine Lösung, die dokumentiert, erweiterbar und im Alltag verständlich bleibt.",
        ],
      },
    ],
    faqs: [
      { question: "Ist KNX besser als Home Assistant?", answer: "Nicht grundsätzlich. KNX ist besser als robuste Gebäudebasis, Home Assistant besser als flexible Integrationsplattform. Die passende Wahl hängt vom Objekt ab." },
      { question: "Kann man KNX mit Home Assistant verbinden?", answer: "Ja. Home Assistant kann KNX einbinden und um Visualisierung, Automationen und weitere Systeme ergänzen." },
      { question: "Was ist besser für einen Neubau?", answer: "Für feste Gebäudefunktionen ist KNX im Neubau oft sehr sinnvoll. Home Assistant kann ergänzend für Visualisierung und Integration eingesetzt werden." },
      { question: "Was ist besser für eine Bestandsimmobilie?", answer: "Im Bestand ist Home Assistant mit ausgewählten Funklösungen häufig flexibler. Bei Sanierung kann KNX trotzdem sinnvoll sein." },
      { question: "Ist Home Assistant professionell genug?", answer: "Ja, wenn es sauber geplant, dokumentiert und gewartet wird. Für kritische Grundfunktionen kann eine robuste kabelgebundene Basis trotzdem sinnvoll sein." },
    ],
    serviceLinks: [
      { label: "KNX & Home Assistant Hannover", href: "/knx-home-assistant-systemintegration" },
      { label: "Smart Home Neubau Planung", href: "/smart-home-planung" },
      { label: "Smart Home Nachrüstung", href: "/smart-home-nachruesten" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
      { label: "Smart Home Neustadt am Rübenberge", href: "/smart-home-neustadt-am-ruebenberge" },
    ],
    guideLinks: [
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Home Assistant einrichten lassen", href: "/ratgeber/home-assistant-professionell-einrichten-lassen" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
      { label: "Smart Home Lichtsteuerung", href: "/ratgeber/smart-home-lichtsteuerung-szenen-dali-praesenzmelder" },
      { label: "Energiemanagement mit PV und Wallbox", href: "/ratgeber/smart-home-photovoltaik-wallbox-energiemanagement" },
      { label: "KNX im Neubau planen", href: "/ratgeber/knx-planung-neubau-elektro-taster-verteiler" },
      { label: "Smart Home Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
    ],
    finalCta:
      "Heimlogik hilft Ihnen, das passende System für Ihr Haus zu planen - herstellerunabhängig und verständlich.",
  },
  {
    slug: "was-kostet-ein-smart-home",
    path: "/ratgeber/was-kostet-ein-smart-home",
    title: "Was kostet ein Smart Home im Einfamilienhaus?",
    metaTitle: "Was kostet ein Smart Home? | Heimlogik",
    metaDescription:
      "Realistische Smart-Home-Kosten für Einfamilienhäuser: Nachrüstung, KNX, Home Assistant, Planung und Kostentreiber.",
    category: "Smart Home Grundlagen",
    excerpt:
      "Kostenbereiche ohne Scheinpräzision: Welche Funktionen den Preis treiben und warum billige DIY-Lösungen später teuer werden können.",
    intro:
      "Smart-Home-Kosten lassen sich nicht seriös mit einem einzigen Quadratmeterpreis beantworten. Ein Haus mit smarter Heizung und Sensorik ist ein anderes Projekt als ein Neubau mit KNX, Audio, Sicherheit, Energie und Visualisierung. Sinnvoll ist eine Einordnung nach Ausbaustufen und Kostentreibern.",
    image: "/images/ratgeber/smart-home-kosten-einfamilienhaus.svg",
    imageAlt:
      "Kostenübersicht für Smart Home im Einfamilienhaus mit Einstiegs-, Komfort- und Premium-Stufe",
    graphicTitle: "Smart-Home-Kosten im Einfamilienhaus",
    localNote:
      "Für Häuser in Hannover, Nienburg, Wunstorf und Umgebung sind Bestand, Baujahr und Elektrostruktur oft entscheidender als die reine Wohnfläche.",
    sections: [
      {
        id: "keine-pauschalpreise",
        title: "Warum es keine ehrlichen Pauschalpreise gibt",
        body: [
          "Zwei Häuser mit gleicher Wohnfläche können völlig unterschiedliche Anforderungen haben. Anzahl der Lichtkreise, Rollläden, Heizungszonen, Netzwerkpunkte, Sensoren, Audiozonen und gewünschte Visualisierung verändern Aufwand und Material deutlich.",
          "Eine seriöse Einschätzung beginnt deshalb mit Objekt, Prioritäten und Systementscheidung - nicht mit einem Warenkorb aus Einzelgeräten.",
        ],
      },
      {
        id: "kostentreiber",
        title: "Die wichtigsten Kostentreiber",
        body: [
          "Licht, Beschattung und Sicherheit benötigen oft mehr Abstimmung als einzelne Thermostate. KNX, DALI, Touchpanel, Audio, Energiemanagement und hochwertige Visualisierung erhöhen den Projektumfang, können aber im Neubau sauber vorbereitet werden.",
          "Planungskosten sind kein lästiger Zusatz. Sie verhindern Fehlkäufe, doppelte Arbeit und Systeme, die nach einem Jahr niemand mehr pflegen möchte.",
        ],
        bullets: ["Anzahl der Räume und Funktionen", "Funklösung oder kabelgebundenes System", "Neubau, Sanierung oder Bestand", "Visualisierung, Audio, Sicherheit und Energie"],
      },
      {
        id: "ausbaustufen",
        title: "Realistische Ausbaustufen als Orientierung",
        body: [
          "Einstieg bedeutet meist Heizung, einzelne Sensoren, einfache Lichtfunktionen und eine saubere App-Struktur. Komfort umfasst Rollläden, Szenen, Visualisierung und mehrere Gewerke. Premium-Projekte verbinden KNX, Audio, Sicherheit, Energie, Touchpanels und durchdachte Bedienung.",
          "Exakte Preise entstehen erst nach Prüfung. Wichtig ist, dass jede Stufe technisch erweiterbar geplant wird.",
        ],
      },
      {
        id: "diy-kosten",
        title: "Warum günstige DIY-Lösungen später teuer werden können",
        body: [
          "Einzelgeräte wirken günstig, solange jedes Gerät allein betrachtet wird. Teuer wird es, wenn Apps, Bridges, Benutzerkonten und Automationen nicht zusammenpassen oder bei jedem Update neu angefasst werden müssen.",
          "Professionelle Planung spart nicht automatisch Materialkosten. Sie spart aber oft Fehlentscheidungen und macht das System langfristig verständlicher.",
        ],
      },
    ],
    faqs: [
      { question: "Was kostet Smart Home für ein Einfamilienhaus?", answer: "Das hängt vom Umfang ab. Einfache Nachrüstung kostet deutlich weniger als eine komplette Gebäudeautomation mit KNX, Audio, Sicherheit und Energie." },
      { question: "Ist Smart Home im Neubau günstiger als nachträglich?", answer: "Nicht immer absolut günstiger, aber oft effizienter planbar. Leitungen, Technikraum und Schnittstellen können früh vorbereitet werden." },
      { question: "Was kostet Home Assistant einrichten lassen?", answer: "Der Aufwand hängt von vorhandenen Geräten, Integrationen, Automationen und Dokumentation ab. Eine kleine Integration ist ein anderes Projekt als ein ganzes Haus." },
      { question: "Was kostet KNX im Haus?", answer: "KNX hängt stark von Anzahl der Gewerke, Aktoren, Taster, Sensoren, Verteilerplanung und Programmierung ab. Eine Planprüfung ist vor Preisannahmen sinnvoll." },
      { question: "Welche Smart-Home-Funktionen lohnen sich zuerst?", answer: "Häufig Heizung, Beschattung, Licht in viel genutzten Bereichen, Sensorik und eine klare zentrale Bedienung." },
    ],
    serviceLinks: [
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      { label: "KNX & Home Assistant", href: "/knx-home-assistant-systemintegration" },
      { label: "Multiroom Audio", href: "/hifi-audio-tv-integration" },
      { label: "Smarte Heizung", href: "/energiemanagement-heizung" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Leese", href: "/smart-home-leese" },
    ],
    guideLinks: [
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
      { label: "Multiroom Audio im Smart Home", href: "/ratgeber/multiroom-audio-smart-home-sonos-bose-kabel" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
    ],
    finalCta:
      "Sie möchten eine realistische Einschätzung für Ihr Haus? Heimlogik prüft, welche Lösung technisch und wirtschaftlich sinnvoll ist.",
  },
  {
    slug: "smart-home-neubau-planung",
    path: "/ratgeber/smart-home-neubau-planung",
    title: "Smart Home im Neubau planen - was muss vor der Elektroplanung entschieden werden?",
    metaTitle: "Smart Home im Neubau planen | Heimlogik",
    metaDescription:
      "Smart Home im Neubau richtig vorbereiten: KNX, Netzwerk, Licht, Rollläden, Heizung, Audio und typische Fehler.",
    category: "Smart Home Grundlagen",
    excerpt:
      "Welche Entscheidungen vor der Elektroplanung fallen sollten, damit Kabel, Technikraum, Taster und Gewerke später zusammenpassen.",
    intro:
      "Im Neubau wird Smart Home oft zu spät besprochen. Dann sind Lichtkreise, Rollläden, Netzwerk, Technikraum und Tasterpositionen schon geplant - und spätere Wünsche werden unnötig teuer. Wer früh entscheidet, muss nicht alles sofort umsetzen, kann aber die richtigen Grundlagen vorbereiten.",
    image: "/images/ratgeber/smart-home-neubau-planung-grundriss.svg",
    imageAlt:
      "Minimalistische Grundrissgrafik zur Smart-Home-Planung im Neubau mit Technikraum, KNX-Bus, Audiozonen und WLAN",
    graphicTitle: "Smart Home im Neubau richtig vorbereiten",
    localNote:
      "Bei Neubauprojekten in der Region Hannover, Wunstorf und Nienburg ist die Abstimmung mit Elektriker, Bauleitung und Systemintegrator besonders wertvoll.",
    sections: [
      {
        id: "frueh-planen",
        title: "Warum Smart Home vor der Elektroplanung geklärt werden sollte",
        body: [
          "Smart Home beeinflusst Schalter, Taster, Leitungswege, Verteilung, Netzwerk, Sensorik, Rollläden, Heizungszonen und Bedienkonzept. Wenn diese Punkte erst nach der Elektroplanung auftauchen, entstehen Kompromisse.",
          "Eine gute Planung unterscheidet zwischen Funktionen, die sofort eingebaut werden, und Vorbereitungen, die spätere Erweiterungen ermöglichen.",
        ],
      },
      {
        id: "entscheidungen",
        title: "KNX, Netzwerk, DALI, Präsenzmelder und Taster",
        body: [
          "Für viele Neubauten ist eine kabelgebundene Basis sinnvoll: KNX für Gebäudefunktionen, Netzwerkkabel für stabile Datenpunkte, optional DALI für hochwertige Lichtsteuerung. Präsenzmelder und Taster sollten nicht nach Optik allein geplant werden, sondern nach Alltagssituationen.",
          "Wichtig ist auch ein Technikraum mit Platz für Netzwerkschrank, Verteilung, Server, Gateways und spätere Erweiterungen.",
        ],
        bullets: ["KNX-Bus und Verteilung früh einplanen", "WLAN Access Points per Kabel vorbereiten", "Rollläden, Lichtkreise und Heizungszonen sauber strukturieren"],
      },
      {
        id: "audio-sicherheit",
        title: "Audio, Visualisierung und Sicherheit vorbereiten",
        body: [
          "Multiroom Audio, Touchpanel, Kameras, Türkommunikation und Sicherheitsfunktionen brauchen Montagepunkte, Netzwerk, Strom und eine saubere Rechte- und Bedienlogik.",
          "Nicht jedes Zimmer braucht alles. Aber kritische Kabelwege sind nach dem Innenausbau schwer nachzuholen.",
        ],
      },
      {
        id: "checkliste",
        title: "Checkliste für Bauherren",
        body: [
          "Vor der Elektrofreigabe sollten Sie mindestens klären: Welche Räume brauchen welche Lichtkreise? Welche Rollläden oder Jalousien sollen steuerbar sein? Welche Heizungszonen gibt es? Wo sitzen Präsenzmelder, Taster, Access Points, Touchpanel und Technikschrank?",
          "Typische Fehler sind zu wenige Netzwerkleitungen, unklare Zuständigkeiten, fehlende Dokumentation und zu spät geplante Beschattung oder Audiozonen.",
        ],
        bullets: ["Funktionsliste je Raum erstellen", "Netzwerk und WLAN professionell planen", "Technikraum nicht zu klein dimensionieren", "Elektriker und Systemintegrator früh abstimmen"],
      },
    ],
    faqs: [
      { question: "Wann sollte man Smart Home im Neubau planen?", answer: "Vor der finalen Elektroplanung. Dann können Leitungen, Taster, Sensoren, Verteiler und Technikraum sinnvoll vorbereitet werden." },
      { question: "Muss der Elektriker Smart Home können?", answer: "Er sollte die Anforderungen verstehen und sauber umsetzen können. Die Systemlogik kann ein spezialisierter Integrator planen und programmieren." },
      { question: "Welche Kabel sollte man vorbereiten?", answer: "Typisch sind KNX-Bus, Netzwerkkabel, Leitungen für Rollläden, Lichtkreise, Präsenzmelder, Access Points, Türkommunikation und Audiozonen." },
      { question: "Ist KNX im Neubau sinnvoll?", answer: "Oft ja, besonders bei vielen festen Gebäudefunktionen. Ob es passt, hängt von Anspruch, Budget und Erweiterungswunsch ab." },
      { question: "Sollte man Multiroom Audio direkt mitplanen?", answer: "Ja, zumindest die Vorbereitung. Lautsprecherpositionen, Kabelwege, Netzwerk und Zonen lassen sich im Rohbau deutlich sauberer planen." },
    ],
    serviceLinks: [
      { label: "Smart Home Neubau Planung", href: "/smart-home-planung" },
      { label: "KNX & Home Assistant", href: "/knx-home-assistant-systemintegration" },
      { label: "Multiroom Audio", href: "/hifi-audio-tv-integration" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Gebäudeautomation", href: "/gebaeudeautomation-gewerbe" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
    ],
    guideLinks: [
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
      { label: "KNX im Neubau planen", href: "/ratgeber/knx-planung-neubau-elektro-taster-verteiler" },
      { label: "Multiroom Audio im Smart Home", href: "/ratgeber/multiroom-audio-smart-home-sonos-bose-kabel" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home Lichtsteuerung", href: "/ratgeber/smart-home-lichtsteuerung-szenen-dali-praesenzmelder" },
      { label: "Smart Home Rollladensteuerung", href: "/ratgeber/smart-home-rollladensteuerung-beschattung" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Smart Home Fehler vermeiden", href: "/ratgeber/smart-home-fehler-vermeiden" },
      { label: "Was kostet ein Smart Home?", href: "/ratgeber/was-kostet-ein-smart-home" },
    ],
    finalCta:
      "Heimlogik unterstützt Bauherren bei der Smart-Home-Planung vor der Elektroinstallation - damit später alles sauber zusammenspielt.",
  },
  {
    slug: "smarte-heizkoerperthermostate-heizungssteuerung",
    path: "/ratgeber/smarte-heizkoerperthermostate-heizungssteuerung",
    title: "Smarte Heizkörperthermostate und Heizungssteuerung - lohnt sich das wirklich?",
    metaTitle: "Smarte Heizkörperthermostate: lohnt es sich?",
    metaDescription:
      "Smarte Thermostate realistisch erklärt: Zeitpläne, Sensoren, Komfort, Energie, Home Assistant und Grenzen günstiger Geräte.",
    category: "Heizung, Energie & Komfort",
    excerpt:
      "Was smarte Thermostate wirklich bringen, wo Energieeinsparung realistisch ist und warum Heizung ins Gesamtsystem gehört.",
    intro:
      "Smarte Heizkörperthermostate sind ein guter Einstieg, wenn sie sauber eingerichtet werden. Sie ersetzen keine gute Heizungsanlage und keine energetische Sanierung. Sie können aber Räume verständlicher steuerbar machen, Komfort erhöhen und unnötiges Heizen reduzieren.",
    image: "/images/ratgeber/smarte-heizungssteuerung-haus.svg",
    imageAlt:
      "Infografik zur smarten Heizungssteuerung mit Räumen, Thermostaten, Fenstersensoren und zentraler Steuerung",
    graphicTitle: "Smarte Heizungssteuerung im Haus",
    localNote:
      "In vielen Bestandsgebäuden in Hannover, Nienburg, Leese und Umgebung ist smarte Heizungssteuerung ein sinnvoller erster Schritt, bevor größere Systeme folgen.",
    sections: [
      {
        id: "funktionen",
        title: "Was smarte Heizkörperthermostate können",
        body: [
          "Smarte Thermostate steuern Heizkörper nach Zeitplan, Raum, Anwesenheit oder Szene. In Verbindung mit Fenstersensoren kann das System erkennen, wenn gelüftet wird. Mit Temperatursensoren lässt sich die gemessene Raumtemperatur genauer einordnen.",
          "Der größte Gewinn liegt oft nicht in spektakulären Automationen, sondern in nachvollziehbaren Profilen: morgens Bad warm, tagsüber Arbeitszimmer passend, nachts Schlafräume kühler.",
        ],
        bullets: ["Zeitpläne und Raumprofile", "Fenster-Offen-Erkennung", "Bedienung per App oder Szene", "Integration in Home Assistant möglich"],
      },
      {
        id: "einsparung",
        title: "Energieeinsparung realistisch einordnen",
        body: [
          "Wer vorher schon sehr diszipliniert geheizt hat, spart weniger als jemand mit dauerhaft zu warmen Räumen. Smarte Thermostate helfen, Fehlbedienung zu reduzieren und Abwesenheit besser abzubilden.",
          "Pauschale Prozentversprechen sind unseriös. Entscheidend sind Gebäudezustand, Heizverhalten, Dämmung, hydraulischer Abgleich und Systemqualität.",
        ],
      },
      {
        id: "fussbodenheizung",
        title: "Fußbodenheizung vs. Heizkörper",
        body: [
          "Heizkörper reagieren schneller und eignen sich gut für Zeitprofile. Fußbodenheizungen sind träger. Dort geht es weniger um kurzfristiges Hoch- und Runterregeln, sondern um saubere Zonen, passende Raumtemperaturen und Schnittstellen zur Regelung.",
          "Bei zentraler Heizungsanlage, Wärmepumpe oder gemischten Systemen sollte die Steuerung nicht isoliert betrachtet werden.",
        ],
      },
      {
        id: "grenzen",
        title: "Grenzen günstiger Thermostate und wann Planung sinnvoll ist",
        body: [
          "Günstige Thermostate können funktionieren, aber App-Qualität, Funkreichweite, Batterielaufzeit, Lautstärke, Adapter und Integrationsfähigkeit unterscheiden sich deutlich.",
          "Professionelle Planung lohnt sich, wenn mehrere Räume, Fenstersensoren, Home Assistant, Ferienwohnung, Fernzugriff oder ein späteres Energiemanagement geplant sind.",
        ],
      },
    ],
    faqs: [
      { question: "Lohnen sich smarte Heizkörperthermostate?", answer: "Oft ja, besonders für mehr Komfort, Raumprofile und bessere Bedienung. Die Einsparung hängt stark vom bisherigen Heizverhalten und Gebäude ab." },
      { question: "Wie viel Energie kann man sparen?", answer: "Das lässt sich nicht pauschal seriös versprechen. Realistisch ist eine bessere Steuerung unnötiger Heizzeiten, aber keine Garantie für feste Prozentwerte." },
      { question: "Funktionieren smarte Thermostate in jedem Haus?", answer: "Nicht immer. Ventile, Adapter, Funkabdeckung, Heizkörperzustand und gewünschtes System müssen passen." },
      { question: "Kann man Fußbodenheizung smart steuern?", answer: "Ja, aber anders als Heizkörper. Wegen der Trägheit geht es um Zonen, Regelung und sinnvolle Schnittstellen statt um kurzfristige Schaltlogik." },
      { question: "Kann man Heizungssteuerung mit Home Assistant verbinden?", answer: "Ja, wenn Geräte und Schnittstellen kompatibel sind. Home Assistant eignet sich gut, um Thermostate, Sensoren und weitere Systeme zusammenzuführen." },
    ],
    serviceLinks: [
      { label: "Smarte Heizung Hannover", href: "/energiemanagement-heizung" },
      { label: "Smart Home Nachrüstung", href: "/smart-home-nachruesten" },
      { label: "Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      { label: "Smarte Heizkörperthermostate installieren", href: "/smarte-heizkoerperthermostate" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Nienburg", href: "/smart-home-nienburg" },
      { label: "Smart Home Leese", href: "/smart-home-leese" },
    ],
    guideLinks: [
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Was kostet ein Smart Home?", href: "/ratgeber/was-kostet-ein-smart-home" },
      { label: "Energiemanagement mit PV und Wallbox", href: "/ratgeber/smart-home-photovoltaik-wallbox-energiemanagement" },
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
    ],
    finalCta:
      "Heimlogik plant smarte Heizungssteuerung nicht als Einzelgerät, sondern als Teil eines sinnvollen Gesamtsystems.",
  },
  {
    slug: "matter-zigbee-wlan-knx-unterschied",
    path: "/ratgeber/matter-zigbee-wlan-knx-unterschied",
    title: "Matter, Zigbee, WLAN oder KNX - welches Smart-Home-System passt zu Ihrem Haus?",
    metaTitle: "Matter, Zigbee, WLAN oder KNX? Smart-Home-Systeme erklärt",
    metaDescription:
      "Matter, Zigbee, WLAN, Thread oder KNX? Heimlogik erklärt die Unterschiede und zeigt, welches Smart-Home-System zu Neubau, Bestand und Nachrüstung passt.",
    category: "KNX, Home Assistant & Systeme",
    excerpt:
      "Matter, Thread, Zigbee, WLAN, KNX und Home Assistant verständlich eingeordnet - damit aus Geräten ein stabiles System wird.",
    intro:
      "Die Systemwahl entscheidet, ob Smart Home im Alltag ruhig funktioniert oder später aus einzelnen Apps, Bridges und Kompromissen besteht. Matter, Zigbee, Thread, WLAN, KNX und Home Assistant sind keine austauschbaren Begriffe. Sie übernehmen unterschiedliche Rollen - und genau das sollte vor dem Kauf verstanden werden.",
    image: "/images/ratgeber/matter-zigbee-wlan-knx-vergleich.svg",
    imageAlt:
      "Vergleichsgrafik zu Matter, Zigbee, WLAN, Thread, KNX und Home Assistant im Smart Home",
    graphicTitle: "Smart-Home-Systeme im Vergleich",
    localNote:
      "Für Einfamilienhäuser in Hannover, Nienburg, Wunstorf, Leese und Neustadt am Rübenberge ist die richtige Systemarchitektur wichtiger als die einzelne Marke auf der Verpackung.",
    sections: [
      {
        id: "systemwahl",
        title: "Warum die Systemwahl so wichtig ist",
        body: [
          "Ein Smart Home besteht nicht nur aus Geräten. Es besteht aus Verbindungen, Bedienlogik, Automationen, Wartung und der Frage, was auch dann noch funktioniert, wenn Internet, App oder Herstellerdienst einmal nicht mitspielen.",
          "Wer ohne Plan kauft, landet schnell bei mehreren Apps, mehreren Benutzerkonten und Automationen, die nur in einer Herstellerwelt funktionieren. Eine gute Systemwahl sortiert deshalb zuerst die Rollen: Funkstandard, Netzwerkgerät, kabelgebundene Gebäudetechnik und zentrale Integrationsplattform.",
        ],
        bullets: ["Funk ist flexibel, braucht aber Reichweitenplanung", "KNX ist robust, braucht frühe Planung", "Home Assistant verbindet Systeme, ersetzt aber keine saubere Architektur"],
      },
      {
        id: "funk-wlan-bus",
        title: "Funk, WLAN, Bus-System und Integrationsplattform",
        body: [
          "Zigbee und Thread sind Funkstandards für energiearme Geräte wie Sensoren, Taster und Thermostate. WLAN-Geräte hängen direkt im Heimnetz und eignen sich eher für Geräte mit eigener Stromversorgung. KNX ist ein kabelgebundenes Bus-System für feste Gebäudefunktionen.",
          "Matter ist kein eigener Funkstandard, sondern ein Verbindungsstandard, der Geräte verschiedener Hersteller besser miteinander sprechen lassen soll. Home Assistant ist wiederum eine Plattform, die viele dieser Welten zusammenführt und sichtbar macht.",
        ],
      },
      {
        id: "standards",
        title: "Matter, Thread, Zigbee, WLAN und KNX kurz erklärt",
        body: [
          "Matter kann die herstellerübergreifende Einbindung erleichtern, garantiert aber nicht automatisch perfekte Automationen. Thread baut ein modernes Funknetz für kompatible Geräte auf. Zigbee ist weit verbreitet und bewährt, verlangt aber eine gute Mesh-Struktur. WLAN ist bequem, kann bei vielen Geräten aber das Heimnetz belasten.",
          "KNX spielt in einer anderen Liga: Es ist kein typisches Nachrüst-Funkprodukt, sondern eine langlebige kabelgebundene Basis für Licht, Beschattung, Heizung und Sensorik. Gerade im Neubau oder bei einer Sanierung kann das sehr sinnvoll sein.",
        ],
      },
      {
        id: "home-assistant",
        title: "Welche Rolle spielt Home Assistant?",
        body: [
          "Home Assistant ist besonders stark, wenn Geräte verschiedener Hersteller, Funkstandards, Energiekomponenten, Audio, Licht und Sensorik in einer Oberfläche zusammengeführt werden sollen. Das ist wertvoll bei Bestandsimmobilien, aber auch als Ergänzung zu KNX im gehobenen Neubau.",
          "Wichtig ist: Home Assistant sollte nicht zur wilden Sammelstelle werden. Es braucht Backups, Dokumentation, klare Räume, sinnvolle Benennung und eine Bedienstruktur, die auch andere Haushaltsmitglieder verstehen.",
        ],
      },
      {
        id: "empfehlung",
        title: "Empfehlung für Einfamilienhäuser, Neubau und gehobene Projekte",
        body: [
          "Für Bestandsimmobilien ist oft eine Kombination aus Home Assistant, Zigbee oder Thread, ausgewählten WLAN-Geräten und sauberer Netzwerkplanung sinnvoll. Für Neubau und größere Sanierung sollte früh geprüft werden, ob KNX als stabile Gebäudebasis vorbereitet wird.",
          "Für gehobene Smart-Home-Projekte ist meist nicht ein einziges System entscheidend, sondern die saubere Aufteilung: feste Gebäudefunktionen robust, flexible Ergänzungen integrierbar, Bedienung zentral und nachvollziehbar. Genau hier lohnt professionelle Planung.",
        ],
        bullets: ["Bestand: flexible Funklösungen mit zentraler Struktur", "Neubau: KNX und Netzwerk früh mitdenken", "Premium: KNX, Home Assistant, Audio, Sicherheit und Energie sauber verbinden"],
      },
    ],
    faqs: [
      { question: "Was ist besser: Matter, Zigbee oder WLAN?", answer: "Das hängt vom Gerät und Einsatz ab. Zigbee und Thread eignen sich gut für Sensoren und Taster, WLAN eher für stromversorgte Einzelgeräte. Matter kann die Einbindung vereinheitlichen." },
      { question: "Ist KNX besser als Funk-Smart-Home?", answer: "KNX ist bei festen Gebäudefunktionen sehr robust, besonders im Neubau. Funk ist flexibler für Bestand und Nachrüstung. Oft ist eine Kombination sinnvoll." },
      { question: "Brauche ich Matter für ein modernes Smart Home?", answer: "Nicht zwingend. Matter kann helfen, ist aber kein Ersatz für gute Planung, stabile Funkabdeckung und sinnvolle Systemstruktur." },
      { question: "Kann Home Assistant verschiedene Systeme verbinden?", answer: "Ja. Home Assistant kann viele Systeme zusammenführen, wenn Schnittstellen und Geräte kompatibel sind und die Einrichtung sauber dokumentiert wird." },
      { question: "Welches Smart-Home-System eignet sich für ein Einfamilienhaus?", answer: "Für Bestand häufig Home Assistant mit ausgewählten Funkstandards. Für Neubau oder Sanierung oft KNX als Basis plus Home Assistant für Visualisierung und Integration." },
    ],
    serviceLinks: [
      { label: "KNX & Home Assistant Hannover", href: "/knx-home-assistant-systemintegration" },
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
    ],
    guideLinks: [
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Smart Home im Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
    ],
    finalCta:
      "Sie sind unsicher, welches System zu Ihrem Haus passt? Heimlogik hilft bei der herstellerunabhängigen Planung und sinnvollen Systemauswahl.",
  },
  {
    slug: "multiroom-audio-smart-home-sonos-bose-kabel",
    path: "/ratgeber/multiroom-audio-smart-home-sonos-bose-kabel",
    title: "Multiroom Audio im Smart Home - Sonos, Bose oder kabelgebundene Lautsprecher?",
    metaTitle: "Multiroom Audio im Smart Home: Sonos, Bose oder Kabel?",
    metaDescription:
      "Multiroom Audio im Smart Home: Heimlogik erklärt Sonos, Bose, kabelgebundene Lautsprecher, Netzwerk-Audio und sinnvolle Planung für Neubau und Bestand.",
    category: "Audio, Licht & Sicherheit",
    excerpt:
      "Wann Funklautsprecher reichen, wann Kabel im Neubau sinnvoll sind und wie Musik, TV und Szenen sauber zusammenspielen.",
    intro:
      "Multiroom Audio klingt nach Musik in jedem Raum. In der Praxis geht es um mehr: Zonen, Bedienung, Netzwerk, Stromversorgung, Lautsprecherpositionen und die Frage, ob Audio mit Licht, TV und Szenen zusammenarbeiten soll. Gerade im Neubau lassen sich viele Fehler vermeiden, im Bestand braucht es dafür realistische Lösungen.",
    image: "/images/ratgeber/multiroom-audio-smart-home-zonen.svg",
    imageAlt:
      "Grafik zu Multiroom Audio im Smart Home mit mehreren Audiozonen, Funklautsprechern und kabelgebundenen Lautsprechern",
    graphicTitle: "Multiroom Audio im Smart Home",
    localNote:
      "Ob Bestandsimmobilie in Nienburg, Neubau in Wunstorf oder Sanierung im Raum Hannover: Audio sollte früh mit Netzwerk, Strom und Bedienung abgestimmt werden.",
    sections: [
      {
        id: "was-ist-multiroom",
        title: "Was ist Multiroom Audio?",
        body: [
          "Multiroom Audio bedeutet, Musik in mehreren Räumen getrennt oder gemeinsam wiederzugeben. Wohnzimmer, Küche, Bad, Terrasse und Arbeitszimmer können eigene Zonen sein. Wichtig ist, dass die Bedienung einfach bleibt und nicht jede Zone eine eigene App-Logik mitbringt.",
          "Im Smart Home kann Audio Teil von Szenen werden: Musik zum Kochen, TV-Abend mit gedimmtem Licht, Terrassenmodus oder eine dezente Anwesenheitssimulation.",
        ],
      },
      {
        id: "funk-oder-kabel",
        title: "Funklautsprecher oder kabelgebundene Lautsprecher?",
        body: [
          "Sonos, Bose und ähnliche Systeme sind im Bestand attraktiv, weil sie ohne Lautsprecherkabel funktionieren. Sie brauchen aber trotzdem Strom, gutes WLAN oder Netzwerk und eine sinnvolle Platzierung.",
          "Kabelgebundene Decken- oder Wandlautsprecher wirken im Neubau aufgeräumter und können zentral über Verstärker im Technikraum versorgt werden. Dafür müssen Kabelwege, Zonen und Geräte früh geplant werden.",
        ],
        bullets: ["Funk: flexibel und gut nachrüstbar", "Kabel: aufgeräumt und stark im Neubau", "Netzwerk: Grundlage für stabile Wiedergabe"],
      },
      {
        id: "technikraum",
        title: "Verstärker, Audiozonen und Technikraum",
        body: [
          "Bei kabelgebundenem Audio laufen Lautsprecherkabel oft im Technikraum oder Netzwerkschrank zusammen. Dort sitzen Verstärker, Streamer und Netzwerkkomponenten. Das ist sauber, braucht aber Platz, Belüftung und eine klare Dokumentation.",
          "Auch bei Funklösungen sollte das Netzwerk ernst genommen werden. Schlechte WLAN-Abdeckung ist einer der häufigsten Gründe für Aussetzer, Verzögerungen oder frustrierende App-Erlebnisse.",
        ],
      },
      {
        id: "szenen",
        title: "Integration in Smart-Home-Szenen",
        body: [
          "Audio wird besonders angenehm, wenn es nicht isoliert läuft. Ein Tastendruck kann Licht, Beschattung, TV und Musik gemeinsam steuern. Im Bad kann morgens eine leise Playlist starten, auf der Terrasse eine eigene Zone aktiv sein.",
          "Sprachsteuerung kann ergänzen, sollte aber nicht die einzige Bedienmöglichkeit sein. Gute Systeme funktionieren auch über App, Taster, Touchpanel oder klare Szenen.",
        ],
      },
      {
        id: "empfehlung",
        title: "Empfehlung für Bestand, Neubau und typische Planungsfehler",
        body: [
          "Im Bestand sind hochwertige Funklautsprecher oder einzelne kabelgebundene Zonen oft sinnvoll. Im Neubau sollte zumindest vorbereitet werden: Lautsprecherpositionen, Kabelwege, Netzwerk, Technikraum und Außenbereiche.",
          "Typische Fehler sind fehlende Steckdosen, zu wenige Netzwerkpunkte, falsch platzierte Lautsprecher, kein Plan für Terrasse oder Bad und eine Bedienung, die nur für Technikfans verständlich ist.",
        ],
      },
    ],
    faqs: [
      { question: "Was ist Multiroom Audio?", answer: "Multiroom Audio verteilt Musik oder Ton auf mehrere Räume oder Zonen, die einzeln oder gemeinsam gesteuert werden können." },
      { question: "Ist Sonos besser als kabelgebundenes Audio?", answer: "Nicht grundsätzlich. Sonos und ähnliche Systeme sind flexibel im Bestand. Kabelgebundene Lösungen sind im Neubau oft aufgeräumter und langfristig robuster planbar." },
      { question: "Kann man Multiroom Audio nachrüsten?", answer: "Ja. Funklautsprecher, Netzwerk-Audio oder einzelne kabelgebundene Zonen lassen sich häufig nachrüsten, wenn Strom und Netzwerk passen." },
      { question: "Brauchen Funklautsprecher trotzdem Strom?", answer: "Ja. Funklautsprecher übertragen Audio drahtlos, benötigen aber in der Regel eine Steckdose und eine stabile Netzwerkverbindung." },
      { question: "Wann sollte man Lautsprecherkabel im Neubau einplanen?", answer: "Vor der Elektroplanung. Dann können Kabelwege, Deckenlautsprecher, Außenbereiche, Technikraum und Verstärker sauber berücksichtigt werden." },
    ],
    serviceLinks: [
      { label: "Multiroom Audio Smart Home", href: "/hifi-audio-tv-integration" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Neustadt am Rübenberge", href: "/smart-home-neustadt-am-ruebenberge" },
    ],
    guideLinks: [
      { label: "Smart Home im Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Was kostet ein Smart Home?", href: "/ratgeber/was-kostet-ein-smart-home" },
    ],
    finalCta:
      "Heimlogik unterstützt bei der Planung von Multiroom Audio, Smart-Home-Steuerung und sinnvoller Integration in Neubau oder Bestandsimmobilie.",
  },
  {
    slug: "smart-home-sicherheit-kameras-sensoren-alarm",
    path: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm",
    title: "Smart Home Sicherheit - Kameras, Sensoren, Anwesenheitssimulation und Alarmfunktionen",
    metaTitle: "Smart Home Sicherheit: Kameras, Sensoren & Alarmfunktionen",
    metaDescription:
      "Smart Home Sicherheit mit Kameras, Sensoren, Anwesenheitssimulation und Alarmfunktionen. Heimlogik erklärt sinnvolle Lösungen für Hausbesitzer.",
    category: "Audio, Licht & Sicherheit",
    excerpt:
      "Wie Sensoren, Kameras, Licht und Benachrichtigungen sinnvoll helfen - und wo die Grenze zur zertifizierten Alarmanlage liegt.",
    intro:
      "Smart-Home-Sicherheit sollte beruhigen, nicht verunsichern. Sensoren, Kameras, Licht, Rollläden und Benachrichtigungen können im Alltag viel Überblick schaffen. Sie ersetzen aber nicht automatisch eine zertifizierte Alarmanlage. Sinnvoll ist eine klare, sachliche Planung statt maximaler Technik an jeder Ecke.",
    image: "/images/ratgeber/smart-home-sicherheit-sensoren-kameras.svg",
    imageAlt:
      "Grafik zur Smart-Home-Sicherheit mit Kameras, Fenstersensoren, Bewegungsmeldern, Außenlicht und zentraler Steuerung",
    graphicTitle: "Smart-Home-Sicherheit im Einfamilienhaus",
    localNote:
      "Für Einfamilienhäuser in Hannover, Leese, Stolzenau, Nienburg und Wunstorf ist häufig eine Mischung aus Sensorik, Lichtlogik und sauberer Benachrichtigung sinnvoll.",
    sections: [
      {
        id: "beitrag",
        title: "Was Smart Home zur Sicherheit beitragen kann",
        body: [
          "Smart Home kann Zustände sichtbar machen: Ist ein Fenster offen? Wurde Bewegung erkannt? Hat jemand geklingelt? Ist Wasser im Hauswirtschaftsraum ausgetreten? Solche Informationen helfen im Alltag und bei Abwesenheit.",
          "Zusätzlich können Szenen reagieren: Licht einschalten, Push-Nachricht senden, Rollläden bewegen oder eine Sirene aktivieren. Entscheidend ist, dass Reaktionen sinnvoll dosiert sind und nicht ständig Fehlalarme auslösen.",
        ],
      },
      {
        id: "alarmanlage",
        title: "Smart-Home-Sicherheit oder zertifizierte Alarmanlage?",
        body: [
          "Eine Smart-Home-Sicherheitslösung ist keine automatisch zertifizierte Alarmanlage. Für Versicherungsanforderungen, hohe Schutzklassen oder verbindliche Alarmaufschaltung braucht es spezialisierte Sicherheitstechnik.",
          "Für viele Eigentümer ist Smart Home trotzdem eine sinnvolle Ergänzung: mehr Überblick, bessere Routinen, Anwesenheitssimulation und schnelle Hinweise auf ungewöhnliche Zustände.",
        ],
      },
      {
        id: "komponenten",
        title: "Fenstersensoren, Bewegungsmelder, Kameras und Außenlicht",
        body: [
          "Tür- und Fenstersensoren sind oft der pragmatische Einstieg. Bewegungsmelder können Flur, Eingang, Garage oder Außenbereiche abdecken. Kameras und Videotürklingeln sollten bewusst positioniert werden, damit Datenschutz, Nachbarschaft und private Bereiche respektiert werden.",
          "Smarte Außenbeleuchtung ist häufig unterschätzt: Gut geplantes Licht kann Wege sicherer machen und Anwesenheit glaubwürdiger simulieren, ohne dramatische Alarmtechnik einzusetzen.",
        ],
        bullets: ["Tür- und Fenstersensoren für Zustände", "Bewegungsmelder für Licht und Hinweise", "Kameras nur mit sauberer Datenschutzplanung"],
      },
      {
        id: "integration",
        title: "Home Assistant als zentrale Sicherheitslogik",
        body: [
          "Home Assistant kann Sensoren, Licht, Rollläden, Kameras und Benachrichtigungen zusammenführen. Dadurch entstehen Regeln, die über einzelne Geräte-Apps hinausgehen: Abwesenheit, Nachtmodus, Urlaub, Fenster offen oder Bewegung im Außenbereich.",
          "Wichtig sind klare Nutzerrechte, sichere Fernzugriffe, Updates und eine Dokumentation. Sicherheitsfunktionen sollten im Alltag nachvollziehbar bleiben.",
        ],
      },
      {
        id: "empfehlung",
        title: "Was sinnvoll ist und was übertrieben ist",
        body: [
          "Sinnvoll sind wenige gut platzierte Sensoren, klare Benachrichtigungen und eine Verbindung mit Licht und Rollläden. Übertrieben ist Technik, die ständig Fehlalarme produziert oder Bewohner mit Meldungen überfordert.",
          "Professionelle Alarmtechnik ist nötig, wenn es um zertifizierten Einbruchschutz, Versicherungsauflagen oder besonders hohe Sicherheitsanforderungen geht. Smart Home kann dann ergänzen, sollte aber nicht ungeprüft ersetzen.",
        ],
      },
    ],
    faqs: [
      { question: "Kann Smart Home eine Alarmanlage ersetzen?", answer: "Nicht automatisch. Smart Home kann informieren und ergänzen, ersetzt aber keine zertifizierte Alarmanlage, wenn diese fachlich oder versicherungstechnisch erforderlich ist." },
      { question: "Welche Sensoren sind für Sicherheit sinnvoll?", answer: "Häufig sind Tür- und Fenstersensoren, Bewegungsmelder, Wassersensoren und ausgewählte Außenkontakte sinnvoll. Die Platzierung ist wichtiger als die Menge." },
      { question: "Sind Kameras am Haus erlaubt?", answer: "Kameras müssen datenschutzkonform ausgerichtet werden. Öffentliche Bereiche, Nachbargrundstücke und private Zonen anderer Personen dürfen nicht einfach überwacht werden." },
      { question: "Wie funktioniert Anwesenheitssimulation?", answer: "Licht, Rollläden und teilweise Audio oder TV werden so gesteuert, dass das Haus bewohnt wirkt. Wichtig ist eine natürliche, nicht starre Logik." },
      { question: "Kann Home Assistant Sicherheitsfunktionen steuern?", answer: "Ja, wenn Geräte und Schnittstellen passen. Home Assistant kann Sensoren, Licht, Rollläden, Kameras und Benachrichtigungen zentral verknüpfen." },
    ],
    serviceLinks: [
      { label: "Smart Home Sicherheit Hannover", href: "/smart-home-sicherheit-zutritt" },
      { label: "Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Nienburg", href: "/smart-home-nienburg" },
    ],
    guideLinks: [
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Smart Home Zutrittskontrolle", href: "/ratgeber/smart-home-zutrittskontrolle-tuerschloss-fingerprint-code" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home für Senioren", href: "/ratgeber/smart-home-fuer-senioren" },
      { label: "Smart Home für Ferienwohnung", href: "/ratgeber/smart-home-ferienhaus-ferienwohnung-airbnb" },
      { label: "Smart Home Lichtsteuerung", href: "/ratgeber/smart-home-lichtsteuerung-szenen-dali-praesenzmelder" },
      { label: "Smart Home Rollladensteuerung", href: "/ratgeber/smart-home-rollladensteuerung-beschattung" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Smart Home Datenschutz", href: "/ratgeber/smart-home-datenschutz-cloud-lokal" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
    ],
    finalCta:
      "Heimlogik plant Smart-Home-Sicherheit als sinnvolle Ergänzung zu Komfort, Licht, Sensorik und zentraler Steuerung - passend zu Ihrem Haus und Alltag.",
  },
  {
    slug: "smart-home-lichtsteuerung-szenen-dali-praesenzmelder",
    path: "/ratgeber/smart-home-lichtsteuerung-szenen-dali-praesenzmelder",
    title: "Smart Home Lichtsteuerung - wie Licht im modernen Zuhause sinnvoll automatisiert wird",
    metaTitle: "Smart Home Lichtsteuerung: Szenen, DALI & Präsenzmelder",
    metaDescription:
      "Smart Home Lichtsteuerung einfach erklärt: Szenen, Bewegungsmelder, Präsenzmelder, DALI, smarte Schalter und Planung für Neubau & Bestand.",
    category: "Audio, Licht & Sicherheit",
    excerpt:
      "Szenen, Präsenzmelder, smarte Schalter und DALI verständlich erklärt - für Licht, das im Alltag hilft statt nur per App schaltbar zu sein.",
    intro:
      "Gute Lichtsteuerung ist im Smart Home eine der Funktionen, die man jeden Tag spürt. Es geht nicht darum, jede Lampe mit einer App zu bedienen. Sinnvoll wird es, wenn Licht per Taster, Szene, Sensor oder Automatik dort reagiert, wo es den Alltag wirklich einfacher macht.",
    image: "/images/ratgeber/smart-home-lichtsteuerung-dali-praesenzmelder.svg",
    imageAlt:
      "Grafik zur Smart Home Lichtsteuerung mit Lichtzonen, Präsenzmeldern, DALI, App-Steuerung und automatischen Szenen",
    graphicTitle: "Smart Home Lichtsteuerung im Einfamilienhaus",
    localNote:
      "In Einfamilienhäusern rund um Hannover, Nienburg, Wunstorf, Leese und Neustadt am Rübenberge hängen gute Lichtlösungen stark davon ab, ob Neubau, Sanierung oder Bestand geplant wird.",
    sections: [
      {
        id: "bedeutung",
        title: "Was smarte Lichtsteuerung bedeutet",
        body: [
          "Smarte Lichtsteuerung bedeutet nicht automatisch bunte Lampen oder Sprache in jedem Raum. Im Alltag geht es um passende Helligkeit, sinnvolle Bedienpunkte, sichere Wege, angenehme Szenen und verlässliche Automatik.",
          "Eine gute Lösung kombiniert klassische Bedienung mit intelligenter Steuerung. Der normale Taster bleibt verständlich, die App ergänzt, Sensoren automatisieren wiederkehrende Situationen.",
        ],
      },
      {
        id: "leuchtmittel-schalter-zentral",
        title: "Smarte Leuchtmittel, smarte Schalter oder zentrale Lichtsteuerung?",
        body: [
          "Smarte Leuchtmittel sind einfach nachrüstbar, können aber unpraktisch werden, wenn der normale Lichtschalter die Stromversorgung trennt. Smarte Schalter oder Unterputzmodule erhalten die gewohnte Bedienung, benötigen aber technische Prüfung und bei 230V-Arbeiten einen Elektriker.",
          "Zentrale Lichtsteuerung ist besonders im Neubau oder bei Sanierung stark. Dort werden Lichtkreise, Taster, Präsenzmelder und gegebenenfalls DALI von Anfang an geplant.",
        ],
        bullets: ["Leuchtmittel: schneller Einstieg", "Smarte Schalter: vertraute Bedienung", "Zentrale Steuerung: sauber für Neubau und Sanierung"],
      },
      {
        id: "szenen-und-sensoren",
        title: "Szenen, Bewegungsmelder und Präsenzmelder",
        body: [
          "Szenen bündeln mehrere Lichtzustände: Kochen, Essen, Fernsehen, Lesen, Nachtlicht oder Abwesenheit. Dadurch wird Licht nicht einzeln geschaltet, sondern passend zur Situation.",
          "Bewegungsmelder reagieren auf deutliche Bewegung und eignen sich gut für Flur, Keller, Garage oder Außenbereiche. Präsenzmelder erkennen feinere Bewegungen und sind sinnvoll in Bad, Arbeitszimmer, Küche oder Bereichen, in denen Menschen länger still sitzen.",
        ],
      },
      {
        id: "dali",
        title: "DALI einfach erklärt",
        body: [
          "DALI ist ein professioneller Standard für Lichtsteuerung. Vereinfacht gesagt können Leuchten oder Leuchtengruppen gezielt angesprochen, gedimmt und in Szenen eingebunden werden. Das ist besonders interessant, wenn viele Lichtkreise, hochwertige Leuchten oder flexible Lichtgruppen geplant sind.",
          "Im Einfamilienhaus lohnt sich DALI vor allem im Neubau oder bei umfassender Sanierung. Im Bestand ist der Aufwand oft höher, dort sind smarte Schalter, ausgewählte Funklösungen oder einzelne Zonen häufig realistischer.",
        ],
      },
      {
        id: "empfehlung",
        title: "Empfehlung für Neubau und Bestand",
        body: [
          "Im Neubau sollte Licht vor der Elektroplanung festgelegt werden: Lichtkreise, Taster, Präsenzmelder, Dimmarten, DALI und Außenlicht. Im Bestand beginnt man meist mit klar begrenzten Bereichen wie Flur, Bad, Wohnzimmer, Außenlicht oder Anwesenheitssimulation.",
          "Typische Fehler sind zu viele App-only-Lösungen, fehlende Taster, schlecht platzierte Sensoren, falsch geplante Lichtkreise und Automationen, die Bewohner eher nerven als unterstützen.",
        ],
        bullets: ["Neubau: Lichtkreise und Sensorik früh planen", "Bestand: Bereiche gezielt nachrüsten", "Sicherheit: Licht mit Sensorik und Rollläden verbinden"],
      },
    ],
    faqs: [
      { question: "Was ist Smart Home Lichtsteuerung?", answer: "Smart Home Lichtsteuerung verbindet Leuchten, Schalter, Sensoren, Szenen und Automationen, damit Licht passend zur Situation bedient oder automatisch gesteuert wird." },
      { question: "Was ist der Unterschied zwischen Bewegungsmelder und Präsenzmelder?", answer: "Bewegungsmelder erkennen größere Bewegungen. Präsenzmelder reagieren feiner und eignen sich besser für Räume, in denen Menschen länger ruhig bleiben." },
      { question: "Wann lohnt sich DALI im Einfamilienhaus?", answer: "DALI lohnt sich vor allem im Neubau oder bei umfassender Sanierung mit vielen Lichtkreisen, Dimmfunktionen und hochwertigen Lichtzonen." },
      { question: "Kann man Lichtsteuerung nachrüsten?", answer: "Ja. Je nach Bestand sind smarte Leuchtmittel, Schalter, Funkmodule, Sensoren oder einzelne Szenen möglich. Feste Elektroarbeiten gehören zum Elektriker." },
      { question: "Sind smarte Lampen oder smarte Schalter besser?", answer: "Smarte Lampen sind einfach, smarte Schalter sind im Alltag oft vertrauter. Die bessere Lösung hängt von Verdrahtung, Leuchten und gewünschter Bedienung ab." },
    ],
    serviceLinks: [
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      { label: "Licht, Rollläden & Beschattung", href: "/licht-rollladen-beschattung" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
    ],
    guideLinks: [
      { label: "Smart Home im Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Smart Home Rollladensteuerung", href: "/ratgeber/smart-home-rollladensteuerung-beschattung" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smart Home im Garten", href: "/ratgeber/smart-home-garten-aussenbereich-bewaesserung-licht" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
    ],
    finalCta:
      "Heimlogik plant Lichtsteuerung nicht als Spielerei, sondern als sinnvollen Teil eines komfortablen und zuverlässigen Smart Homes.",
  },
  {
    slug: "smart-home-netzwerk-wlan-lan-access-points-technikraum",
    path: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum",
    title: "Smart Home Netzwerk planen - warum WLAN allein oft nicht reicht",
    metaTitle: "Smart Home Netzwerk planen: WLAN, LAN & Access Points",
    metaDescription:
      "Ein stabiles Netzwerk ist die Basis für Smart Home. Heimlogik erklärt WLAN, LAN, Access Points, Technikraum, Netzwerkschrank und Planung.",
    category: "Smart Home Grundlagen",
    excerpt:
      "Warum Router-WLAN selten reicht, welche Geräte per LAN sinnvoll sind und wie Technikraum, Access Points und Netzwerkschrank zusammenhängen.",
    intro:
      "Viele Smart-Home-Probleme sehen aus wie Geräteprobleme, sind aber Netzwerkprobleme. Wenn WLAN wackelt, Kameras verzögert laden, Musik aussetzt oder Gateways schlecht erreichbar sind, wirkt das ganze Smart Home unzuverlässig. Deshalb beginnt moderne Hausautomation oft mit einer ehrlichen Netzwerkplanung.",
    image: "/images/ratgeber/smart-home-netzwerk-wlan-lan-access-points.svg",
    imageAlt:
      "Grafik zur Smart Home Netzwerkplanung mit Router, Netzwerkschrank, LAN, Access Points, WLAN und Smart-Home-Zentrale",
    graphicTitle: "Netzwerk als Grundlage für Smart Home",
    localNote:
      "Bei Neubau, Sanierung und Bestandsimmobilien in der Region Hannover, Nienburg, Wunstorf und Leese entscheidet die Netzwerkstruktur oft darüber, ob Smart Home später stabil wirkt.",
    sections: [
      {
        id: "basis",
        title: "Warum das Netzwerk die Basis jedes modernen Smart Homes ist",
        body: [
          "Smart Home besteht aus vielen Verbindungen: Apps, Gateways, Kameras, Fernseher, Audio, Touchpanels, Access Points, Sensorzentralen und teilweise Cloud-Diensten. Je mehr Funktionen hinzukommen, desto wichtiger wird ein stabiles Netzwerk.",
          "Ein einzelner Router im Flur reicht in vielen Einfamilienhäusern nicht aus. Massive Decken, Keller, Anbauten, Technikräume und Außenbereiche brauchen eine geplante Versorgung.",
        ],
      },
      {
        id: "wlan-lan",
        title: "WLAN und LAN sinnvoll aufteilen",
        body: [
          "LAN ist die stabile Kabelverbindung für feste Geräte. WLAN ist wichtig für mobile Geräte und manche Funkkomponenten. Gute Planung bedeutet nicht, alles per Kabel anzuschließen, sondern die richtigen Geräte per Kabel zu entlasten.",
          "Smart TVs, Kameras, Access Points, Touchpanels, Arbeitszimmer, Audio-Komponenten und Technikzentralen profitieren häufig von LAN. Dadurch bleibt WLAN frei für Smartphones, Tablets und bewegliche Geräte.",
        ],
        bullets: ["LAN für feste Geräte", "WLAN für mobile Nutzung", "Access Points statt Router-Hoffnung"],
      },
      {
        id: "access-points",
        title: "Access Points, Mesh-WLAN und professionelle Abdeckung",
        body: [
          "Mesh-WLAN kann im Bestand helfen, ist aber nicht dasselbe wie sauber per LAN angebundene Access Points. Professionelle Access Points werden strategisch platziert und per Netzwerkkabel versorgt.",
          "Im Neubau sollten Access-Point-Positionen früh geplant werden: Decke, Flur, Wohnbereich, Arbeitsbereich, Keller oder Außenbereich. Ziel ist nicht maximale Strahlung, sondern gleichmäßige, zuverlässige Abdeckung.",
        ],
      },
      {
        id: "technikraum",
        title: "Netzwerkschrank, Switch, PoE und Patchpanel einfach erklärt",
        body: [
          "Im Technikraum oder Netzwerkschrank laufen Netzwerkleitungen zusammen. Ein Patchpanel macht die Leitungen sauber anschließbar, ein Switch verteilt die Netzwerkverbindungen. PoE kann Geräte wie Access Points oder Kameras über das Netzwerkkabel mit Strom versorgen.",
          "Das klingt technisch, ist aber für Hausbesitzer vor allem eine Frage der Zukunftssicherheit: genug Platz, saubere Beschriftung, Reserveports und eine nachvollziehbare Struktur.",
        ],
      },
      {
        id: "bestand",
        title: "Netzwerk in Bestandsimmobilien verbessern",
        body: [
          "Im Bestand lassen sich nicht immer überall Kabel ziehen. Trotzdem kann man viel verbessern: Routerposition prüfen, einzelne LAN-Strecken nachziehen, Access Points sinnvoll platzieren, Powerline kritisch prüfen und Funknetze sauber trennen.",
          "Typische Fehler sind versteckte Router im Schaltschrank, zu viele Repeater, unklare Netzwerknamen, fehlende LAN-Dosen im Arbeitszimmer und Außenkameras, die am schwächsten WLAN-Punkt hängen.",
        ],
      },
    ],
    faqs: [
      { question: "Warum ist das Netzwerk für Smart Home so wichtig?", answer: "Viele Smart-Home-Geräte, Apps, Kameras, Audiozonen und Zentralen brauchen stabile Verbindungen. Schwaches Netzwerk führt schnell zu Aussetzern und Fehlfunktionen." },
      { question: "Reicht normales WLAN für Smart Home?", answer: "Für kleine Setups manchmal. Im Einfamilienhaus reicht ein einzelner Router aber oft nicht für stabile Abdeckung in allen Bereichen." },
      { question: "Was ist besser: Mesh-WLAN oder Access Points?", answer: "Per LAN angebundene Access Points sind meist stabiler. Mesh-WLAN kann im Bestand helfen, ist aber stärker von Funkstrecken abhängig." },
      { question: "Welche Geräte sollte man per LAN anschließen?", answer: "Feste Geräte wie Smart TVs, Kameras, Access Points, Touchpanels, Audio-Komponenten, Arbeitsplätze und Smart-Home-Zentralen sind per LAN oft besser angebunden." },
      { question: "Braucht ein Einfamilienhaus einen Netzwerkschrank?", answer: "Bei Neubau, Sanierung oder mehreren Netzwerkdosen ist ein kleiner Netzwerkschrank oft sinnvoll, weil Leitungen, Switch, Router und Smart-Home-Technik sauber zusammenlaufen." },
    ],
    serviceLinks: [
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart Home Neubau Planung", href: "/smart-home-planung" },
      { label: "KNX & Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Nienburg", href: "/smart-home-nienburg" },
    ],
    guideLinks: [
      { label: "Smart Home im Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
      { label: "Multiroom Audio im Smart Home", href: "/ratgeber/multiroom-audio-smart-home-sonos-bose-kabel" },
      { label: "Smart Home für Ferienwohnung", href: "/ratgeber/smart-home-ferienhaus-ferienwohnung-airbnb" },
      { label: "Smart Home Fehler vermeiden", href: "/ratgeber/smart-home-fehler-vermeiden" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smart Home Datenschutz", href: "/ratgeber/smart-home-datenschutz-cloud-lokal" },
      { label: "Smart Home im Garten", href: "/ratgeber/smart-home-garten-aussenbereich-bewaesserung-licht" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
    ],
    finalCta:
      "Heimlogik betrachtet Smart Home nicht isoliert, sondern plant Netzwerk, Steuerung, Sensorik und Bedienung als zusammenhängendes System.",
  },
  {
    slug: "smart-home-photovoltaik-wallbox-energiemanagement",
    path: "/ratgeber/smart-home-photovoltaik-wallbox-energiemanagement",
    title: "Smart Home mit Photovoltaik, Wallbox und Energiemanagement verbinden",
    metaTitle: "Smart Home, Photovoltaik & Wallbox sinnvoll verbinden",
    metaDescription:
      "Smart Home mit Photovoltaik, Wallbox, Speicher und Energiemanagement verbinden: Heimlogik erklärt sinnvolle Automationen und Planung.",
    category: "Heizung, Energie & Komfort",
    excerpt:
      "Wie PV-Anlage, Speicher, Wallbox, Wärmepumpe und Verbraucher im Smart Home sichtbar und sinnvoll steuerbar werden.",
    intro:
      "Energiemanagement wird im Smart Home wichtiger, weil immer mehr Technik im Haus Strom erzeugt, speichert oder verbraucht. Photovoltaik, Wallbox, Speicher, Wärmepumpe und smarte Verbraucher können zusammenarbeiten - wenn Schnittstellen, Prioritäten und Steuerlogik sauber geplant werden.",
    image: "/images/ratgeber/smart-home-photovoltaik-wallbox-energiemanagement.svg",
    imageAlt:
      "Grafik zu Smart Home Energiemanagement mit Photovoltaik, Stromspeicher, Wallbox, Wärmepumpe und zentraler Steuerung",
    graphicTitle: "Energiemanagement im Smart Home",
    localNote:
      "Für Eigentümer in Hannover, Wunstorf, Nienburg, Leese und der Region Hannover ist Energiemanagement besonders spannend, wenn PV, Wallbox oder Wärmepumpe geplant sind.",
    sections: [
      {
        id: "warum",
        title: "Warum Energiemanagement im Smart Home wichtiger wird",
        body: [
          "Früher ging es im Smart Home oft um Licht, Rollläden und Komfort. Heute kommen PV-Anlage, Stromspeicher, Wallbox, Wärmepumpe und variable Verbraucher hinzu. Dadurch entsteht ein neues Ziel: Energieflüsse verstehen und sinnvoll nutzen.",
          "Gutes Energiemanagement verspricht keine Wunder. Es schafft Transparenz, priorisiert Verbraucher und kann helfen, Eigenverbrauch besser zu nutzen.",
        ],
      },
      {
        id: "zusammenspiel",
        title: "Zusammenspiel von PV-Anlage, Speicher, Wallbox und Verbrauchern",
        body: [
          "Eine PV-Anlage erzeugt Strom, der direkt im Haus genutzt, im Speicher abgelegt oder ins Netz eingespeist wird. Eine Wallbox kann abhängig vom PV-Überschuss laden, wenn Auto, Wallbox, Wechselrichter und Steuerung passende Schnittstellen bieten.",
          "Auch Wärmepumpe, Heizungssteuerung, Waschmaschine, Trockner oder andere Verbraucher können zeit- oder überschussabhängig eingebunden werden. Entscheidend ist, welche Geräte steuerbar sind und wie zuverlässig die Schnittstellen arbeiten.",
        ],
        bullets: ["PV-Erzeugung sichtbar machen", "Speicher und Hausverbrauch verstehen", "Wallbox nach Überschuss steuern", "Verbraucher sinnvoll priorisieren"],
      },
      {
        id: "home-assistant",
        title: "Home Assistant als Integrationsplattform",
        body: [
          "Home Assistant kann Wechselrichter, Wallbox, Sensoren, Stromzähler, Heizung und Verbraucher in einer Oberfläche zusammenführen, wenn Integrationen vorhanden sind. Dadurch werden Energieflüsse verständlicher und Automationen möglich.",
          "Wichtig ist die Unterscheidung zwischen Visualisierung und echter Steuerung. Nicht jedes Gerät lässt sich lokal, sicher und zuverlässig regeln. Herstellergrenzen und Updates müssen eingeplant werden.",
        ],
      },
      {
        id: "komfort-energiemanagement",
        title: "Komfortautomation oder echtes Energiemanagement?",
        body: [
          "Eine Komfortautomation schaltet zum Beispiel eine Steckdose nach Zeitplan. Echtes Energiemanagement bewertet Erzeugung, Verbrauch, Speicherstand, Wallbox, Prioritäten und technische Grenzen.",
          "Für viele Einfamilienhäuser reicht ein sinnvoller Zwischenweg: klare Visualisierung, einfache Überschusslogik, Benachrichtigungen und wenige robuste Automationen statt maximal komplexer Regelung.",
        ],
      },
      {
        id: "fehler",
        title: "Typische Fehler bei PV- und Smart-Home-Integration",
        body: [
          "Häufig werden PV, Wallbox, Heizung und Smart Home getrennt geplant. Dann fehlen Schnittstellen, Netzwerkpunkte, Messwerte oder eine zentrale Logik. Auch Cloud-Abhängigkeiten und unklare Datenschutzfragen werden oft zu spät betrachtet.",
          "Wer PV oder Wallbox plant, sollte Netzwerk, Zählerkonzept, lokale Schnittstellen, Herstellerkompatibilität und spätere Erweiterbarkeit früh mitdenken.",
        ],
      },
    ],
    faqs: [
      { question: "Kann man Smart Home mit Photovoltaik verbinden?", answer: "Ja, wenn Wechselrichter, Zähler, Speicher oder Energiemanager passende Schnittstellen bieten. Häufig geht es zunächst um Visualisierung und ausgewählte Automationen." },
      { question: "Wie funktioniert PV-Überschussladen mit Wallbox?", answer: "Die Steuerung erkennt überschüssige PV-Leistung und passt die Ladeleistung der Wallbox an, sofern Wallbox, Messung und Steuerplattform kompatibel sind." },
      { question: "Kann Home Assistant PV-Anlage und Wallbox steuern?", answer: "Home Assistant kann viele PV- und Wallbox-Systeme integrieren. Ob echte Steuerung möglich ist, hängt von Hersteller, Schnittstellen und lokaler Einbindung ab." },
      { question: "Lohnt sich Energiemanagement im Einfamilienhaus?", answer: "Es lohnt sich besonders bei PV, Speicher, Wallbox, Wärmepumpe oder größerem Stromverbrauch. Der Nutzen liegt in Transparenz, Komfort und besserer Eigenverbrauchssteuerung." },
      { question: "Welche Geräte kann man in ein Energiemanagement einbinden?", answer: "Typisch sind PV-Anlage, Speicher, Wallbox, Wärmepumpe, Heizungssteuerung, Stromzähler, smarte Steckdosen, große Verbraucher und Visualisierung." },
    ],
    serviceLinks: [
      { label: "Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Energiemanagement & Heizung", href: "/energiemanagement-heizung" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Leese", href: "/smart-home-leese" },
    ],
    guideLinks: [
      { label: "Smarte Heizkörperthermostate", href: "/ratgeber/smarte-heizkoerperthermostate-heizungssteuerung" },
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
      { label: "Home Assistant einrichten lassen", href: "/ratgeber/home-assistant-professionell-einrichten-lassen" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
      { label: "Wärmepumpe smart steuern", href: "/ratgeber/waermepumpe-smart-home-steuern-pv-heizung" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
    ],
    finalCta:
      "Heimlogik hilft dabei, Photovoltaik, Wallbox, Heizung und Smart Home sinnvoll miteinander zu verbinden - für mehr Transparenz, Komfort und Eigenverbrauch.",
  },
  {
    slug: "smart-home-rollladensteuerung-beschattung",
    path: "/ratgeber/smart-home-rollladensteuerung-beschattung",
    title: "Smart Home Rollladensteuerung und Beschattung - komfortabel, sicher und energieeffizient",
    metaTitle: "Smart Home Rollladensteuerung & Beschattung einfach erklärt",
    metaDescription:
      "Rollläden, Jalousien und Raffstores smart steuern: Heimlogik erklärt App-Steuerung, Zeitpläne, Sensoren, Sonnenschutz und Nachrüstung.",
    category: "Heizung, Energie & Komfort",
    excerpt:
      "Wie Rollläden, Jalousien und Raffstores per App, Taster, Sensor, Zeitplan, KNX oder Home Assistant sinnvoll gesteuert werden.",
    intro:
      "Smarte Rollladensteuerung ist mehr als morgens hoch und abends runter. Richtig geplant schützt Beschattung vor Hitze, unterstützt Privatsphäre, ergänzt Sicherheit und macht den Alltag komfortabler. Entscheidend ist, dass Automationen zum Haus passen und jederzeit verständlich übersteuerbar bleiben.",
    image: "/images/ratgeber/smart-home-rollladensteuerung-beschattung.svg",
    imageAlt:
      "Grafik zur smarten Rollladensteuerung mit Beschattung, Sensoren, App-Steuerung, Zeitplänen und Smart-Home-Zentrale",
    graphicTitle: "Smarte Rollladensteuerung und Beschattung",
    localNote:
      "Ob Bestandsimmobilie in Nienburg, Neubau in Wunstorf oder Sanierung im Raum Hannover: Beschattung sollte mit Sonne, Raumtemperatur, Sicherheit und Bedienung zusammengedacht werden.",
    sections: [
      {
        id: "bedeutung",
        title: "Was smarte Rollladensteuerung bedeutet",
        body: [
          "Smarte Rollladensteuerung verbindet Motoren, Taster, Apps, Zeitpläne, Sensoren und Automationen. Rollläden, Jalousien oder Raffstores können dadurch manuell, zeitabhängig oder abhängig von Sonne, Temperatur und Anwesenheit gesteuert werden.",
          "Wichtig ist eine klare Priorität: Bewohner müssen jederzeit eingreifen können. Eine Automatik darf nicht gegen den Alltag arbeiten, etwa wenn die Terrassentür offen steht oder ein Raum bewusst hell bleiben soll.",
        ],
      },
      {
        id: "systeme",
        title: "Rollläden, Jalousien und Raffstores unterscheiden",
        body: [
          "Rollläden schließen meist flächig und helfen bei Sichtschutz, Verdunklung und Wärmeschutz. Jalousien und Raffstores können Lamellen stellen und dadurch Tageslicht feiner lenken. Diese Unterschiede beeinflussen die Steuerung.",
          "Bei Raffstores sind Windschutz, Lamellenposition und Sonnenschutzlogik wichtiger. Bei Rollläden stehen oft Zeitplan, Anwesenheitssimulation, Sommerhitze und Sicherheit im Vordergrund.",
        ],
        bullets: ["Rollläden: Sichtschutz und Verdunklung", "Raffstores: Lichtlenkung und Hitzeschutz", "Jalousien: flexible Beschattung"],
      },
      {
        id: "steuerung",
        title: "App, Taster, Zeitplan, Sensor oder Automation?",
        body: [
          "Eine gute Lösung kombiniert mehrere Bedienwege. Taster bleiben für Gäste und Familie wichtig. Die App hilft für Übersicht und Fernzugriff. Zeitpläne passen für wiederkehrende Routinen. Sensoren machen Beschattung intelligenter.",
          "Helligkeitssensoren können starke Sonne erkennen, Temperatursensoren unterstützen den sommerlichen Wärmeschutz. In Verbindung mit Licht und Sicherheit entsteht eine glaubwürdige Anwesenheitssimulation.",
        ],
      },
      {
        id: "neubau-bestand",
        title: "Nachrüstung, KNX und Home Assistant",
        body: [
          "Im Bestand hängt Nachrüstung stark davon ab, ob Motoren vorhanden sind und wie Schalter verdrahtet wurden. Funklösungen können sinnvoll sein, bei 230V-Arbeiten ist ein Elektriker nötig. Im Neubau sollten Motoren, Aktoren, Taster, Wetterdaten und Szenen früh geplant werden.",
          "KNX ist für viele Neubauten eine robuste Basis für Beschattung. Home Assistant kann Rollläden, Wetterdaten, Sensoren, Sicherheit und Visualisierung ergänzend zusammenführen.",
        ],
      },
      {
        id: "fehler",
        title: "Typische Fehler bei automatischer Beschattung",
        body: [
          "Häufige Fehler sind starre Zeitpläne ohne Sensorik, fehlende Sperren bei offenen Türen, schlecht platzierte Helligkeitssensoren, zu aggressive Automationen und keine verständliche manuelle Bedienung.",
          "Für Einfamilienhäuser ist meist eine abgestufte Lösung sinnvoll: klare Taster, einfache Zeitlogik, Sensoren für kritische Bereiche und saubere Verbindung mit Licht, Heizung und Sicherheit.",
        ],
      },
    ],
    faqs: [
      { question: "Kann man Rollläden smart nachrüsten?", answer: "Ja, wenn Motoren und Verdrahtung passen. Je nach Bestand sind Funkmodule, smarte Schalter oder zentrale Aktoren möglich. 230V-Arbeiten gehören zum Elektriker." },
      { question: "Was ist besser: Zeitplan oder Sensorsteuerung?", answer: "Beides hat seinen Platz. Zeitpläne sind einfach, Sensorsteuerung reagiert auf Sonne, Temperatur oder Anwesenheit. Oft ist die Kombination am sinnvollsten." },
      { question: "Können Rollläden automatisch bei Sonne schließen?", answer: "Ja, mit Helligkeits- oder Sonnensensoren und passender Logik. Wichtig sind Ausnahmen, etwa bei geöffneten Türen oder bewusst gewünschtem Tageslicht." },
      { question: "Kann Home Assistant Rollläden steuern?", answer: "Ja, wenn die verwendeten Aktoren oder Systeme kompatibel sind. Home Assistant kann Rollläden mit Wetter, Licht, Sicherheit und Szenen verbinden." },
      { question: "Ist Rollladensteuerung im Neubau sinnvoll?", answer: "Ja, besonders wenn Motoren, Taster, Aktoren, KNX oder andere Systeme früh in die Elektroplanung einbezogen werden." },
    ],
    serviceLinks: [
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      { label: "Licht, Rollläden & Beschattung", href: "/licht-rollladen-beschattung" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Neustadt am Rübenberge", href: "/smart-home-neustadt-am-ruebenberge" },
    ],
    guideLinks: [
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Smart Home im Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smart Home Lichtsteuerung", href: "/ratgeber/smart-home-lichtsteuerung-szenen-dali-praesenzmelder" },
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
    ],
    finalCta:
      "Heimlogik plant Rollladensteuerung und Beschattung als Teil eines durchdachten Smart Homes - passend zu Haus, Alltag und Technik.",
  },
  {
    slug: "smart-home-bedienung-app-sprachsteuerung-touchpanel-taster",
    path: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster",
    title: "Smart Home Bedienung - warum ein gutes Bedienkonzept wichtiger ist als viele Geräte",
    metaTitle: "Smart Home Bedienung: App, Sprache, Touchpanel oder Taster?",
    metaDescription:
      "Wie bedient man ein Smart Home sinnvoll? Heimlogik erklärt App, Sprachsteuerung, Touchpanel, klassische Taster und Automationen.",
    category: "Smart Home Grundlagen",
    excerpt:
      "App, Sprache, Touchpanel, Taster und Automationen richtig kombinieren, damit Smart Home für Familie, Gäste und Alltag verständlich bleibt.",
    intro:
      "Ein Smart Home scheitert selten daran, dass zu wenig Technik vorhanden ist. Es scheitert eher daran, dass niemand mehr weiß, welche App, welcher Sprachbefehl oder welche Szene wofür zuständig ist. Ein gutes Bedienkonzept macht Technik unsichtbarer, nicht komplizierter.",
    image: "/images/ratgeber/smart-home-bedienung-app-touchpanel-sprachsteuerung.svg",
    imageAlt:
      "Grafik zur Smart Home Bedienung mit App, Sprachsteuerung, Touchpanel, klassischen Tastern und automatischen Szenen",
    graphicTitle: "Smart Home richtig bedienen",
    localNote:
      "Für Familienhäuser in Hannover, Wunstorf, Nienburg, Leese und der Region Hannover ist Bedienbarkeit oft wichtiger als die Anzahl der integrierten Geräte.",
    sections: [
      {
        id: "erfolg",
        title: "Warum Bedienung über den Erfolg entscheidet",
        body: [
          "Smart Home wird nur genutzt, wenn es verständlich bleibt. Licht, Beschattung, Heizung, Sicherheit und Audio müssen für Bewohner, Kinder, Gäste und manchmal auch Handwerker nachvollziehbar bedienbar sein.",
          "Eine gute Bedienung setzt auf Ebenen: Automationen für wiederkehrende Abläufe, Taster für sofortige Bedienung, App für Übersicht, Sprache für Komfort und Touchpanel für zentrale Funktionen.",
        ],
      },
      {
        id: "app-sprache",
        title: "App-Steuerung und Sprachsteuerung sinnvoll einordnen",
        body: [
          "Apps sind gut für Einrichtung, Überblick, Fernzugriff und seltene Anpassungen. Für jede Alltagshandlung die App zu öffnen, ist dagegen meist unpraktisch.",
          "Sprachsteuerung mit Alexa, Google oder Siri kann angenehm sein, etwa für Musik, Szenen oder einzelne Befehle. Sie sollte aber nie die einzige Bedienung sein, weil Gäste, Kinder, Datenschutz und Fehlverständnisse berücksichtigt werden müssen.",
        ],
      },
      {
        id: "touchpanel-taster",
        title: "Touchpanel, klassische Taster und smarte Schalter",
        body: [
          "Ein Touchpanel im Flur, Wohnbereich oder Technikbereich kann zentrale Funktionen bündeln: Hausstatus, Licht, Beschattung, Heizung, Sicherheit oder Energie. Es ersetzt aber nicht jeden Taster.",
          "Klassische Taster und smarte Schalter bleiben wichtig, weil sie ohne Erklärung funktionieren. Besonders im Neubau sollte daher früh geplant werden, welche Funktionen auf Tastern liegen und welche im Dashboard.",
        ],
        bullets: ["Taster für schnelle Bedienung", "Touchpanel für Übersicht", "App für Details und Fernzugriff"],
      },
      {
        id: "automation",
        title: "Automationen statt ständiger Bedienung",
        body: [
          "Das beste Smart Home muss nicht dauernd aktiv bedient werden. Szenen für Abend, Kochen, Fernsehen, Schlafen, Abwesenheit oder Urlaub reduzieren Einzelbefehle und machen Abläufe ruhiger.",
          "Home Assistant Dashboards können dabei helfen, Räume und Szenen logisch zu strukturieren. Wichtig ist eine klare Benennung, damit nicht zehn ähnlich klingende Szenen entstehen.",
        ],
      },
      {
        id: "fehler",
        title: "Typische Fehler bei der Smart-Home-Bedienung",
        body: [
          "Zu viele Apps, zu technische Dashboards, fehlende Taster, unklare Nutzerrechte und Automationen ohne manuelle Übersteuerung sind typische Probleme. Auch Gäste sollten Licht und Beschattung bedienen können, ohne eine Einweisung in fünf Systeme zu brauchen.",
          "Für hochwertige Einfamilienhäuser ist meist eine Kombination ideal: robuste Grundbedienung per Taster, sinnvolle Automationen, zentrale Visualisierung und App-Steuerung für Details.",
        ],
      },
    ],
    faqs: [
      { question: "Braucht man für Smart Home immer eine App?", answer: "Nein. Eine App ist hilfreich für Übersicht und Einstellungen, aber Alltagsfunktionen sollten auch über Taster, Szenen oder Automationen funktionieren." },
      { question: "Ist Sprachsteuerung im Smart Home sinnvoll?", answer: "Ja, als Ergänzung. Sie eignet sich für Musik, Szenen oder Komfortbefehle, sollte aber nicht die einzige Bedienmöglichkeit sein." },
      { question: "Lohnt sich ein Touchpanel im Haus?", answer: "Ein Touchpanel lohnt sich, wenn mehrere Gewerke zentral sichtbar und bedienbar sein sollen. Es sollte klar strukturiert und nicht überladen sein." },
      { question: "Können klassische Lichtschalter erhalten bleiben?", answer: "Oft ja. Gerade smarte Taster oder klassische Bedienpunkte sind wichtig, damit das Haus intuitiv bedienbar bleibt." },
      { question: "Wie verhindert man App-Chaos im Smart Home?", answer: "Durch eine zentrale Struktur, klare Systemauswahl, sinnvolle Dashboards, wenige Bedienebenen und dokumentierte Automationen." },
    ],
    serviceLinks: [
      { label: "Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart-Home-Planung", href: "/smart-home-planung" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
    ],
    guideLinks: [
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
      { label: "Smart Home Lichtsteuerung", href: "/ratgeber/smart-home-lichtsteuerung-szenen-dali-praesenzmelder" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smart Home für Senioren", href: "/ratgeber/smart-home-fuer-senioren" },
      { label: "Smart Home Fehler vermeiden", href: "/ratgeber/smart-home-fehler-vermeiden" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
      { label: "Was kostet ein Smart Home?", href: "/ratgeber/was-kostet-ein-smart-home" },
    ],
    finalCta:
      "Heimlogik entwickelt Smart-Home-Bedienkonzepte, die im Alltag funktionieren - für Familie, Gäste und langfristige Nutzung.",
  },
  {
    slug: "home-assistant-professionell-einrichten-lassen",
    path: "/ratgeber/home-assistant-professionell-einrichten-lassen",
    title: "Home Assistant professionell einrichten lassen - für wen lohnt sich das?",
    metaTitle: "Home Assistant einrichten lassen - wann lohnt sich das?",
    metaDescription:
      "Home Assistant professionell einrichten lassen: Heimlogik erklärt Vorteile, Kostenfaktoren, Integrationen, Automationen und typische Fehler.",
    category: "KNX, Home Assistant & Systeme",
    excerpt:
      "Wann professionelle Home-Assistant-Einrichtung sinnvoll ist, welche Integrationen möglich sind und warum Struktur wichtiger ist als Basteln.",
    intro:
      "Home Assistant ist mächtig, offen und sehr beliebt. Genau deshalb kann es schnell unübersichtlich werden. Professionelle Einrichtung lohnt sich, wenn aus vielen Geräten ein stabiles, dokumentiertes und alltagstaugliches Smart-Home-System werden soll - nicht nur ein spannendes Bastelprojekt.",
    image: "/images/ratgeber/home-assistant-smart-home-zentrale.svg",
    imageAlt:
      "Grafik zu Home Assistant als Smart-Home-Zentrale mit Licht, Heizung, Rollläden, Sicherheit, Audio, Photovoltaik, Wallbox und KNX",
    graphicTitle: "Home Assistant als Smart-Home-Zentrale",
    localNote:
      "In Bestandsimmobilien und Neubauten rund um Hannover, Nienburg, Wunstorf und Leese ist Home Assistant besonders interessant, wenn verschiedene Systeme zusammengeführt werden sollen.",
    sections: [
      {
        id: "was-ist-home-assistant",
        title: "Was Home Assistant ist und warum es so beliebt ist",
        body: [
          "Home Assistant ist eine offene Smart-Home-Plattform, die Geräte und Systeme verschiedener Hersteller zusammenführt. Licht, Heizung, Rollläden, Sicherheit, Audio, PV, Wallbox, Zigbee, Matter, WLAN und KNX können je nach Schnittstelle eingebunden werden.",
          "Beliebt ist Home Assistant, weil es flexibel ist und lokale Steuerung ermöglicht. Diese Freiheit braucht aber Struktur, sonst entstehen unklare Automationen, doppelte Geräte und Dashboards, die niemand gern nutzt.",
        ],
      },
      {
        id: "diy-professionell",
        title: "DIY-Einrichtung oder professionelle Umsetzung?",
        body: [
          "DIY ist sinnvoll, wenn man gern experimentiert und Zeit für Updates, Backups, Fehleranalyse und Dokumentation einplant. Professionelle Umsetzung ist sinnvoll, wenn das System zuverlässig für Familie, Gäste oder ein hochwertiges Einfamilienhaus funktionieren soll.",
          "Der Unterschied liegt nicht nur in der Installation. Entscheidend sind saubere Namenskonzepte, Räume, Nutzerrechte, Backups, Automationslogik, Visualisierung und Übergabe.",
        ],
        bullets: ["DIY: flexibel, aber zeitintensiv", "Professionell: strukturiert und dokumentiert", "Alltag: Bedienung muss verständlich bleiben"],
      },
      {
        id: "integrationen",
        title: "Welche Geräte und Systeme integriert werden können",
        body: [
          "Typische Integrationen sind Zigbee, Matter, WLAN-Geräte, KNX, Sonos oder andere Audio-Systeme, PV-Anlagen, Wallboxen, Heizungssteuerung, Licht, Rollläden, Sensorik, Kameras und Sicherheitsfunktionen.",
          "Ob eine Integration sinnvoll ist, hängt von Schnittstellen, Stabilität, Datenschutz und Wartbarkeit ab. Nicht jedes Gerät, das technisch eingebunden werden kann, sollte automatisch Teil kritischer Automationen werden.",
        ],
      },
      {
        id: "automation-dashboard",
        title: "Automationen, Dashboards und Datenschutz",
        body: [
          "Gute Automationen bilden echte Alltagssituationen ab: Abwesenheit, Nacht, Urlaub, Lüften, Beschattung, PV-Überschuss oder Sicherheitsmeldungen. Sie sollten nachvollziehbar und manuell übersteuerbar sein.",
          "Dashboards auf Tablet, Smartphone oder Wandpanel müssen klar bleiben. Lokale Steuerung und Datenschutz sind Stärken von Home Assistant, brauchen aber sichere Einrichtung, Updates und Fernzugriffskonzept.",
        ],
      },
      {
        id: "planung",
        title: "Wann professionelle Hilfe sinnvoll ist",
        body: [
          "Professionelle Hilfe lohnt sich, wenn mehrere Systeme verbunden werden, KNX eingebunden wird, PV und Wallbox sichtbar werden sollen, Sicherheitsfunktionen geplant sind oder das Smart Home nicht von einer einzelnen technikaffinen Person abhängig sein soll.",
          "Vorab sollten Ziele, Gerätebestand, Netzwerk, gewünschte Bedienung, Datenschutz, Budgetrahmen und spätere Erweiterungen geklärt werden. Dann kann Home Assistant im Neubau oder Bestand als solide Zentrale aufgebaut werden.",
        ],
      },
    ],
    faqs: [
      { question: "Kann man Home Assistant professionell einrichten lassen?", answer: "Ja. Heimlogik kann Home Assistant strukturiert planen, einrichten, dokumentieren und mit passenden Geräten und Systemen verbinden." },
      { question: "Für wen lohnt sich Home Assistant?", answer: "Home Assistant lohnt sich für Eigentümer, die verschiedene Systeme zentral verbinden, lokal steuern und flexibel erweitern möchten." },
      { question: "Ist Home Assistant zuverlässig genug für ein Einfamilienhaus?", answer: "Ja, wenn Hardware, Netzwerk, Backups, Updates, Dokumentation und Automationen sauber geplant werden. Kritische Grundfunktionen sollten bewusst bewertet werden." },
      { question: "Kann Home Assistant KNX, Zigbee und Matter verbinden?", answer: "Ja, je nach Schnittstellen und Geräten. Home Assistant eignet sich besonders gut als Integrationsplattform zwischen unterschiedlichen Systemen." },
      { question: "Was kostet eine professionelle Home-Assistant-Einrichtung?", answer: "Das hängt von Gerätebestand, Integrationen, Dashboards, Automationen und Dokumentation ab. Eine kleine Einrichtung ist ein anderes Projekt als ein ganzes Haus." },
    ],
    serviceLinks: [
      { label: "Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart-Home-Planung", href: "/smart-home-planung" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Leese", href: "/smart-home-leese" },
    ],
    guideLinks: [
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Energiemanagement mit PV und Wallbox", href: "/ratgeber/smart-home-photovoltaik-wallbox-energiemanagement" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
    ],
    finalCta:
      "Heimlogik richtet Home Assistant nicht als Bastellösung ein, sondern als strukturierte Smart-Home-Zentrale mit sauberer Planung, Dokumentation und alltagstauglichen Automationen.",
  },
  {
    slug: "smart-home-fuer-senioren",
    path: "/ratgeber/smart-home-fuer-senioren",
    title: "Smart Home für Senioren - wie Technik im Alltag wirklich helfen kann",
    metaTitle: "Smart Home für Senioren: Komfort, Sicherheit & Alltagshilfe",
    metaDescription:
      "Smart Home für Senioren: Heimlogik erklärt sinnvolle Lösungen für Sicherheit, Komfort, Licht, Sturzprävention, Erinnerungen und Alltagshilfe.",
    category: "Komfort, Sicherheit & Alltag",
    excerpt:
      "Ruhige, praktische Smart-Home-Lösungen für älter werdende Menschen: Licht, Sensorik, einfache Bedienung und Benachrichtigungen ohne Technikstress.",
    intro:
      "Smart Home für Senioren sollte nicht nach Technikprojekt klingen. Sinnvoll wird es, wenn Licht nachts automatisch hilft, Sensoren unauffällig Sicherheit geben, Angehörige bei wichtigen Ereignissen informiert werden können und die Bedienung einfach bleibt.",
    image: "/images/ratgeber/smart-home-fuer-senioren-alltagshilfe.svg",
    imageAlt:
      "Grafik zu Smart Home für Senioren mit automatischem Licht, Sensoren, einfachen Tastern und Benachrichtigungen",
    graphicTitle: "Smart Home für Senioren im Alltag",
    localNote:
      "Für altersgerechtes Wohnen in Hannover, Nienburg, Wunstorf, Leese und der Region Hannover zählt weniger die Menge der Geräte, sondern eine ruhige Lösung, die im Alltag zuverlässig unterstützt.",
    sections: [
      {
        id: "warum",
        title: "Warum Smart Home für Senioren sinnvoll sein kann",
        body: [
          "Viele ältere Menschen möchten möglichst lange selbstständig wohnen. Smart Home kann dabei helfen, ohne dass das Zuhause wie eine technische Pflegeumgebung wirkt.",
          "Entscheidend sind einfache Routinen: Licht geht automatisch an, Fensterzustände sind sichtbar, Geräte können überwacht werden und Angehörige erhalten nur dann Hinweise, wenn es wirklich sinnvoll ist.",
        ],
      },
      {
        id: "licht-sensoren",
        title: "Automatisches Licht, Nachtlicht und Sensoren",
        body: [
          "Automatisches Licht im Flur, Bad oder Eingangsbereich kann Stolperrisiken reduzieren. Besonders nachts ist ein sanftes Nachtlicht oft hilfreicher als ein heller Schalter, der erst gesucht werden muss.",
          "Tür- und Fenstersensoren können zeigen, ob wichtige Fenster offen geblieben sind. Bewegungsmelder helfen bei Orientierung, ohne permanent Daten zu sammeln oder Kameras einzusetzen.",
        ],
        bullets: ["Nachtlicht für Flur und Bad", "Fensterkontakte für Überblick", "einfache Taster statt App-Zwang"],
      },
      {
        id: "routinen",
        title: "Erinnerungen, Routinen und Geräteüberwachung",
        body: [
          "Smart Home kann Routinen unterstützen: eine Erinnerung, wenn abends noch ein Fenster offen ist, ein Hinweis, wenn ungewöhnlich lange keine Bewegung erkannt wurde, oder eine Statusanzeige für wichtige Geräte.",
          "Herd- und Geräteüberwachung sollte als Konzept sorgfältig geplant werden. Nicht jedes Gerät lässt sich sicher automatisieren. Sinnvoll sind klare Hinweise und abgestimmte Benachrichtigungen statt riskanter Bastellösungen.",
        ],
      },
      {
        id: "angehoerige",
        title: "Angehörige einbinden, ohne Privatsphäre aufzugeben",
        body: [
          "Angehörige können bei ausgewählten Ereignissen informiert werden, etwa bei Wasser, offenem Fenster, ungewöhnlicher Abwesenheit von Bewegung oder aktivem Notfallknopf. Das muss transparent besprochen werden.",
          "Datenschutz und Privatsphäre sind zentral. Eine gute Lösung arbeitet möglichst mit Zuständen und Hinweisen, nicht mit unnötiger Überwachung.",
        ],
      },
      {
        id: "grenzen",
        title: "Komfortlösung oder medizinisches Notrufsystem?",
        body: [
          "Smart Home kann Alltagshilfe leisten, ersetzt aber kein medizinisches Notrufsystem. Wenn medizinische Sicherheit, Pflegeanforderungen oder garantierte Notfallketten nötig sind, müssen spezialisierte Systeme eingeplant werden.",
          "Für Bestandsimmobilien ist häufig eine gezielte Nachrüstung sinnvoll: Licht, Sensorik, einfache Bedienung und ausgewählte Benachrichtigungen. Das kann ohne große Umbauten starten.",
        ],
      },
    ],
    faqs: [
      { question: "Ist Smart Home für Senioren sinnvoll?", answer: "Ja, wenn es einfach bleibt und konkrete Alltagssituationen unterstützt: Licht, Orientierung, Fensterstatus, Benachrichtigung und einfache Bedienung." },
      { question: "Welche Smart-Home-Funktionen helfen älteren Menschen wirklich?", answer: "Häufig helfen automatisches Nachtlicht, Bewegungsmelder, Tür- und Fenstersensoren, Wassersensoren, einfache Taster und ausgewählte Hinweise an Angehörige." },
      { question: "Kann Smart Home beim länger selbstständig Wohnen helfen?", answer: "Es kann unterstützen, ersetzt aber keine Pflege oder medizinische Notrufsysteme. Der Nutzen liegt in Komfort, Orientierung und besseren Informationen." },
      { question: "Brauchen Senioren eine App für Smart Home?", answer: "Nein. Gerade für Senioren sind Taster, Automationen und einfache Routinen oft besser als App-Bedienung." },
      { question: "Kann man Angehörige bei bestimmten Ereignissen benachrichtigen?", answer: "Ja, wenn das gewünscht und transparent abgestimmt ist. Benachrichtigungen sollten gezielt sein und Privatsphäre respektieren." },
    ],
    serviceLinks: [
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart-Home-Planung", href: "/smart-home-planung" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Nienburg", href: "/smart-home-nienburg" },
    ],
    guideLinks: [
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Smart Home Lichtsteuerung", href: "/ratgeber/smart-home-lichtsteuerung-szenen-dali-praesenzmelder" },
    ],
    finalCta:
      "Heimlogik plant Smart-Home-Lösungen, die den Alltag erleichtern, ohne ältere Menschen mit Technik zu überfordern.",
  },
  {
    slug: "smart-home-ferienhaus-ferienwohnung-airbnb",
    path: "/ratgeber/smart-home-ferienhaus-ferienwohnung-airbnb",
    title: "Smart Home für Ferienhaus, Ferienwohnung und Airbnb - weniger Aufwand für Eigentümer",
    metaTitle: "Smart Home für Ferienwohnung & Airbnb: Zutritt, Heizung, Kontrolle",
    metaDescription:
      "Smart Home für Ferienhaus, Ferienwohnung und Airbnb: Zutritt, Heizung, Licht, Sensoren und Fernsteuerung sinnvoll planen.",
    category: "Smart Home für Immobilien & Vermietung",
    excerpt:
      "Fernzugriff, smarter Zutritt, Heizung, Sensoren und einfache Gäste-Bedienung für Ferienwohnungen und Airbnb-Objekte sinnvoll planen.",
    intro:
      "Bei Ferienwohnungen und Ferienhäusern zählt Smart Home vor allem dann, wenn es Aufwand reduziert: weniger Schlüsselstress, bessere Kontrolle bei Leerstand, nachvollziehbare Heizung, hilfreiche Sensoren und eine Bedienung, die Gäste nicht überfordert.",
    image: "/images/ratgeber/smart-home-ferienwohnung-airbnb.svg",
    imageAlt:
      "Grafik zu Smart Home für Ferienwohnung und Airbnb mit Zutritt, Heizung, Sensoren, WLAN und Fernsteuerung",
    graphicTitle: "Smart Home für Ferienwohnung und Airbnb",
    localNote:
      "Für Ferienimmobilien und vermietete Wohnungen in der Region Hannover, Nienburg, Wunstorf, Leese und Umgebung sollte Technik vor allem zuverlässig, fernwartbar und gastfreundlich sein.",
    sections: [
      {
        id: "warum",
        title: "Warum Smart Home bei Ferienimmobilien sinnvoll ist",
        body: [
          "Eigentümer sind nicht immer vor Ort. Smart Home kann helfen, Zustände sichtbar zu machen: Ist die Heizung im Leerstand abgesenkt? Ist ein Fenster offen? Gab es Wasser im Bad? Funktioniert der Zutritt?",
          "Der Mehrwert liegt nicht in maximaler Automatisierung, sondern in weniger Rückfragen, weniger Fahrten und besserer Übersicht.",
        ],
      },
      {
        id: "zutritt",
        title: "Zutritt, Check-in und Check-out",
        body: [
          "Smarte Türschlösser oder Zutrittslösungen können Schlüsselübergaben vereinfachen. Wichtig sind Notfallzugang, Batteriekonzept, klare Gästerechte und eine Bedienung, die auch ohne Technikaffinität funktioniert.",
          "Automationen bei Check-in und Check-out können Heizung, Licht, Gäste-WLAN oder Hinweise unterstützen. Sie sollten aber immer robust und manuell beherrschbar bleiben.",
        ],
        bullets: ["Zutritt ohne Schlüsselstress", "Heizung vor Anreise vorbereiten", "Check-out-Routinen automatisieren"],
      },
      {
        id: "heizung-sensoren",
        title: "Heizung, Licht, Fensterkontakte und Wassersensoren",
        body: [
          "Heizungssteuerung ist bei Leerstand und Anreise besonders wertvoll. Räume müssen nicht dauerhaft warm sein, Gäste sollen aber komfortabel ankommen.",
          "Wasser- und Leckagesensoren sind in Ferienwohnungen oft sehr sinnvoll, weil Schäden sonst spät auffallen. Fensterkontakte und einfache Sicherheitsfunktionen geben zusätzliche Übersicht.",
        ],
      },
      {
        id: "netzwerk-gaeste",
        title: "WLAN, Fernzugriff und einfache Gäste-Bedienung",
        body: [
          "Stabiles WLAN ist Grundlage für Türschloss, Thermostate, Sensoren und Fernzugriff. Gleichzeitig sollte die Gäste-Bedienung möglichst einfach bleiben: klare Taster, verständliche Hinweise und keine komplizierte App-Pflicht.",
          "Kameras sind in Ferienimmobilien besonders sensibel. Innenbereiche sind tabu. Außenbereiche müssen datenschutzkonform und transparent behandelt werden.",
        ],
      },
      {
        id: "empfehlung",
        title: "Empfehlung für Eigentümer",
        body: [
          "Für private Ferienwohnungen reichen oft Zutritt, Heizung, Wasser, Fensterstatus und Gäste-WLAN als solide Basis. Bei gewerblicher Vermietung können Dokumentation, Supportfähigkeit und klare Prozesse wichtiger werden.",
          "Sinnvoll ist eine Lösung, die aus der Ferne wartbar ist, aber Gästen vor Ort möglichst normal erscheint.",
        ],
      },
    ],
    faqs: [
      { question: "Lohnt sich Smart Home für eine Ferienwohnung?", answer: "Oft ja, besonders bei Zutritt, Heizung, Wassersensoren, Fensterstatus und Fernzugriff. Der Nutzen liegt in weniger Aufwand und besserer Übersicht." },
      { question: "Kann man Heizung und Licht aus der Ferne steuern?", answer: "Ja, wenn System, Internetverbindung und Geräte kompatibel sind. Wichtig ist eine zuverlässige Einrichtung und klare Rechteverwaltung." },
      { question: "Sind smarte Türschlösser für Airbnb sinnvoll?", answer: "Sie können sinnvoll sein, wenn Notfallzugang, Batterien, Nutzerrechte und Gästekommunikation sauber geplant sind." },
      { question: "Welche Sensoren sind in Ferienwohnungen hilfreich?", answer: "Hilfreich sind Wasser- und Leckagesensoren, Fensterkontakte, Temperatursensoren und je nach Objekt einfache Sicherheits- oder Zutrittssensoren." },
      { question: "Was muss man beim Datenschutz beachten?", answer: "Kameras und Aufzeichnungen sind besonders sensibel. Innenräume sollten nicht überwacht werden, Außenbereiche brauchen klare rechtliche Prüfung und Transparenz." },
    ],
    serviceLinks: [
      { label: "Ferienwohnung Smart Home", href: "/ferienwohnung-smart-home" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Leese", href: "/smart-home-leese" },
      { label: "Smart Home Stolzenau", href: "/smart-home-stolzenau" },
    ],
    guideLinks: [
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smarte Heizungssteuerung", href: "/ratgeber/smarte-heizkoerperthermostate-heizungssteuerung" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
    ],
    finalCta:
      "Heimlogik hilft Eigentümern, Ferienwohnungen und Ferienhäuser technisch sinnvoll zu automatisieren - ohne komplizierte Bedienung für Gäste.",
  },
  {
    slug: "smart-home-fehler-vermeiden",
    path: "/ratgeber/smart-home-fehler-vermeiden",
    title: "Smart Home Fehler vermeiden - was viele Hausbesitzer zu spät merken",
    metaTitle: "Smart Home Fehler vermeiden: Die häufigsten Planungsfehler",
    metaDescription:
      "Smart Home Fehler vermeiden: Heimlogik zeigt typische Planungsfehler bei WLAN, Apps, Systemwahl, Bedienung, Nachrüstung und Neubau.",
    category: "Planung & Beratung",
    excerpt:
      "Die häufigsten Smart-Home-Fehler von App-Chaos bis schwachem WLAN - und eine Checkliste, wie Planung sie verhindert.",
    intro:
      "Viele Smart-Home-Projekte enttäuschen nicht, weil die Geräte grundsätzlich schlecht sind. Sie enttäuschen, weil vorher keine Struktur geplant wurde. Aus einzelnen Apps, wackligem WLAN und spontanen Gerätekäufen entsteht selten ein System, das im Alltag ruhig funktioniert.",
    image: "/images/ratgeber/smart-home-fehler-vermeiden-planung.svg",
    imageAlt:
      "Grafik zu häufigen Smart-Home-Fehlern wie App-Chaos, schwachem WLAN, falscher Systemwahl und fehlender Planung",
    graphicTitle: "Die häufigsten Smart-Home-Fehler",
    localNote:
      "Ob in Hannover, Wunstorf, Nienburg, Leese oder Neustadt am Rübenberge: Die meisten Smart-Home-Probleme lassen sich vermeiden, wenn System, Netzwerk und Bedienung vor dem Kauf geklärt werden.",
    sections: [
      {
        id: "warum",
        title: "Warum viele Smart-Home-Projekte im Alltag enttäuschen",
        body: [
          "Am Anfang steht oft ein einzelnes Gerät: eine Lampe, ein Thermostat, eine Kamera. Dann kommt die nächste App, die nächste Bridge, ein anderes Funkprotokoll und irgendwann weiß niemand mehr, was womit zusammenhängt.",
          "Smart Home braucht eine Architektur. Ohne sie entstehen Insellösungen, die schwer wartbar sind und im Alltag mehr Aufmerksamkeit verlangen als sie sparen.",
        ],
      },
      {
        id: "apps-struktur-netzwerk",
        title: "Fehler 1 bis 3: Apps, Struktur und Netzwerk",
        body: [
          "Zu viele einzelne Apps sind einer der häufigsten Fehler. Sie machen Bedienung, Nutzerrechte und Automationen unübersichtlich. Genauso problematisch ist fehlende zentrale Struktur: Räume, Namen, Szenen und Zuständigkeiten bleiben ungeklärt.",
          "Ein schwaches Netzwerk lässt gute Geräte schlecht aussehen. Wenn WLAN oder LAN nicht stabil sind, wirken Kameras, Audio, Gateways und Apps unzuverlässig.",
        ],
        bullets: ["weniger Apps, klare Struktur", "Netzwerk zuerst prüfen", "Räume und Szenen sauber benennen"],
      },
      {
        id: "system-elektro-szenen",
        title: "Fehler 4 bis 6: Systemwahl, Elektroplanung und fehlende Szenen",
        body: [
          "Die falsche Systemwahl entsteht, wenn Geräte gekauft werden, bevor Neubau, Bestand, Funkabdeckung, Datenschutz und Erweiterbarkeit bewertet wurden.",
          "Im Neubau ist es ein häufiger Fehler, Smart Home erst nach der Elektroplanung zu besprechen. Ebenso schade: Geräte werden installiert, aber Szenen und Alltagsabläufe nicht geplant.",
        ],
      },
      {
        id: "bedienung-datenschutz-wartung",
        title: "Fehler 7 bis 9: Bedienung, Datenschutz und Wartung",
        body: [
          "Familie, Gäste und Kinder werden oft vergessen. Ein Smart Home muss auch dann funktionieren, wenn niemand die App öffnen möchte.",
          "Datenschutz, Cloud-Abhängigkeiten, Updates, Backups und Sicherheit gehören von Anfang an dazu. Sonst wird das System später zur Dauerbaustelle.",
        ],
      },
      {
        id: "checkliste",
        title: "Checkliste vor dem Kauf von Smart-Home-Geräten",
        body: [
          "Klären Sie vor dem Kauf: Welche Funktionen sollen wirklich helfen? Welche Systeme sind bereits vorhanden? Wie stabil ist das Netzwerk? Wer bedient das Haus? Welche Daten verlassen das Zuhause? Wer wartet Updates und Backups?",
          "Heimlogik verhindert solche Fehler durch Planung: Systemauswahl, Netzwerk, Bedienkonzept, Dokumentation und sinnvolle Prioritäten werden vor der Umsetzung geordnet.",
        ],
      },
    ],
    faqs: [
      { question: "Was sind die häufigsten Smart-Home-Fehler?", answer: "Zu viele Apps, schlechte Netzwerkplanung, falsche Systemwahl, fehlende Bedienlogik, keine Dokumentation und ungeplante Updates oder Backups." },
      { question: "Warum funktioniert Smart Home oft nicht zuverlässig?", answer: "Häufig liegt es an schwachem WLAN, ungeeigneten Geräten, fehlender zentraler Struktur oder Automationen, die nicht sauber geplant wurden." },
      { question: "Wie verhindert man App-Chaos?", answer: "Durch eine zentrale Struktur, klare Systemauswahl, wenige Bedienebenen, sinnvolle Dashboards und dokumentierte Automationen." },
      { question: "Sollte man Smart Home vor dem Gerätekauf planen?", answer: "Ja. Planung verhindert Fehlkäufe und sorgt dafür, dass Geräte, Bedienung und spätere Erweiterungen zusammenpassen." },
      { question: "Wann lohnt sich professionelle Smart-Home-Beratung?", answer: "Wenn mehrere Räume, Gewerke oder Systeme beteiligt sind, Neubau oder Sanierung ansteht oder eine bestehende Lösung unübersichtlich geworden ist." },
    ],
    serviceLinks: [
      { label: "Smart-Home-Planung", href: "/smart-home-planung" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
    ],
    guideLinks: [
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
      { label: "Smart Home im Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Was kostet ein Smart Home?", href: "/ratgeber/was-kostet-ein-smart-home" },
    ],
    finalCta:
      "Heimlogik hilft dabei, Smart Home von Anfang an sauber zu planen - damit Technik im Alltag funktioniert und nicht zur Dauerbaustelle wird.",
  },
  {
    slug: "smart-home-zutrittskontrolle-tuerschloss-fingerprint-code",
    path: "/ratgeber/smart-home-zutrittskontrolle-tuerschloss-fingerprint-code",
    title: "Smart Home Zutrittskontrolle - Türschloss, Fingerprint, Codes und Klingel sinnvoll planen",
    metaTitle: "Smart Home Zutrittskontrolle: Türschloss, Fingerprint & Codes",
    metaDescription:
      "Smart Home Zutrittskontrolle planen: smarte Türschlösser, Fingerprint, Codes, Klingel, Nutzerrechte und Sicherheit verständlich erklärt.",
    category: "Audio, Licht & Sicherheit",
    excerpt:
      "Wie smarter Zutritt im Einfamilienhaus, bei Ferienwohnungen und im Alltag funktioniert - inklusive Sicherheit, Notfallzugang und Bedienung.",
    intro:
      "Smarte Zutrittskontrolle klingt einfach: Tür auf per App, Fingerprint oder Code. In der Praxis entscheidet aber nicht das einzelne Schloss, sondern das Zusammenspiel aus Tür, Stromversorgung, Berechtigungen, Notfallkonzept, Klingel, Netzwerk und Alltagstauglichkeit.",
    image: "/images/ratgeber/smart-home-zutrittskontrolle-tuerschloss-fingerprint-code.svg",
    imageAlt:
      "Grafik zu Smart-Home-Zutrittskontrolle mit Türschloss, Fingerprint, Code-Tastatur, Klingel, App und zentraler Rechteverwaltung",
    graphicTitle: "Smart Home Zutrittskontrolle",
    localNote:
      "In Häusern rund um Hannover, Nienburg, Wunstorf, Leese und Neustadt am Rübenberge lohnt sich bei Zutrittstechnik ein besonders genauer Blick auf Tür, Netzwerk und Notfallbedienung.",
    sections: [
      {
        id: "warum",
        title: "Wann smarter Zutritt wirklich sinnvoll ist",
        body: [
          "Smart-Home-Zutritt ist vor allem dann hilfreich, wenn mehrere Personen regelmäßig ins Haus müssen: Familie, Kinder, Reinigung, Handwerker, Pflege, Feriengäste oder Nachbarn. Temporäre Berechtigungen können Schlüsselübergaben reduzieren und Abläufe transparenter machen.",
          "Der Nutzen entsteht nicht nur durch Komfort. Ein gutes System zeigt, welche Berechtigungen aktiv sind, kann verlorene Schlüssel ersetzen und erleichtert das Verwalten von Gästen oder Dienstleistern.",
        ],
      },
      {
        id: "loesungen",
        title: "Türschloss, Fingerprint, Code, NFC und Klingel",
        body: [
          "Smarte Türschlösser, Motorschlösser, Fingerprint-Leser, Code-Tastaturen, NFC-Transponder und Videoklingeln haben unterschiedliche Stärken. Fingerprint ist bequem, Codes eignen sich gut für zeitlich begrenzte Zugänge, NFC ist oft robust im Alltag.",
          "Wichtig ist, dass die Lösung zur Tür passt. Mehrfachverriegelung, Zylinder, Beschlag, Stromversorgung und mechanischer Schlüsselzugang müssen geprüft werden, bevor Technik bestellt wird.",
        ],
        bullets: ["Tür und Zylinder zuerst prüfen", "Berechtigungen sauber strukturieren", "Klingel und Gegensprechen mitdenken"],
      },
      {
        id: "sicherheit",
        title: "Sicherheit, Nutzerrechte und Notfallzugang",
        body: [
          "Ein smartes Schloss darf nicht nur bequem sein. Es braucht ein klares Rechtekonzept, sichere Konten, nachvollziehbare Protokolle und einen Plan für leere Batterien, Internetausfall oder defekte Geräte.",
          "Für Familien ist außerdem wichtig, wer Berechtigungen ändern darf. Für Vermietung oder Ferienwohnungen zählen zeitlich begrenzte Codes, Sperrlisten und klare Prozesse bei Check-in und Check-out.",
        ],
      },
      {
        id: "alltag",
        title: "Bedienung im Alltag: App ist nicht genug",
        body: [
          "Die Haustür muss auch funktionieren, wenn das Smartphone leer ist, Gäste keine App installieren möchten oder Kinder schnell rein müssen. Deshalb sind Taster, Codes, Transponder, Fingerprint und mechanische Rückfallebene oft wichtiger als eine hübsche App.",
          "Auch Benachrichtigungen sollten gezielt eingesetzt werden. Zu viele Hinweise führen schnell dazu, dass echte Ereignisse nicht mehr beachtet werden.",
        ],
        bullets: ["keine reine App-Abhängigkeit", "Berechtigungen regelmäßig prüfen", "Benachrichtigungen sparsam einsetzen"],
      },
      {
        id: "empfehlung",
        title: "Empfehlung für Einfamilienhaus und Vermietung",
        body: [
          "Im Einfamilienhaus reicht oft eine Kombination aus sicherem Schloss, Fingerprint oder Code, Klingel und einfacher App-Verwaltung. Bei Ferienwohnungen sind temporäre Codes, Fernwartung und Dokumentation besonders wichtig.",
          "Heimlogik plant Zutritt als Teil des Gesamtsystems: Netzwerk, Türtechnik, Nutzerrechte, Datenschutz, Bedienung und Notfallzugang werden zusammen betrachtet.",
        ],
      },
    ],
    faqs: [
      { question: "Sind smarte Türschlösser sicher?", answer: "Sie können sicher sein, wenn Tür, Schloss, Nutzerkonten, Berechtigungen und Notfallzugang sauber geplant sind. Das einzelne Gerät allein entscheidet nicht über Sicherheit." },
      { question: "Was ist besser: Fingerprint oder Code?", answer: "Fingerprint ist bequem für feste Bewohner. Codes sind praktisch für Gäste, Handwerker oder Ferienwohnungen, besonders wenn sie zeitlich begrenzt vergeben werden." },
      { question: "Funktioniert ein smartes Schloss ohne Internet?", answer: "Viele Systeme können lokal oder per Bluetooth weiter funktionieren. Entscheidend ist das konkrete Produkt und ein geplanter Notfallzugang." },
      { question: "Kann man Zutrittsrechte zeitlich begrenzen?", answer: "Ja, viele Systeme erlauben zeitlich begrenzte Codes oder Nutzerrechte. Das ist besonders für Ferienwohnungen und Dienstleister hilfreich." },
      { question: "Brauche ich für Zutrittskontrolle einen Fachpartner?", answer: "Bei einfachen Nachrüstlösungen nicht immer. Bei Motorschloss, Türtechnik, Stromversorgung, Klingelanlage oder Integration ins Smart Home ist Fachplanung sinnvoll." },
    ],
    serviceLinks: [
      { label: "Smart Home Sicherheit & Zutritt", href: "/smart-home-sicherheit-zutritt" },
      { label: "Smart Home Sicherheit", href: "/smart-home-sicherheit" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Ferienwohnung Smart Home", href: "/ferienwohnung-smart-home" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
    ],
    guideLinks: [
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smart Home Ferienwohnung", href: "/ratgeber/smart-home-ferienhaus-ferienwohnung-airbnb" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Smart Home Fehler vermeiden", href: "/ratgeber/smart-home-fehler-vermeiden" },
    ],
    finalCta:
      "Heimlogik plant smarte Zutrittslösungen, die bequem bleiben, ohne Sicherheit, Notfallzugang und Alltagstauglichkeit zu vergessen.",
  },
  {
    slug: "waermepumpe-smart-home-steuern-pv-heizung",
    path: "/ratgeber/waermepumpe-smart-home-steuern-pv-heizung",
    title: "Wärmepumpe smart steuern - PV, Heizung und Komfort im Smart Home verbinden",
    metaTitle: "Wärmepumpe smart steuern: PV, Heizung & Smart Home",
    metaDescription:
      "Wärmepumpe smart steuern: PV-Überschuss, Raumtemperatur, Heizkurve, Schnittstellen und Grenzen im Smart Home verständlich erklärt.",
    category: "Heizung, Energie & Komfort",
    excerpt:
      "Wie Wärmepumpe, Photovoltaik, Raumtemperatur und Energiemanagement zusammenarbeiten können - ohne falsche Sparversprechen.",
    intro:
      "Eine Wärmepumpe wird nicht dadurch besser, dass sie ständig per App geschaltet wird. Sinnvoll wird Smart Home, wenn es Zustände sichtbar macht, Raumkomfort unterstützt, PV-Überschuss einordnet und die Heizungslogik respektiert.",
    image: "/images/ratgeber/waermepumpe-smart-home-pv-heizung.svg",
    imageAlt:
      "Grafik zu Wärmepumpe im Smart Home mit Photovoltaik, Speicher, Raumtemperatur, Heizkreis, Energiemanagement und zentraler Visualisierung",
    graphicTitle: "Wärmepumpe, PV und Smart Home",
    localNote:
      "Für Neubauten und Sanierungen in der Region Hannover, Nienburg und Wunstorf ist die Abstimmung von Wärmepumpe, PV, Netzwerk und Smart Home besonders wichtig.",
    sections: [
      {
        id: "warum",
        title: "Warum Wärmepumpen anders gesteuert werden als alte Heizungen",
        body: [
          "Wärmepumpen arbeiten am effizientesten, wenn sie gleichmäßig und mit niedrigen Vorlauftemperaturen laufen. Kurzes Ein- und Ausschalten wie bei klassischen Heizkörpern ist meist keine gute Strategie.",
          "Smart Home sollte deshalb nicht gegen die Wärmepumpe regeln, sondern Informationen ergänzen: Raumtemperaturen, Fensterstatus, PV-Erzeugung, Speicherstand, Strompreise und Komfortwünsche.",
        ],
      },
      {
        id: "schnittstellen",
        title: "Schnittstellen: Hersteller-App, Modbus, SG Ready und Home Assistant",
        body: [
          "Je nach Hersteller gibt es sehr unterschiedliche Möglichkeiten: Cloud-App, lokale Schnittstelle, Modbus, SG Ready, KNX-Gateway oder Integration über Home Assistant. Nicht jede Schnittstelle erlaubt dieselbe Tiefe der Steuerung.",
          "Vor der Planung sollte geklärt werden, welche Werte gelesen und welche Befehle zuverlässig geschrieben werden können. Sonst entstehen Automationen, die auf dem Papier gut aussehen, aber im Betrieb instabil bleiben.",
        ],
        bullets: ["Schnittstellen vor dem Kauf klären", "lokale Daten bevorzugen, wenn möglich", "Herstellerlogik respektieren"],
      },
      {
        id: "pv",
        title: "PV-Überschuss und Eigenverbrauch sinnvoll nutzen",
        body: [
          "PV-Überschuss kann genutzt werden, um Warmwasser oder Pufferspeicher zu bestimmten Zeiten vorzuziehen. Dabei sollten Komfort, Effizienz und Gerätegrenzen beachtet werden.",
          "Nicht jeder Sonnenstrahl muss sofort eine Aktion auslösen. Gute Logik arbeitet mit Schwellwerten, Mindestlaufzeiten, Wetterprognosen und Prioritäten zwischen Wallbox, Speicher, Warmwasser und Haushaltsverbrauchern.",
        ],
      },
      {
        id: "raumkomfort",
        title: "Raumkomfort, Heizkurve und Fensterkontakte",
        body: [
          "Raumtemperaturen helfen, Komfort sichtbar zu machen. Bei Fußbodenheizung sind schnelle Eingriffe aber meist wirkungslos oder sogar kontraproduktiv, weil das System träge reagiert.",
          "Fensterkontakte können Hinweise geben oder einzelne Räume schützen. Die grundlegende Effizienz entsteht jedoch über hydraulischen Abgleich, passende Heizkurve, niedrige Vorlauftemperatur und saubere Planung.",
        ],
        bullets: ["keine hektischen Automationen", "Heizkurve und Abgleich ernst nehmen", "Sensorwerte zur Kontrolle nutzen"],
      },
      {
        id: "grenzen",
        title: "Grenzen und sinnvolle Umsetzung",
        body: [
          "Smart Home ersetzt keine Heizungsplanung. Es kann aber Messwerte, Visualisierung, Benachrichtigungen und priorisierte Energieflüsse bereitstellen.",
          "Heimlogik verbindet Wärmepumpe, PV, Wallbox, Netzwerk und Visualisierung so, dass das System nachvollziehbar bleibt und nicht aus vielen unverbundenen Apps besteht.",
        ],
      },
    ],
    faqs: [
      { question: "Kann man eine Wärmepumpe per Smart Home steuern?", answer: "Ja, wenn passende Schnittstellen vorhanden sind. Sinnvoll ist meist eine ergänzende Steuerung und Visualisierung, nicht ein ständiges Überschreiben der Heizungslogik." },
      { question: "Lohnt sich PV-Überschuss für die Wärmepumpe?", answer: "Oft kann PV-Überschuss für Warmwasser oder Speicher genutzt werden. Ob es sinnvoll ist, hängt von Anlage, Speicher, Komfortwunsch und Regelstrategie ab." },
      { question: "Ist Home Assistant für Wärmepumpen geeignet?", answer: "Home Assistant kann viele Wärmepumpen, Wechselrichter und Energiesysteme integrieren. Die Qualität hängt stark von den verfügbaren Schnittstellen ab." },
      { question: "Sollte man jeden Raum einzeln regeln?", answer: "Bei Wärmepumpe und Fußbodenheizung ist eine aggressive Einzelraumregelung oft nicht ideal. Gute Grundplanung und passende Heizkurve sind wichtiger." },
      { question: "Welche Daten sind für Energiemanagement wichtig?", answer: "Wichtig sind PV-Erzeugung, Hausverbrauch, Speicherstand, Wallbox, Wärmepumpenstatus, Temperaturen und Prioritäten für Verbraucher." },
    ],
    serviceLinks: [
      { label: "Energiemanagement & Heizung", href: "/energiemanagement-heizung" },
      { label: "Smarte Heizungssteuerung", href: "/smarte-heizungssteuerung" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart Home Planung", href: "/smart-home-planung" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Nienburg", href: "/smart-home-nienburg" },
    ],
    guideLinks: [
      { label: "PV, Wallbox und Energiemanagement", href: "/ratgeber/smart-home-photovoltaik-wallbox-energiemanagement" },
      { label: "Smarte Heizungssteuerung", href: "/ratgeber/smarte-heizkoerperthermostate-heizungssteuerung" },
      { label: "Home Assistant einrichten lassen", href: "/ratgeber/home-assistant-professionell-einrichten-lassen" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
      { label: "Was kostet ein Smart Home?", href: "/ratgeber/was-kostet-ein-smart-home" },
    ],
    finalCta:
      "Heimlogik verbindet Wärmepumpe, Photovoltaik, Wallbox und Smart Home zu einem nachvollziehbaren Energiesystem für Ihr Haus.",
  },
  {
    slug: "knx-planung-neubau-elektro-taster-verteiler",
    path: "/ratgeber/knx-planung-neubau-elektro-taster-verteiler",
    title: "KNX im Neubau planen - Elektroplanung, Taster, Verteiler und Reserven",
    metaTitle: "KNX im Neubau planen: Elektro, Taster, Verteiler & Reserven",
    metaDescription:
      "KNX im Neubau richtig planen: Funktionen, Taster, Präsenzmelder, Verteiler, Leitungen, Visualisierung und spätere Erweiterungen.",
    category: "KNX, Home Assistant & Systeme",
    excerpt:
      "Welche Entscheidungen bei KNX früh getroffen werden sollten, damit Licht, Beschattung, Heizung und Bedienung im Neubau zusammenpassen.",
    intro:
      "KNX ist im Neubau besonders stark, wenn es früh in die Elektroplanung einbezogen wird. Wer erst nach Schalterprogramm, Verteilergröße und Leitungswegen über Smart Home spricht, verliert viele Möglichkeiten oder zahlt später doppelt.",
    image: "/images/ratgeber/knx-planung-neubau-elektro-taster-verteiler.svg",
    imageAlt:
      "Grafik zur KNX-Planung im Neubau mit Verteiler, Busleitung, Tastern, Präsenzmeldern, Aktoren, Licht, Beschattung und Visualisierung",
    graphicTitle: "KNX Planung im Neubau",
    localNote:
      "Bei Neubauprojekten in Hannover, Nienburg, Wunstorf und Umgebung sollte KNX vor der finalen Elektroplanung besprochen werden, damit Verteiler, Leitungen und Bedienung passen.",
    sections: [
      {
        id: "frueh-planen",
        title: "Warum KNX früh geplant werden muss",
        body: [
          "KNX betrifft nicht nur smarte Taster. Es beeinflusst Leitungswege, Schaltschrank, Aktoren, Sensorik, Beleuchtung, Beschattung, Heizung, Netzwerk und spätere Visualisierung.",
          "Frühe Planung verhindert, dass Funktionen nachträglich mit Kompromissen gelöst werden müssen. Besonders Lichtkreise, Rollladenmotoren, Präsenzmelder und zentrale Bedienpunkte sollten vor der Elektroausführung klar sein.",
        ],
      },
      {
        id: "funktionen",
        title: "Funktionen vor Geräten festlegen",
        body: [
          "Gute KNX-Planung beginnt mit Alltagsszenen: Kommen, Gehen, Nacht, Kochen, Arbeiten, Urlaub, Beschattung, Reinigung und Sicherheit. Erst danach werden Taster, Sensoren und Aktoren ausgewählt.",
          "So entsteht ein System, das weniger Tasten braucht und trotzdem mehr kann. Räume werden nach Nutzung geplant, nicht nach Geräteprospekt.",
        ],
        bullets: ["Szenen vor Schalteranzahl", "Räume nach Nutzung planen", "Sensorik früh einzeichnen"],
      },
      {
        id: "verteiler",
        title: "Verteiler, Leitungen und Reserven",
        body: [
          "Ein KNX-Projekt braucht Platz im Verteiler: Aktoren, Spannungsversorgung, Reihenklemmen, Gateways, Absicherung und Reserven. Zu kleine Verteiler werden später teuer und unübersichtlich.",
          "Auch Leerrohre, Netzwerkleitungen, Busleitung, Außenbereich, Technikraum und mögliche Nachrüstpunkte sollten mitgedacht werden. Reserven sind kein Luxus, sondern ein Schutz gegen spätere Umbauten.",
        ],
      },
      {
        id: "bedienung",
        title: "Taster, Präsenzmelder und Visualisierung",
        body: [
          "KNX-Taster sollten verständlich bleiben. Nicht jede Funktion braucht eine eigene Taste. Viele Abläufe lassen sich über Szenen, Präsenzmelder, Zeitlogik oder Visualisierung besser lösen.",
          "Präsenzmelder sind besonders wertvoll für Flur, Bad, Hauswirtschaftsraum, Garage und Außenbereich. Visualisierung ergänzt die Bedienung, ersetzt aber keine gute Grundbedienung an der Wand.",
        ],
        bullets: ["wenige, klare Tasterfunktionen", "Präsenzmelder gezielt einsetzen", "Visualisierung als Ergänzung"],
      },
      {
        id: "kombination",
        title: "KNX mit Home Assistant und anderen Systemen kombinieren",
        body: [
          "KNX kann die robuste Gebäudebasis bilden. Home Assistant kann Visualisierung, Energie, Audio, Wetter, Apps und weitere Systeme ergänzen.",
          "Wichtig ist eine saubere Trennung: Grundfunktionen wie Licht und Beschattung sollten lokal und stabil laufen. Komfortfunktionen dürfen flexibler integriert werden.",
        ],
      },
    ],
    faqs: [
      { question: "Wann sollte man KNX im Neubau planen?", answer: "Am besten vor der finalen Elektroplanung. Dann können Verteiler, Leitungen, Taster, Sensoren und Funktionen sinnvoll berücksichtigt werden." },
      { question: "Ist KNX im Neubau sinnvoll?", answer: "Für viele Neubauten ja, besonders wenn Licht, Beschattung, Heizung und Szenen langlebig und herstellerübergreifend automatisiert werden sollen." },
      { question: "Braucht KNX einen großen Verteiler?", answer: "KNX benötigt oft mehr Platz im Verteiler als eine klassische Installation. Reserven für Aktoren, Gateways und Erweiterungen sollten eingeplant werden." },
      { question: "Kann man KNX später erweitern?", answer: "Ja, wenn Busleitung, Platz, Reserven und Struktur vorbereitet wurden. Ohne Planung sind spätere Erweiterungen deutlich schwieriger." },
      { question: "Kann KNX mit Home Assistant verbunden werden?", answer: "Ja. Home Assistant kann KNX visualisieren und mit weiteren Systemen verbinden, während KNX die lokalen Grundfunktionen übernimmt." },
    ],
    serviceLinks: [
      { label: "KNX & Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      { label: "Smart Home Planung für Neubau", href: "/smart-home-planung" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Neustadt am Rübenberge", href: "/smart-home-neustadt-am-ruebenberge" },
    ],
    guideLinks: [
      { label: "Smart Home Neubau planen", href: "/ratgeber/smart-home-neubau-planung" },
      { label: "KNX oder Home Assistant", href: "/ratgeber/knx-oder-home-assistant" },
      { label: "Was kostet ein Smart Home?", href: "/ratgeber/was-kostet-ein-smart-home" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home Fehler vermeiden", href: "/ratgeber/smart-home-fehler-vermeiden" },
    ],
    finalCta:
      "Heimlogik unterstützt bei der KNX-Planung im Neubau - von Funktionen und Elektrostruktur bis zur späteren Visualisierung.",
  },
  {
    slug: "smart-home-datenschutz-cloud-lokal",
    path: "/ratgeber/smart-home-datenschutz-cloud-lokal",
    title: "Smart Home Datenschutz - Cloud, lokale Steuerung und sensible Geräte richtig einordnen",
    metaTitle: "Smart Home Datenschutz: Cloud oder lokale Steuerung?",
    metaDescription:
      "Smart Home Datenschutz verständlich erklärt: Cloud, lokale Steuerung, Kameras, Sprachassistenten, Nutzerrechte, Updates und sichere Planung.",
    category: "Planung & Beratung",
    excerpt:
      "Welche Daten ein Smart Home erzeugt, wann lokale Steuerung sinnvoll ist und worauf man bei Kameras, Cloud und Nutzerrechten achten sollte.",
    intro:
      "Smart Home verarbeitet viele Alltagssignale: Anwesenheit, Temperatur, Türkontakte, Kamerabilder, Sprachbefehle, Energieverbrauch und Routinen. Datenschutz beginnt deshalb nicht bei einer Checkbox, sondern bei Systemauswahl, Netzwerk, Rechtevergabe und klarer Dokumentation.",
    image: "/images/ratgeber/smart-home-datenschutz-cloud-lokal.svg",
    imageAlt:
      "Grafik zu Smart-Home-Datenschutz mit lokaler Steuerung, Cloud-Diensten, Kameras, Sprachassistenten, Nutzerrechten und Netzwerksegmentierung",
    graphicTitle: "Datenschutz im Smart Home",
    localNote:
      "Für private Häuser und kleinere Gewerbeobjekte in Hannover und Umgebung ist Datenschutz besonders praxisnah: Welche Daten müssen wirklich in die Cloud und welche Funktionen können lokal bleiben?",
    sections: [
      {
        id: "daten",
        title: "Welche Daten im Smart Home entstehen",
        body: [
          "Schon einfache Sensoren können viel über den Alltag verraten: Wann jemand zu Hause ist, welche Räume genutzt werden, wann Fenster geöffnet sind oder wie Energie verbraucht wird.",
          "Besonders sensibel sind Kameras, Mikrofone, Türschlösser, Zutrittssysteme und Standortfunktionen. Sie sollten bewusster geplant werden als reine Komfortgeräte.",
        ],
      },
      {
        id: "lokal-cloud",
        title: "Lokale Steuerung oder Cloud - was ist besser?",
        body: [
          "Lokale Steuerung bedeutet, dass zentrale Funktionen im Haus laufen und nicht zwingend einen externen Dienst benötigen. Das kann Datenschutz, Reaktionszeit und Ausfallsicherheit verbessern.",
          "Cloud-Dienste sind nicht automatisch schlecht. Sie können Fernzugriff, Sprachassistenten, Herstellerfunktionen oder einfache Einrichtung ermöglichen. Wichtig ist, bewusst zu entscheiden, welche Funktion wirklich Cloud braucht.",
        ],
        bullets: ["Grundfunktionen möglichst lokal halten", "Cloud bewusst und sparsam nutzen", "Fernzugriff sauber absichern"],
      },
      {
        id: "kameras",
        title: "Kameras, Türklingeln und Sprachassistenten",
        body: [
          "Kameras und Videoklingeln sind datenschutzrechtlich sensibel, weil sie Personen erfassen können. Blickwinkel, Speicherort, Aufbewahrung, Hinweise und Rechte müssen sorgfältig geprüft werden.",
          "Sprachassistenten sind bequem, aber nicht für jede Funktion nötig. Für viele Alltagsabläufe sind Taster, Szenen und Automationen datensparsamer und zuverlässiger.",
        ],
      },
      {
        id: "rechte-netzwerk",
        title: "Nutzerrechte, Netzwerk und Updates",
        body: [
          "Ein sicheres Smart Home braucht klare Nutzerkonten, starke Passwörter, Zwei-Faktor-Authentifizierung, regelmäßige Updates und Backups. Alte Testzugänge und ungenutzte Apps sollten entfernt werden.",
          "Netzwerksegmentierung kann helfen, Smart-Home-Geräte, Gäste-WLAN, Kameras und private Geräte voneinander zu trennen. Das ist besonders bei vielen WLAN-Geräten sinnvoll.",
        ],
        bullets: ["Nutzerrechte regelmäßig prüfen", "Backups und Updates planen", "Gäste-WLAN getrennt halten"],
      },
      {
        id: "empfehlung",
        title: "Empfehlung für eine datensparsame Planung",
        body: [
          "Planen Sie zuerst, welche Funktionen wirklich gebraucht werden. Danach wird entschieden, welche Daten dafür notwendig sind, wo sie verarbeitet werden und wer Zugriff erhält.",
          "Heimlogik bevorzugt klare, dokumentierte Systeme: lokale Grundfunktionen, bewusst eingesetzte Cloud-Dienste, sichere Nutzerrechte und eine Bedienung, die nicht von unnötigen Apps abhängt.",
        ],
      },
    ],
    faqs: [
      { question: "Ist ein lokales Smart Home sicherer als Cloud?", answer: "Lokale Steuerung kann Datenschutz und Ausfallsicherheit verbessern. Sicher wird ein System aber erst durch gute Einrichtung, Updates, Nutzerrechte und Netzwerkplanung." },
      { question: "Sind Smart-Home-Kameras erlaubt?", answer: "Kameras sind sensibel und müssen rechtlich sauber geplant werden. Innenbereiche, Nachbargrundstücke und öffentliche Bereiche erfordern besondere Vorsicht." },
      { question: "Muss ein Smart Home Daten in die Cloud senden?", answer: "Nein, viele Funktionen können lokal laufen. Manche Herstellerfunktionen, Fernzugriffe oder Sprachassistenten nutzen jedoch Cloud-Dienste." },
      { question: "Wie schützt man ein Smart Home vor fremdem Zugriff?", answer: "Mit starken Passwörtern, Zwei-Faktor-Authentifizierung, Updates, Backups, klaren Nutzerrechten und einem sauber geplanten Netzwerk." },
      { question: "Ist Home Assistant datenschutzfreundlich?", answer: "Home Assistant kann sehr datensparsam betrieben werden, wenn Integrationen lokal gewählt und Fernzugriffe sicher eingerichtet werden." },
    ],
    serviceLinks: [
      { label: "Smart Home Planung", href: "/smart-home-planung" },
      { label: "KNX & Home Assistant Integration", href: "/knx-home-assistant-systemintegration" },
      { label: "Smart Home Sicherheit", href: "/smart-home-sicherheit" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Hannover", href: "/smart-home-hannover" },
      { label: "Smart Home Leese", href: "/smart-home-leese" },
    ],
    guideLinks: [
      { label: "Home Assistant einrichten lassen", href: "/ratgeber/home-assistant-professionell-einrichten-lassen" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Matter, Zigbee, WLAN oder KNX", href: "/ratgeber/matter-zigbee-wlan-knx-unterschied" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home Bedienung", href: "/ratgeber/smart-home-bedienung-app-sprachsteuerung-touchpanel-taster" },
      { label: "Smart Home Fehler vermeiden", href: "/ratgeber/smart-home-fehler-vermeiden" },
    ],
    finalCta:
      "Heimlogik plant Smart Home mit klarer Datenlogik: lokal, sicher, verständlich und nur dort cloudbasiert, wo es wirklich sinnvoll ist.",
  },
  {
    slug: "smart-home-garten-aussenbereich-bewaesserung-licht",
    path: "/ratgeber/smart-home-garten-aussenbereich-bewaesserung-licht",
    title: "Smart Home im Garten und Außenbereich - Licht, Bewässerung, Steckdosen und Sensoren",
    metaTitle: "Smart Home Garten & Außenbereich: Licht, Bewässerung, Sensoren",
    metaDescription:
      "Smart Home für Garten und Außenbereich planen: Außenlicht, Bewässerung, Steckdosen, Sensoren, Kameras, Netzwerk und wetterfeste Installation.",
    category: "Komfort, Sicherheit & Alltag",
    excerpt:
      "Was im Außenbereich wirklich sinnvoll ist: Wegebeleuchtung, Bewässerung, Außensteckdosen, Sensoren, Kameras und stabiles WLAN.",
    intro:
      "Der Außenbereich wird bei Smart Home oft zu spät bedacht. Dabei profitieren Garten, Einfahrt, Terrasse, Garage und Eingang stark von guter Planung: Licht, Bewässerung, Steckdosen, Sensoren und Netzwerk müssen wetterfest, sicher und bedienbar sein.",
    image: "/images/ratgeber/smart-home-garten-aussenbereich-bewaesserung-licht.svg",
    imageAlt:
      "Grafik zu Smart Home im Garten und Außenbereich mit Wegebeleuchtung, Bewässerung, Außensteckdosen, Kamera, Sensoren, WLAN und Technikraum",
    graphicTitle: "Smart Home im Außenbereich",
    localNote:
      "Bei Häusern in Hannover, Nienburg, Wunstorf, Leese und ländlicher Umgebung sind Grundstücksgröße, Nebengebäude und WLAN-Abdeckung im Außenbereich oft entscheidend.",
    sections: [
      {
        id: "planung",
        title: "Warum der Außenbereich früh geplant werden sollte",
        body: [
          "Außenfunktionen brauchen Strom, Netzwerk, wetterfeste Gehäuse, sichere Montageorte und oft längere Leitungswege. Wer erst nach Terrasse, Gartenbau oder Pflasterung plant, hat weniger Optionen.",
          "Sinnvoll ist eine gemeinsame Betrachtung von Eingang, Einfahrt, Garten, Garage, Terrasse, Schuppen und Technikraum. So entstehen keine isolierten Einzellösungen.",
        ],
      },
      {
        id: "licht",
        title: "Außenlicht, Wegebeleuchtung und Szenen",
        body: [
          "Gutes Außenlicht erhöht Komfort und Orientierung. Bewegungsmelder, Dämmerungssensoren, Zeitpläne und Szenen können Eingang, Einfahrt, Terrasse und Gartenwege sinnvoll steuern.",
          "Wichtig ist, Licht nicht zu übertreiben. Blendung, Nachbarn, Insektenfreundlichkeit und Stromverbrauch sollten berücksichtigt werden.",
        ],
        bullets: ["Bewegung und Dämmerung kombinieren", "Blendung vermeiden", "Szenen für Terrasse und Eingang planen"],
      },
      {
        id: "bewaesserung",
        title: "Bewässerung, Wetterdaten und Bodenfeuchte",
        body: [
          "Smarte Bewässerung kann Zeit sparen und Pflanzen schützen. Noch besser wird sie, wenn Wetterprognose, Regenmesser, Bodenfeuchte und Zeitfenster zusammen betrachtet werden.",
          "Automatik sollte immer manuell übersteuerbar sein. Gerade bei längerer Trockenheit, neuen Pflanzen oder Urlaub ist Kontrolle wichtiger als reine Zeitsteuerung.",
        ],
      },
      {
        id: "sensoren",
        title: "Außensteckdosen, Sensoren, Kameras und Sicherheit",
        body: [
          "Schaltbare Außensteckdosen sind praktisch für Gartenbeleuchtung, Brunnen, Dekoration oder Geräte. Sie müssen aber fachgerecht und wetterfest installiert werden.",
          "Kameras, Bewegungsmelder und Kontaktsensoren können Sicherheit erhöhen, sind aber datenschutzsensibel. Besonders Blickwinkel, Aufzeichnung und Nachbargrundstücke müssen bedacht werden.",
        ],
        bullets: ["wetterfeste Installation", "Datenschutz bei Kameras prüfen", "Außensteckdosen fachgerecht absichern"],
      },
      {
        id: "netzwerk",
        title: "WLAN, Funkreichweite und Nebengebäude",
        body: [
          "Viele Außenprobleme sind eigentlich Netzwerkprobleme. Massive Wände, große Grundstücke, Garagen und Nebengebäude können WLAN und Funkstandards deutlich schwächen.",
          "Für stabile Systeme sind Außen-Access-Points, LAN-Leitungen, Mesh-Planung oder gezielte Funkstandards sinnvoller als Geräte blind im Garten zu verteilen.",
        ],
      },
    ],
    faqs: [
      { question: "Was kann man im Garten smart steuern?", answer: "Typisch sind Außenlicht, Bewässerung, Steckdosen, Sensoren, Kameras, Garagentor, Pooltechnik und Szenen für Terrasse oder Eingang." },
      { question: "Braucht Smart Home im Garten WLAN?", answer: "Viele Geräte brauchen WLAN oder eine andere Funkverbindung. Bei größeren Grundstücken sind Außen-Access-Points oder LAN-Leitungen oft sinnvoll." },
      { question: "Ist smarte Bewässerung sinnvoll?", answer: "Ja, wenn Wetter, Bodenfeuchte, Wasserbedarf und manuelle Übersteuerung berücksichtigt werden. Reine Zeitpläne sind oft zu grob." },
      { question: "Kann man Außenlicht automatisch steuern?", answer: "Ja, mit Bewegungsmeldern, Dämmerungssensoren, Zeitplänen und Szenen. Wichtig sind passende Lichtstärke, Ausrichtung und Nachbarschaft." },
      { question: "Müssen Außensteckdosen vom Elektriker installiert werden?", answer: "Feste Außensteckdosen und 230V-Arbeiten gehören in die Hände einer Elektrofachkraft, besonders wegen Feuchtigkeit und Absicherung." },
    ],
    serviceLinks: [
      { label: "Licht, Rollläden & Beschattung", href: "/licht-rollladen-beschattung" },
      { label: "Smart Home Installation Hannover", href: "/smart-home-installation" },
      { label: "Smart Home Nachrüstung Hannover", href: "/smart-home-nachruesten" },
      { label: "Smart Home Sicherheit", href: "/smart-home-sicherheit" },
      contactLink,
    ],
    locationLinks: [
      { label: "Smart Home Wunstorf", href: "/smart-home-wunstorf" },
      { label: "Smart Home Nienburg", href: "/smart-home-nienburg" },
    ],
    guideLinks: [
      { label: "Smart Home Lichtsteuerung", href: "/ratgeber/smart-home-lichtsteuerung-szenen-dali-praesenzmelder" },
      { label: "Smart Home Sicherheit", href: "/ratgeber/smart-home-sicherheit-kameras-sensoren-alarm" },
      { label: "Smart Home Netzwerk planen", href: "/ratgeber/smart-home-netzwerk-wlan-lan-access-points-technikraum" },
      { label: "Smart Home nachrüsten", href: "/ratgeber/smart-home-nachruesten-ohne-waende-aufzureissen" },
      { label: "Smart Home Fehler vermeiden", href: "/ratgeber/smart-home-fehler-vermeiden" },
      { label: "PV, Wallbox und Energiemanagement", href: "/ratgeber/smart-home-photovoltaik-wallbox-energiemanagement" },
    ],
    finalCta:
      "Heimlogik plant Smart Home im Außenbereich mit Licht, Bewässerung, Netzwerk und Sicherheit als zusammenhängendes System.",
  },
];

export const guideArticleMap: Record<string, GuideArticle> = Object.fromEntries(
  guideArticles.map((article) => [article.slug, article]),
);

export function articlesByCategory(category: string) {
  return guideArticles.filter((article) => article.category === category);
}

export function articleSchema(article: GuideArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: `${siteConfig.siteUrl}${article.image}`,
    author: {
      "@type": "Organization",
      name: siteConfig.companyName,
      url: siteConfig.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.companyName,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.siteUrl}${siteConfig.logo.main}`,
      },
    },
    mainEntityOfPage: `${siteConfig.siteUrl}${article.path}`,
  };
}

export function guideCollectionSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Smart-Home-Ratgeber von Heimlogik",
    description:
      "Praxisnahe Smart-Home-Ratgeber zu Planung, Nachrüstung, KNX, Home Assistant, Kosten, Heizung, Audio und moderner Gebäudetechnik.",
    url: `${siteConfig.siteUrl}/ratgeber`,
    publisher: {
      "@type": "Organization",
      name: siteConfig.companyName,
    },
    hasPart: guideArticles.map((article) => ({
      "@type": "Article",
      headline: article.title,
      url: `${siteConfig.siteUrl}${article.path}`,
    })),
  };
}
