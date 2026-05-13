import {
  BadgeCheck,
  Blinds,
  Building2,
  CalendarClock,
  Camera,
  CheckCircle2,
  DoorOpen,
  Gauge,
  Home,
  KeyRound,
  Lightbulb,
  LockKeyhole,
  Network,
  PlugZap,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Thermometer,
  type LucideIcon,
  Wrench,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/site.config";

export type FaqItem = {
  question: string;
  answer: string;
};

export type ContentLink = {
  label: string;
  href: string;
};

export type ContentSection = {
  kicker?: string;
  title: string;
  text?: string;
  items?: string[];
  links?: ContentLink[];
};

export type PackageItem = {
  title: string;
  text: string;
  items: string[];
  cta?: string;
};

export type PageContent = {
  path: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroHeadline?: string;
  kicker: string;
  heroText: string;
  heroBullets?: string[];
  primaryCta: string;
  secondaryCta: string;
  secondaryHref?: string;
  imageSrc: string;
  imageAlt: string;
  icon: LucideIcon;
  serviceName?: string;
  serviceType?: string;
  breadcrumbs?: ContentLink[];
  sections: ContentSection[];
  packages?: PackageItem[];
  boundary?: string;
  faqs: FaqItem[];
  formVariant?: "default" | "heating" | "vacation";
  leadFormEarly?: boolean;
};

export const navItems = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/smart-home-planung", label: "Smart-Home Planung" },
  { href: "/smart-home-installation", label: "Installation" },
  { href: "/knx-loxone-systemintegration", label: "KNX & Loxone" },
  { href: "/smart-home-nachruesten", label: "Nachrüstung" },
  { href: "/energiemanagement-heizung", label: "Energie & Heizung" },
  { href: "/licht-rollladen-beschattung", label: "Licht & Rollläden" },
  { href: "/smart-home-sicherheit-zutritt", label: "Sicherheit" },
  { href: "/ferienwohnung-smart-home", label: "Ferienwohnungen" },
  { href: "/kontakt", label: "Kontakt" },
];

export const trustBadges = [
  { icon: BadgeCheck, label: "Spezialisiert auf Smart-Home-Systemintegration" },
  { icon: Home, label: "Hauptfokus Wunstorf, Isernhagen und Hannover" },
  { icon: Smartphone, label: "Planung, Programmierung und Einweisung" },
  { icon: Wrench, label: "Elektroarbeiten über qualifizierte Partner" },
];

export const heroVariants = [
  {
    headline: "Smart Home Planung & Installation.",
    subline:
      "Heimlogik plant, integriert und programmiert intelligente Gebäudetechnik für Häuser, Neubauten und hochwertige Immobilien in Wunstorf, Isernhagen und Hannover.",
  },
  {
    headline: "Intelligente Gebäudetechnik statt komplizierter Einzellösungen.",
    subline:
      "Wir verbinden Licht, Beschattung, Heizung, Sicherheit und Energie zu einem Smart-Home-System, das verständlich bedienbar bleibt.",
  },
  {
    headline: "Ihr Smart-Home-Systemintegrator für Wunstorf, Isernhagen & Hannover.",
    subline:
      "Von der Planung bis zur Inbetriebnahme: Heimlogik entwickelt Smart-Home-Lösungen für Neubau, Sanierung und anspruchsvolle Nachrüstung.",
  },
  {
    headline: "Smart Home als System gedacht.",
    subline:
      "Keine Bastellösung, keine Insellösung: Heimlogik sorgt dafür, dass Geräte, Gewerke und Bedienung logisch zusammenspielen.",
  },
  {
    headline: "Smart Home Planung & Installation für Ihr Zuhause.",
    subline:
      "Heimlogik plant und integriert Smart-Home-Lösungen, die im Alltag funktionieren - von smarter Heizung bis Gebäudeautomation.",
  },
  {
    headline: "Gebäudeautomation für Menschen, die keine Technikprobleme wollen.",
    subline:
      "Wir planen und integrieren Smart-Home-Systeme, die Komfort, Sicherheit und Energie intelligent verbinden.",
  },
  {
    headline: "Von smarter Heizung bis KNX-Systemintegration.",
    subline:
      "Heimlogik ist Ihr regionaler Ansprechpartner für Smart-Home-Planung, Installation und Programmierung in Wunstorf, Isernhagen und Hannover.",
  },
  {
    headline: "Mehr Komfort. Mehr Kontrolle. Weniger Technikchaos.",
    subline:
      "Heimlogik macht Smart Home verständlich: geplant, integriert, eingerichtet und sauber erklärt.",
  },
];

export const chosenHeroVariant = {
  index: 1,
  reason:
    "Variante 1 ist am stärksten, weil sie den Hauptclaim klar trägt, sofort verständlich ist und zugleich genug Raum für lokale SEO und Premium-Positionierung in der Subline lässt.",
};

export const processSteps = [
  {
    title: "Erstgespräch",
    text: "Wir klären Ziel, Objekt, vorhandene Technik, Budgetrahmen und Prioritäten.",
  },
  {
    title: "Vor-Ort-Check oder Planprüfung",
    text: "Bei Bestandsobjekten prüfen wir Technik vor Ort. Bei Neubau oder Sanierung prüfen wir Grundrisse, Gewerke und Schnittstellen.",
  },
  {
    title: "Systemkonzept",
    text: "Sie erhalten eine nachvollziehbare Empfehlung für System, Funktionen, Bedienung und Ausbaustufen.",
  },
  {
    title: "Angebot und Projektplanung",
    text: "Wir strukturieren Umsetzung, Zuständigkeiten, Partnerleistungen und realistische nächste Schritte.",
  },
  {
    title: "Umsetzung mit Fachpartnern",
    text: `Programmierung und Integration erfolgen koordiniert. ${siteConfig.electricianPartnerText}`,
  },
  {
    title: "Inbetriebnahme, Einweisung und Support",
    text: "Räume, Szenen, Apps und Nutzer werden eingerichtet und verständlich übergeben. Support ist nach Projektabschluss möglich.",
  },
];

export const serviceCards = [
  {
    icon: SlidersHorizontal,
    title: "Smart-Home-Planung",
    text: "Wünsche, Grundrisse und Technik werden in ein klares Smart-Home-Konzept übersetzt.",
    href: "/smart-home-planung",
  },
  {
    icon: Wrench,
    title: "Smart Home Installation",
    text: "Einrichtung, Montage, App-Struktur und Inbetriebnahme werden sauber vorbereitet und umgesetzt.",
    href: "/smart-home-installation",
  },
  {
    icon: Network,
    title: "KNX & Loxone Systemintegration",
    text: "KNX-/Loxone-kompatible Lösungen für Neubau, Sanierung und hochwertige Immobilien.",
    href: "/knx-loxone-systemintegration",
  },
  {
    icon: PlugZap,
    title: "Smart Home Nachrüstung",
    text: "Funklösungen, Sensorik, App-Steuerung und klare Bedienung für Bestandsimmobilien.",
    href: "/smart-home-nachruesten",
  },
  {
    icon: Thermometer,
    title: "Smarte Heizkörperthermostate",
    text: "Thermostate, App, Räume, Zeitpläne und Einweisung für Wohnung, Haus und Ferienwohnung.",
    href: "/smarte-heizkoerperthermostate",
  },
  {
    icon: Gauge,
    title: "Energiemanagement & Heizung",
    text: "Heizung, PV, Speicher, Wallbox und Verbraucher transparenter und bewusster steuern.",
    href: "/energiemanagement-heizung",
  },
  {
    icon: Blinds,
    title: "Licht, Rollläden & Beschattung",
    text: "Lichtszenen, Bewegungsmelder, Jalousien und Beschattung logisch automatisieren.",
    href: "/licht-rollladen-beschattung",
  },
  {
    icon: ShieldCheck,
    title: "Sicherheit, Zutritt & Sensorik",
    text: "Kontakte, Kameras, Smart Locks, Wassersensoren und Benachrichtigungen sinnvoll integrieren.",
    href: "/smart-home-sicherheit-zutritt",
  },
  {
    icon: LockKeyhole,
    title: "Ferienwohnung Smart Home",
    text: "WLAN, smarte Heizung, Zutritt, Sensorik und Gästeanleitung für weniger Betreuungsaufwand.",
    href: "/ferienwohnung-smart-home",
  },
  {
    icon: Building2,
    title: "Gebäudeautomation Gewerbe",
    text: "Intelligente Steuerung für Büros, Praxen und kleinere Gewerbeobjekte.",
    href: "/gebaeudeautomation-gewerbe",
  },
];

const defaultImage = "/images/heimlogik-smart-home-hero.png";

const globalServiceFaqs: FaqItem[] = [
  {
    question: "Ist Heimlogik ein Elektrofachbetrieb?",
    answer:
      "Nein. Heimlogik positioniert sich als Smart-Home-Systemintegrator. Feste Elektroarbeiten erfolgen in Zusammenarbeit mit qualifizierten Elektriker-Partnern.",
  },
  {
    question: "Welche Systeme nutzt Heimlogik?",
    answer:
      "Die Systemauswahl hängt von Objekt, Budget, gewünschter Bedienung und Erweiterungsbedarf ab. KNX-/Loxone-/Matter-kompatible Lösungen sind möglich, wenn sie zum Projekt passen.",
  },
  {
    question: "Was kostet ein Smart-Home-Projekt?",
    answer:
      "Die Kosten hängen von Objekt, System, Funktionsumfang und baulichen Voraussetzungen ab. Nach dem Projekt-Check erhalten Sie ein transparentes Angebot.",
  },
  {
    question: "Gibt es Support nach der Installation?",
    answer:
      "Ja, Support nach Projektabschluss ist möglich, zum Beispiel für Anpassungen, Erweiterungen, App-Fragen und neue Nutzer.",
  },
];

export const servicePages: Record<string, PageContent> = {
  "/smart-home-planung": {
    path: "/smart-home-planung",
    metaTitle: "Smart-Home Planung | Heimlogik",
    metaDescription:
      "Smart-Home Planung für Neubau, Sanierung und Bestandsimmobilien: Funktionen, Systeme, Bedienung, Schnittstellen und Umsetzung sauber vorbereiten.",
    h1: "Smart-Home Planung für Neubau, Sanierung und Bestand",
    kicker: "Smart-Home Konzept, Funktionsplanung und Systemauswahl",
    heroText:
      "Eine gute Smart-Home-Lösung beginnt nicht mit Geräten, sondern mit einer klaren Planung. Heimlogik ordnet Wünsche, Funktionen, Systeme und Umsetzungsschritte so, dass daraus ein verständliches Gesamtkonzept entsteht.",
    heroBullets: [
      "Funktionsplanung für Licht, Heizung, Beschattung, Sicherheit und Energie",
      "Systemauswahl passend zu Objekt, Budget und Erweiterungswunsch",
      "Planprüfung für Neubau, Sanierung und Bestandsimmobilien",
      "klare Bedienlogik für App, Schalter, Szenen und Automationen",
    ],
    primaryCta: "Smart-Home Planung anfragen",
    secondaryCta: "Leistungen ansehen",
    secondaryHref: "/leistungen",
    imageSrc: defaultImage,
    imageAlt: "Smart-Home Planung mit zentraler Steuerung und Gebäudelösung",
    icon: SlidersHorizontal,
    serviceName: "Smart-Home Planung",
    serviceType: "Smart Home Beratung und Planung",
    sections: [
      {
        title: "Warum Planung vor Technik kommt",
        text: "Viele Smart-Home-Projekte werden kompliziert, weil Geräte zu früh gekauft werden. Heimlogik beginnt mit Räumen, Nutzern, Abläufen und gewünschten Funktionen.",
        items: ["Ziele und Funktionsumfang klären", "Räume und Nutzer definieren", "Bedienung im Alltag planen", "technische Grenzen früh erkennen"],
      },
      {
        title: "Vom Wunsch zur umsetzbaren Funktionsliste",
        text: "Aus Ideen entstehen konkrete Funktionen: Welche Szene soll was auslösen? Welche Bereiche werden automatisiert? Wo bleibt ein normaler Schalter sinnvoll?",
        items: ["Lichtszenen", "Beschattung", "Heizung", "Sicherheit", "Zutritt", "Energiemanagement", "App-Struktur", "Schnittstellen"],
      },
      {
        title: "Systemauswahl ohne Hersteller-Scheuklappen",
        text: "KNX, Loxone, Matter, Funklösungen oder Mischsysteme können je nach Objekt sinnvoll sein. Entscheidend sind Stabilität, Erweiterbarkeit und Bedienbarkeit.",
        links: [
          { label: "KNX & Loxone", href: "/knx-loxone-systemintegration" },
          { label: "Smart Home nachrüsten", href: "/smart-home-nachruesten" },
          { label: "Energiemanagement", href: "/energiemanagement-heizung" },
        ],
      },
      {
        title: "Was am Ende der Planung steht",
        text: "Sie erhalten eine klare Orientierung für System, Funktionen, Prioritäten und Umsetzung. Das hilft bei Angeboten, Elektroabstimmung und späterer Erweiterung.",
        items: ["priorisierte Funktionsliste", "Systemempfehlung", "Umsetzungsreihenfolge", "Hinweise für Fachpartner"],
      },
    ],
    boundary: siteConfig.electricianPartnerText,
    faqs: [
      { question: "Wann lohnt sich eine Smart-Home Planung?", answer: "Immer dann, wenn mehrere Gewerke, Räume oder Funktionen zusammenspielen sollen. Besonders wichtig ist sie bei Neubau, Sanierung und hochwertigen Bestandsimmobilien." },
      { question: "Kann Heimlogik vorhandene Pläne prüfen?", answer: "Ja. Vorhandene Elektro-, Grundriss- oder Funktionspläne können als Grundlage dienen, um Bedienlogik, Systeme und offene Punkte zu prüfen." },
      { question: "Muss ich mich vorher für KNX oder Loxone entscheiden?", answer: "Nein. Die Systementscheidung sollte aus Objekt, Funktionen, Budget und Erweiterungswunsch entstehen." },
      ...globalServiceFaqs,
    ],
  },
  "/smart-home-installation": {
    path: "/smart-home-installation",
    metaTitle: "Smart Home Installation | Heimlogik",
    metaDescription:
      "Smart Home Installation in Wunstorf, Isernhagen und Hannover: Einrichtung, Montage, App-Struktur, Inbetriebnahme und Einweisung mit Heimlogik.",
    h1: "Smart Home Installation für Haus, Wohnung und Bestand",
    kicker: "Smart Home einrichten, installieren und verständlich übergeben",
    heroText:
      "Heimlogik installiert und richtet Smart-Home-Komponenten so ein, dass aus Geräten ein nutzbares System wird: mit klaren Räumen, Szenen, Apps, Nutzerrechten und verständlicher Übergabe.",
    heroBullets: [
      "Installation und Einrichtung smarter Komponenten",
      "App, Gateway, Räume, Szenen und Nutzerrechte",
      "Inbetriebnahme, Test und Einweisung",
      "Elektroarbeiten über qualifizierte Partner",
    ],
    primaryCta: "Smart Home Installation anfragen",
    secondaryCta: "Planung ansehen",
    secondaryHref: "/smart-home-planung",
    imageSrc: "/images/bild_Mitarbeiter_zwei.png",
    imageAlt: "Smart Home Installation und Einrichtung durch Heimlogik",
    icon: Wrench,
    serviceName: "Smart Home Installation",
    serviceType: "Smart Home Installation",
    sections: [
      {
        title: "Installation ist mehr als Geräte anschließen",
        text: "Viele Smart-Home-Probleme entstehen nicht beim Kauf, sondern bei Einrichtung, App-Struktur und Übergabe. Heimlogik sorgt dafür, dass Komponenten logisch zusammenarbeiten und im Alltag verständlich bedienbar sind.",
        items: ["Komponenten prüfen", "Gateway und Apps einrichten", "Räume und Nutzer anlegen", "Funktionen testen"],
      },
      {
        title: "Was Heimlogik übernimmt",
        text: "Wir montieren und konfigurieren geeignete Smart-Home-Komponenten, richten Systeme ein, testen Automationen und erklären die Bedienung. Feste Elektroarbeiten stimmen wir mit qualifizierten Partnerbetrieben ab.",
        items: ["smarte Thermostate", "Sensoren", "Gateways", "Smart Locks", "Licht- und Beschattungsfunktionen", "App- und Nutzerverwaltung"],
      },
      {
        title: "Typische Installationsprojekte",
        items: ["Smart Home nachrüsten", "smarte Heizkörperthermostate installieren", "Sensoren und Wassermelder einrichten", "Zutritt und Smart Lock vorbereiten", "Szenen und Automationen testen", "Bestandssysteme neu strukturieren"],
        links: [
          { label: "Smart Home nachrüsten", href: "/smart-home-nachruesten" },
          { label: "Smarte Heizkörperthermostate", href: "/smarte-heizkoerperthermostate" },
          { label: "Sicherheit & Zutritt", href: "/smart-home-sicherheit-zutritt" },
        ],
      },
      {
        title: "Saubere Übergabe statt App-Chaos",
        text: "Nach der Installation wissen Sie, welche Funktion wo liegt, wie Szenen genutzt werden, welche Nutzerrechte vergeben sind und wie spätere Anpassungen möglich bleiben.",
        items: ["kurze Einweisung", "verständliche App-Struktur", "Nutzerrechte und Fernzugriff", "Supportoption nach Projektabschluss"],
      },
    ],
    boundary: siteConfig.electricianPartnerText,
    faqs: [
      { question: "Installiert Heimlogik Smart-Home-Geräte?", answer: "Ja. Heimlogik installiert und richtet geeignete Smart-Home-Komponenten ein, inklusive App, Gateway, Räumen, Szenen und Einweisung." },
      { question: "Welche Geräte können installiert werden?", answer: "Das hängt vom Objekt und System ab. Häufig geht es um smarte Thermostate, Sensoren, Gateways, Smart Locks, Lichtfunktionen, Beschattung und App-Strukturen." },
      { question: "Macht Heimlogik feste Elektroarbeiten?", answer: siteConfig.electricianPartnerText },
      { question: "Kann eine bestehende Installation aufgeräumt werden?", answer: "Ja. Wir prüfen vorhandene Geräte, Apps, Nutzerrechte und Automationen und strukturieren das System nachvollziehbarer." },
      ...globalServiceFaqs,
    ],
  },
  "/knx-loxone-systemintegration": {
    path: "/knx-loxone-systemintegration",
    metaTitle: "KNX & Loxone Systemintegrator | Heimlogik",
    metaDescription:
      "KNX- und Loxone-kompatible Smart-Home-Planung für Neubau, Sanierung und Premium-Immobilien in Wunstorf, Isernhagen und Hannover.",
    h1: "KNX & Loxone Systemintegration für anspruchsvolle Smart-Home-Projekte",
    kicker: "KNX Planung, Loxone Smart Home und Gebäudeautomation",
    heroText:
      "Heimlogik plant, koordiniert und programmiert hochwertige Smart-Home- und Gebäudeautomationslösungen - von Licht und Beschattung bis Energie, Sicherheit und Visualisierung.",
    heroBullets: [
      "Systementscheidung nach Objekt, Budget und Erweiterungsbedarf",
      "Licht, Beschattung, Heizung, Sicherheit, Zutritt und Energie",
      "Umsetzung fester Elektroarbeiten über qualifizierte Partner",
    ],
    primaryCta: "KNX-/Loxone-Projekt besprechen",
    secondaryCta: "Leistungen ansehen",
    secondaryHref: "/leistungen",
    imageSrc: "/images/bild_Mitarbeiter_zwei.png",
    imageAlt: "KNX und Loxone Systemintegration für hochwertiges Smart Home",
    icon: Network,
    serviceName: "KNX & Loxone Systemintegration",
    serviceType: "Smart Home Systemintegration",
    sections: [
      {
        title: "Warum KNX oder Loxone für Premium-Projekte?",
        text: "Bei Neubau, Sanierung, Villa und Gewerbe zählt nicht das einzelne Gerät, sondern ein robustes Gesamtsystem. Heimlogik prüft, ob KNX, Loxone oder ein anderes bewährtes System fachlich sinnvoll ist.",
        items: ["stabile Gebäudelogik", "zentrale Visualisierung", "erweiterbare Funktionen", "klare Bedienkonzepte"],
      },
      {
        title: "Was Heimlogik übernimmt",
        text: "Wir übernehmen Planung, Systemlogik, Schnittstellen, Programmierung, Visualisierung, Inbetriebnahme und Einweisung. Elektroarbeiten werden sauber mit qualifizierten Partnerbetrieben abgestimmt.",
        items: ["Systemkonzept", "Funktionsliste", "Szenen und Automationen", "App- und Visualisierungs-Einrichtung"],
      },
      {
        title: "Typische Funktionen",
        items: ["Lichtsteuerung", "Beschattung", "Heizung", "Sicherheit", "Zutritt", "Energiemanagement", "Visualisierung", "Schnittstellen"],
        links: [
          { label: "Licht & Rollläden", href: "/licht-rollladen-beschattung" },
          { label: "Energiemanagement", href: "/energiemanagement-heizung" },
          { label: "Gebäudeautomation Gewerbe", href: "/gebaeudeautomation-gewerbe" },
        ],
      },
    ],
    boundary: siteConfig.electricianPartnerText,
    faqs: [
      { question: "Ist Heimlogik KNX-zertifizierter Partner?", answer: "Eine solche Zertifizierung wird hier nicht behauptet. Heimlogik plant und integriert KNX-kompatible Lösungen, wenn sie zum Projekt passen." },
      { question: "Ist Loxone für mein Haus sinnvoll?", answer: "Das hängt von gewünschten Funktionen, Budget, Objektstruktur und späteren Erweiterungen ab. Wir prüfen die Systemwahl vor der Empfehlung." },
      { question: "Wer installiert Aktoren und feste Leitungen?", answer: siteConfig.electricianPartnerText },
      ...globalServiceFaqs,
    ],
  },
  "/smart-home-nachruesten": {
    path: "/smart-home-nachruesten",
    metaTitle: "Smart Home nachrüsten lassen | Heimlogik",
    metaDescription:
      "Smart Home nachrüsten in Haus, Wohnung oder Bestandsimmobilie: Heizung, Licht, Sensoren, WLAN und App-Steuerung mit Heimlogik.",
    h1: "Smart Home nachrüsten - ohne kompletten Umbau",
    kicker: "Smart Home Bestand, Funklösung und Matter-kompatible Nachrüstung",
    heroText:
      "Sie möchten Ihr bestehendes Haus smarter machen, ohne alles neu zu verkabeln? Heimlogik prüft, welche Lösungen in Ihrer Immobilie sinnvoll, zuverlässig und alltagstauglich sind.",
    heroBullets: ["Heizung, Licht, Sensoren, WLAN und App-Steuerung", "ehrliche Prüfung technischer Grenzen", "ideal für Eigentümer, Vermieter und Ferienwohnungen"],
    primaryCta: "Nachrüst-Check vereinbaren",
    secondaryCta: "Smarte Thermostate ansehen",
    secondaryHref: "/smarte-heizkoerperthermostate",
    imageSrc: "/images/bild_Mitarbtier_vier.png",
    imageAlt: "Smart Home Nachrüstung in Bestandsimmobilie",
    icon: PlugZap,
    serviceName: "Smart Home Nachrüstung",
    serviceType: "Smart Home nachrüsten",
    sections: [
      {
        title: "Was lässt sich nachrüsten?",
        text: "Viele Funktionen lassen sich in Bestandsimmobilien ohne großen Umbau nachrüsten. Entscheidend sind WLAN, Stromversorgung, Funkabdeckung, vorhandene Schalter und die gewünschte Bedienung.",
        items: ["smarte Heizkörperthermostate", "Lichtsteuerung", "Steckdosen", "Tür-/Fensterkontakte", "Wassersensoren", "App-Steuerung"],
      },
      {
        title: "Funkbasierte Lösungen mit klarer Bedienung",
        text: "Funklösungen können ein sinnvoller Einstieg sein, wenn sie sauber geplant werden. Heimlogik achtet auf stabile Verbindungen, sinnvolle Räume und verständliche App-Struktur.",
      },
      {
        title: "Grenzen der Nachrüstung ehrlich prüfen",
        text: "Nicht jede Idee ist ohne Elektroarbeiten, bauliche Anpassung oder Fachpartner realistisch. Wir sagen früh, was sinnvoll ist und wo eine Partnerleistung nötig wird.",
        links: [
          { label: "Smarte Heizkörperthermostate", href: "/smarte-heizkoerperthermostate" },
          { label: "Sicherheit & Zutritt", href: "/smart-home-sicherheit-zutritt" },
          { label: "Ferienwohnung Smart Home", href: "/ferienwohnung-smart-home" },
        ],
      },
    ],
    boundary: siteConfig.electricianPartnerText,
    faqs: [
      { question: "Kann man Smart Home ohne Umbau nachrüsten?", answer: "Viele Funktionen ja. Wir prüfen vorher, welche Funklösungen stabil funktionieren und wo bauliche oder elektrische Arbeiten nötig wären." },
      { question: "Ist Smart Home im Altbau möglich?", answer: "Oft ja. Besonders Heizung, Sensorik, WLAN, Steckdosen und einzelne Lichtfunktionen eignen sich für den Einstieg." },
      { question: "Brauche ich eine zentrale Smart-Home-Zentrale?", answer: "Das hängt vom System ab. Manchmal reicht eine App, häufig ist ein Gateway oder eine Zentrale für Stabilität und Automationen sinnvoll." },
      ...globalServiceFaqs,
    ],
  },
  "/smarte-heizkoerperthermostate": {
    path: "/smarte-heizkoerperthermostate",
    metaTitle: "Smarte Heizkörperthermostate installieren | Heimlogik",
    metaDescription:
      "Smarte Heizkörperthermostate nachrüsten lassen: Montage, App-Einrichtung, Zeitpläne und Einweisung in Wunstorf, Isernhagen und Hannover.",
    h1: "Smarte Heizkörperthermostate installieren lassen",
    heroHeadline: "Smarte Heizkörperthermostate installieren lassen",
    kicker: "Heizkörper per App steuern in Wunstorf, Isernhagen und Hannover",
    heroText:
      "Heimlogik rüstet Ihre Heizkörper mit smarter Steuerung nach - inklusive Thermostat-Montage, App-Einrichtung, Raumprofilen, Zeitplänen und verständlicher Einweisung.",
    heroBullets: [
      "Heizkörper per App und Zeitplan steuern",
      "Räume individuell einstellen",
      "ideal für Wohnung, Haus und Ferienwohnung",
      "Einrichtung von Gateway, App und Raumprofilen",
      "alte Thermostate werden auf Wunsch beschriftet und aufbewahrt",
      "bei Ventil- oder Heizungsproblemen koordinieren wir passende Fachpartner",
    ],
    primaryCta: "Thermostat-Check anfragen",
    secondaryCta: "Beratung zur smarten Heizung",
    secondaryHref: "/energiemanagement-heizung",
    imageSrc: "/images/bild_Mitarbeiter.png",
    imageAlt: "Smarte Heizkörperthermostate installieren lassen in Hannover",
    icon: Thermometer,
    serviceName: "Smarte Heizkörperthermostate installieren lassen",
    serviceType: "Smart Home Heizungssteuerung / Smart Home Installation",
    breadcrumbs: [
      { label: "Leistungen", href: "/leistungen" },
      { label: "Energiemanagement & Heizung", href: "/energiemanagement-heizung" },
      { label: "Smarte Heizkörperthermostate", href: "/smarte-heizkoerperthermostate" },
    ],
    leadFormEarly: true,
    formVariant: "heating",
    sections: [
      {
        title: "Wenn die Heizung smart sein soll, aber die Technik nervt",
        text: "Smarte Heizkörperthermostate sind schnell gekauft - aber oft nicht sauber eingerichtet. Manche Geräte verbinden sich nicht, Zeitpläne passen nicht zum Alltag, Räume sind falsch angelegt oder niemand weiß, wie die App wirklich genutzt wird.",
      },
      {
        title: "Heimlogik übernimmt Montage, App-Einrichtung und Übergabe",
        text: "Wir prüfen die vorhandenen Heizkörper, empfehlen passende Thermostate, montieren die Geräte, richten App, Gateway, Räume und Heizprofile ein und erklären die Bedienung verständlich.",
      },
      {
        title: "Was ist bei der Installation enthalten?",
        items: [
          "Sichtprüfung der vorhandenen Heizkörperthermostate",
          "Prüfung, ob Adapter benötigt werden",
          "Demontage alter Thermostatköpfe, sofern technisch möglich",
          "Montage smarter Heizkörperthermostate",
          "Einrichtung von App, Gateway oder Zentrale",
          "Räume, Heizprofile, Zeitpläne und Einweisung",
          "optional Fensterkontakte einbinden",
          "Dokumentation der wichtigsten Einstellungen",
        ],
      },
      {
        title: "Welche Systeme können eingerichtet werden?",
        text: "Die passende Lösung hängt von Heizkörpern, WLAN, gewünschter Bedienung, Budget und Erweiterungsbedarf ab. Heimlogik gibt keine Herstellerbindung vor.",
        items: ["Homematic IP", "Bosch Smart Home", "FRITZ!DECT", "tado", "Eve Thermo", "Matter-kompatible Thermostate", "weitere Systeme nach Prüfung"],
      },
      {
        title: "Mehr Komfort, bessere Steuerung, weniger unnötiges Heizen",
        text: "Mit smarten Heizkörperthermostaten können Räume zeit- und bedarfsabhängig geregelt werden. Wir versprechen keine pauschale Energieeinsparung. Wir sorgen dafür, dass Ihre Heizkörper sinnvoller, transparenter und komfortabler gesteuert werden können.",
      },
      {
        title: "Teil eines größeren Energiemanagements",
        text: "Smarte Heizkörperthermostate können ein erster Schritt sein. Bei größeren Projekten verbindet Heimlogik Heizung, Raumtemperaturregelung, PV, Speicher, Wallbox, Wärmepumpe und Verbrauchsdaten zu einem umfassenden Energiemanagement-Konzept.",
        links: [
          { label: "Energiemanagement & smarte Heizung", href: "/energiemanagement-heizung" },
          { label: "Smart Home nachrüsten", href: "/smart-home-nachruesten" },
          { label: "Ferienwohnung Smart Home", href: "/ferienwohnung-smart-home" },
          { label: "Sicherheit & Sensorik", href: "/smart-home-sicherheit-zutritt" },
        ],
      },
    ],
    packages: [
      { title: "Wohnung Basic", text: "Für kleine Wohnungen, einzelne Räume und den Einstieg in smarte Heizungssteuerung.", items: ["3-5 Heizkörperthermostate", "App-Einrichtung", "einfache Zeitpläne", "kurze Einweisung"], cta: "Wohnung Basic anfragen" },
      { title: "Wohnung Komfort", text: "Für größere Wohnungen, Familien und mehrere Räume mit unterschiedlichen Tagesabläufen.", items: ["6-10 Heizkörperthermostate", "Gateway/Zentrale", "Räume und Wochenprofile", "kurze Dokumentation"], cta: "Wohnung Komfort anfragen" },
      { title: "Haus & Ferienwohnung", text: "Für Einfamilienhäuser, Ferienwohnungen und Vermieter mit mehr Heizkörpern und Fernzugriff.", items: ["10+ Heizkörperthermostate", "Abwesenheitsprofile", "optional Fensterkontakte", "Supportoption"], cta: "Haus oder Ferienwohnung prüfen lassen" },
    ],
    boundary:
      "Heimlogik montiert und richtet smarte Thermostatköpfe ein. Wir öffnen keine Heizungsrohre, tauschen keine Heizungsventile und verändern keine zentrale Heizungsanlage. Wenn ein Ventil klemmt oder ein hydraulisches Problem vorliegt, koordinieren wir bei Bedarf einen passenden Fachbetrieb.",
    faqs: [
      { question: "Kann man smarte Heizkörperthermostate einfach nachrüsten?", answer: "Häufig ja. Meist wird nur der Thermostatkopf ersetzt. Vorher prüfen wir Ventil, Adapterbedarf, WLAN beziehungsweise Funkabdeckung und das gewünschte System." },
      { question: "Funktionieren smarte Thermostate in Mietwohnungen?", answer: "Oft ja, sofern der Austausch reversibel möglich ist. Alte Thermostate können auf Wunsch beschriftet und aufbewahrt werden." },
      { question: "Muss für die Montage Wasser abgelassen werden?", answer: "Beim Wechsel üblicher Thermostatköpfe normalerweise nicht. Rohre, Ventile und zentrale Heizungsanlagen werden von Heimlogik nicht geöffnet oder verändert." },
      { question: "Welche Systeme sind sinnvoll?", answer: "Das hängt von Heizkörpern, WLAN, Bedienwunsch, Budget und Erweiterungsbedarf ab. Möglich sind unter anderem Homematic IP, Bosch Smart Home, FRITZ!DECT, tado, Eve Thermo und Matter-kompatible Thermostate." },
      { question: "Kann ich vorhandene Thermostate einrichten lassen?", answer: "Ja, wir prüfen vorhandene Geräte und richten sie ein, wenn sie technisch passen und stabil betrieben werden können." },
      { question: "Was ist, wenn mein Heizkörperventil klemmt?", answer: "Dann ist ein Heizungsfachbetrieb zuständig. Heimlogik kann bei Bedarf einen passenden Fachpartner koordinieren." },
      { question: "Wie lange dauert die Installation?", answer: "Kleine Wohnungen sind häufig in wenigen Stunden eingerichtet. Größere Objekte hängen von Anzahl der Heizkörper, System, Gateway und App-Struktur ab." },
      { question: "Kann ich die Heizung aus der Ferne steuern?", answer: "Ja, wenn System, Internetverbindung und Nutzerrechte passend eingerichtet sind. Wir klären, ob Fernzugriff sinnvoll und sicher umsetzbar ist." },
      { question: "Kann man smarte Thermostate mit Fensterkontakten kombinieren?", answer: "Ja. Fensterkontakte können helfen, Heizprofile bei geöffnetem Fenster sinnvoll zu ergänzen, wenn das System kompatibel ist." },
      { question: "Wie oft müssen Batterien gewechselt werden?", answer: "Das hängt vom Modell, Nutzungsverhalten und Funkqualität ab. Wir erklären Batterietypen und typische Hinweise in der App bei der Einweisung." },
    ],
  },
  "/energiemanagement-heizung": {
    path: "/energiemanagement-heizung",
    metaTitle: "Energiemanagement & smarte Heizung | Heimlogik",
    metaDescription:
      "Smarte Heizungssteuerung, Raumtemperaturregelung, PV, Wallbox und Energiemanagement sinnvoll verbinden - mit Heimlogik.",
    h1: "Smarte Heizungssteuerung & Energiemanagement für Ihr Zuhause",
    kicker: "Energiemanagement Smart Home, PV, Wallbox und Wärmepumpe",
    heroText:
      "Heimlogik hilft Ihnen, Heizung, Räume, Energieflüsse und Verbraucher intelligenter zu steuern - für mehr Komfort, Transparenz und bewusstere Energienutzung.",
    primaryCta: "Energiemanagement-Beratung anfragen",
    secondaryCta: "Smarte Heizkörperthermostate",
    secondaryHref: "/smarte-heizkoerperthermostate",
    imageSrc: "/images/info_grafik.png",
    imageAlt: "Energiemanagement mit PV Wallbox und Wärmepumpe",
    icon: Gauge,
    serviceName: "Energiemanagement & smarte Heizung",
    serviceType: "Smart Home Energiemanagement",
    sections: [
      { title: "Smarte Raumtemperaturregelung als Grundlage", text: "Räume, Zeitpläne, Szenen und Abwesenheitsprofile machen Heizung im Alltag verständlicher und besser steuerbar." },
      { title: "Smarte Heizkörperthermostate als erster Schritt", text: "Nicht jedes Energiemanagement-Projekt muss mit PV, Speicher und Wallbox starten. Für viele Wohnungen, Häuser und Ferienwohnungen sind smarte Heizkörperthermostate ein sinnvoller Einstieg.", links: [{ label: "Smarte Heizkörperthermostate installieren lassen", href: "/smarte-heizkoerperthermostate" }] },
      { title: "PV, Speicher, Wallbox und Wärmepumpe zusammendenken", text: "Bei größeren Projekten prüfen wir, wie Verbrauch, Energieflüsse, Lastmanagement und Automationen transparenter und bedienbarer werden können.", items: ["PV Energiemanagement", "Wallbox Energiemanagement", "Speicher", "Wärmepumpe", "Lastmanagement"] },
      { title: "Keine pauschalen Sparversprechen", text: "Wir versprechen keine pauschale Energieeinsparung. Wir sorgen dafür, dass Heizung und Energieverbrauch transparenter, bedienbarer und intelligenter gesteuert werden können." },
    ],
    boundary: "Arbeiten an Heizungsanlagen, festen Leitungen, Verteilungen oder 230V-Anschlüssen erfolgen über qualifizierte Fachpartner.",
    faqs: [
      { question: "Kann ich mit smarten Heizkörperthermostaten starten?", answer: "Ja, das ist für viele Wohnungen, Häuser und Ferienwohnungen ein sinnvoller Einstieg in smarte Heizungssteuerung." },
      { question: "Bindet Heimlogik PV, Speicher oder Wallbox ein?", answer: "Wenn Schnittstellen und Systeme passen, planen wir die Integration und Koordination. Arbeiten an elektrischen Anlagen erfolgen über Fachpartner." },
      { question: "Garantiert Energiemanagement eine bestimmte Einsparung?", answer: "Nein. Wir geben keine pauschalen Einsparversprechen. Ziel sind bessere Steuerung, Transparenz und bedarfsgerechter Betrieb." },
      ...globalServiceFaqs,
    ],
  },
  "/licht-rollladen-beschattung": {
    path: "/licht-rollladen-beschattung",
    metaTitle: "Smart Home Licht & Rollläden | Heimlogik",
    metaDescription:
      "Licht, Rollläden und Beschattung intelligent steuern: Szenen, Bewegungsmelder, Anwesenheitssimulation und Komfort mit Heimlogik.",
    h1: "Smart Home für Licht, Rollläden und Beschattung",
    kicker: "Lichtsteuerung, Rollladensteuerung und Szenensteuerung",
    heroText:
      "Heimlogik macht aus Licht, Rollläden und Beschattung ein intelligentes System: komfortabel bedienbar, automatisiert und passend zu Ihrem Alltag.",
    primaryCta: "Licht- und Beschattungsprojekt prüfen lassen",
    secondaryCta: "KNX & Loxone ansehen",
    secondaryHref: "/knx-loxone-systemintegration",
    imageSrc: "/images/bild_Mitarbeiter_zwei.png",
    imageAlt: "Lichtsteuerung und Beschattung im modernen Wohnzimmer",
    icon: Blinds,
    serviceName: "Smart Home Licht, Rollläden und Beschattung",
    serviceType: "Smart Home Lichtsteuerung",
    sections: [
      { title: "Warum Licht und Beschattung zentrale Funktionen sind", text: "Licht, Rollläden und Jalousien werden jeden Tag genutzt. Genau deshalb müssen Szenen, Schalter, App und Automationen einfach bleiben." },
      { title: "Szenen für Alltag, Abend, Arbeiten und Gäste", items: ["Lichtszenen", "Bewegungsmelder", "Präsenzlogik", "Alles-aus-Funktion", "Anwesenheitssimulation"] },
      { title: "Rollläden und Jalousien intelligent steuern", text: "Beschattung kann nach Zeit, Szene oder Sonnenstand gesteuert werden, wenn Technik und Elektroarbeiten passend vorbereitet sind." },
      { title: "DALI und LED-Lichtkonzepte", text: "DALI- oder LED-Lösungen können bei hochwertigen Projekten sinnvoll sein. Heimlogik prüft die Systementscheidung mit Blick auf Bedienung und Erweiterbarkeit." },
    ],
    boundary: siteConfig.electricianPartnerText,
    faqs: [
      { question: "Kann man vorhandene Rollläden smart steuern?", answer: "Oft ja. Entscheidend sind Motor, Schalter, Stromversorgung und gewünschte Bedienung. Feste Elektroarbeiten erfolgen über Partner." },
      { question: "Sind Bewegungsmelder sinnvoll?", answer: "Ja, wenn sie passend geplant werden. Flur, Eingang, Keller, Bad und Nachtlicht sind typische Bereiche." },
      { question: "Kann Licht mit Beschattung kombiniert werden?", answer: "Ja. Szenen können Licht, Rollläden, Jalousien und Anwesenheitssimulation verbinden." },
      ...globalServiceFaqs,
    ],
  },
  "/smart-home-sicherheit-zutritt": {
    path: "/smart-home-sicherheit-zutritt",
    metaTitle: "Smart Home Sicherheit & Zutritt | Heimlogik",
    metaDescription:
      "Smarte Sicherheit, Zutritt, Kameras, Sensoren und Wassermelder für Haus, Wohnung und Ferienimmobilie mit Heimlogik planen.",
    h1: "Smart-Home-Sicherheit für Haus, Wohnung und Ferienimmobilie",
    kicker: "Smart Home Sicherheit, Zutritt und Sensorik",
    heroText:
      "Mehr Überblick, schnellere Benachrichtigungen und intelligente Sensorik: Heimlogik plant und integriert smarte Sicherheits- und Zutrittslösungen für Ihr Zuhause.",
    primaryCta: "Sicherheitskonzept anfragen",
    secondaryCta: "Ferienwohnung ansehen",
    secondaryHref: "/ferienwohnung-smart-home",
    imageSrc: "/images/bild_mitarbtier_drei.png",
    imageAlt: "Smart Lock und Zutritt für Ferienwohnung",
    icon: ShieldCheck,
    serviceName: "Smart Home Sicherheit & Zutritt",
    serviceType: "Smart Home Sicherheit",
    sections: [
      { title: "Mehr Kontrolle ohne falsche Sicherheitsversprechen", text: "Smarte Sicherheit ersetzt keine zertifizierte Alarmanlage und garantiert keinen Einbruchschutz. Sie kann aber helfen, Vorgänge sichtbar zu machen, Benachrichtigungen auszulösen und das Sicherheitsgefühl zu erhöhen." },
      { title: "Typische Bausteine", items: ["Tür-/Fensterkontakte", "Bewegungsmelder", "smarte Kameras", "Türkommunikation", "Smart Locks", "Zutrittslösungen", "Wassersensoren", "Leckagewarnung"] },
      { title: "Datenschutzbewusste Einrichtung", text: "Bei Kameras, Klingeln, Nutzerrechten und Aufzeichnungen achten wir auf verständliche Einstellungen, private Bereiche und saubere App-Berechtigungen." },
    ],
    boundary: "Heimlogik plant und integriert smarte Sicherheitsfunktionen. Eine zertifizierte Alarmanlage oder VdS-Anlage wird nicht behauptet.",
    faqs: [
      { question: "Schützt Smart Home garantiert vor Einbruch?", answer: "Nein. Eine Garantie gibt es nicht. Smarte Sensorik kann informieren, Vorgänge sichtbar machen und Routinen auslösen." },
      { question: "Kann ein Smart Lock nachgerüstet werden?", answer: "Häufig ja. Wir prüfen Tür, Schloss, Notfallzugang, Nutzerrechte und Batteriekonzept." },
      { question: "Was ist bei Kameras wichtig?", answer: "Ausrichtung, Datenschutz, Speicherort, Benutzerrechte, Updates und sichere App-Einstellungen sind entscheidend." },
      ...globalServiceFaqs,
    ],
  },
  "/ferienwohnung-smart-home": {
    path: "/ferienwohnung-smart-home",
    metaTitle: "Smart Home für Ferienwohnungen | Heimlogik",
    metaDescription:
      "WLAN, Smart Lock, smarte Heizung, Sensoren und QR-Gästeanleitung für Ferienwohnungen in Wunstorf, Isernhagen und Hannover.",
    h1: "Smart Home für Ferienwohnungen - weniger Schlüsselstress, bessere Kontrolle",
    kicker: "WLAN, Smart Lock, Heizung und Sensorik für Ferienwohnungen",
    heroText:
      "Heimlogik macht Ferienwohnungen technisch stressfreier: stabiles WLAN, smarte Heizung, digitale Zutrittslösungen, Sensorik und verständliche Gästeanleitungen.",
    heroBullets: ["digitale Schlüsselübergabe", "smarte Heizung und Heizprofile", "Wassersensoren und Gäste-WLAN", "QR-Gästeanleitung"],
    primaryCta: "Ferienwohnung prüfen lassen",
    secondaryCta: "Smarte Thermostate",
    secondaryHref: "/smarte-heizkoerperthermostate",
    imageSrc: "/images/bild_Mitarbtier_eins.png",
    imageAlt: "Smart Home für Ferienwohnung mit App-Steuerung",
    icon: DoorOpen,
    serviceName: "Smart Home für Ferienwohnungen",
    serviceType: "Ferienwohnung Smart Home",
    formVariant: "vacation",
    sections: [
      { title: "Typische Probleme in Ferienwohnungen", items: ["Schlüsselübergabe kostet Zeit", "Gäste heizen unnötig", "WLAN-Probleme führen zu schlechten Bewertungen", "Wasserschäden werden spät bemerkt", "Gäste verstehen Technik nicht"] },
      { title: "Technik, die Betreuung einfacher macht", items: ["Smart Lock oder Schlüsselbox", "smarte Heizungssteuerung", "smarte Heizkörperthermostate", "stabiles WLAN", "Wassersensoren", "digitale Gästeanleitung per QR-Code", "Fernzugriff und Support"] },
      { title: "Sinnvolle interne Ergänzungen", links: [{ label: "Smarte Heizkörperthermostate", href: "/smarte-heizkoerperthermostate" }, { label: "Sicherheit & Zutritt", href: "/smart-home-sicherheit-zutritt" }, { label: "Energiemanagement & Heizung", href: "/energiemanagement-heizung" }] },
    ],
    packages: [
      { title: "WLAN & Gästeanleitung", text: "Stabile Basis, Gäste-WLAN und verständliche QR-Anleitung.", items: ["WLAN-Check", "Gastzugang", "QR-Anleitung"] },
      { title: "Zutritt & Schlüsselübergabe", text: "Digitale Zutrittslösung mit Rollen, Codes und Notfallprozess.", items: ["Smart Lock prüfen", "Nutzerrechte", "Notfallzugang"] },
      { title: "Heizung & Sensorik", text: "Smarte Thermostate, Zeitpläne, Fensterkontakte und Wassersensoren.", items: ["Thermostate", "Sensoren", "Fernzugriff"] },
      { title: "Komplettpaket Ferienwohnung", text: "WLAN, Zutritt, Heizung, Sensorik und Dokumentation abgestimmt.", items: ["Konzept", "Einrichtung", "Supportoption"] },
    ],
    boundary: "Bei Zutrittssystemen planen wir Notfallzugang, Batterien, Nutzerrechte und Betreiberprozesse mit. Feste Elektroarbeiten erfolgen über Partner.",
    faqs: [
      { question: "Kann Smart Home die Schlüsselübergabe vereinfachen?", answer: "Ja, mit Smart Lock, Codes oder Schlüsselbox. Wichtig sind Notfallzugang, klare Nutzerrechte und verständliche Gästeprozesse." },
      { question: "Kann ich die Heizung aus der Ferne steuern?", answer: "Ja, wenn System, Internetverbindung und Berechtigungen passend eingerichtet sind." },
      { question: "Hilft eine QR-Gästeanleitung?", answer: "Ja. Gäste erhalten kurze Hinweise zu WLAN, Heizung, Zutritt und wichtigen Regeln, ohne lange Ordner lesen zu müssen." },
      ...globalServiceFaqs,
    ],
  },
  "/gebaeudeautomation-gewerbe": {
    path: "/gebaeudeautomation-gewerbe",
    metaTitle: "Gebäudeautomation für Gewerbe | Heimlogik",
    metaDescription:
      "Gebäudeautomation für Büros, Praxen und kleine Gewerbeobjekte: Licht, Energie, Zutritt, Sensorik und Steuerung mit Heimlogik.",
    h1: "Gebäudeautomation für Gewerbeobjekte, Büros und Praxen",
    kicker: "Gebäudesteuerung Gewerbe, Licht, Energie und Zutritt",
    heroText:
      "Heimlogik plant intelligente Steuerungslösungen für kleinere Gewerbeobjekte - von Licht und Zutritt bis Energie, Sensorik und Bedienung.",
    primaryCta: "Gewerbeprojekt besprechen",
    secondaryCta: "Kontakt aufnehmen",
    secondaryHref: "/kontakt",
    imageSrc: defaultImage,
    imageAlt: "Gebäudeautomation Gewerbe mit zentraler Steuerung",
    icon: Building2,
    serviceName: "Gebäudeautomation für Gewerbe",
    serviceType: "Gebäudeautomation Gewerbe",
    sections: [
      { title: "Für Büros, Praxen und kleine Gewerbeeinheiten", text: "Wir planen Steuerungslösungen für kleinere Gewerbeobjekte, bei denen Bedienbarkeit, Dokumentation und zuverlässige Abläufe zählen." },
      { title: "Typische Funktionen", items: ["Licht nach Präsenz und Nutzung", "Zutritt und Sicherheit", "Energiemanagement", "Sensorik", "zentrale Bedienung", "Support und Dokumentation"] },
      { title: "Koordination mit Fachpartnern", text: "Feste Elektroarbeiten, Verteilungen und 230V-Anschlüsse werden mit qualifizierten Elektriker-Partnern umgesetzt." },
    ],
    boundary: siteConfig.electricianPartnerText,
    faqs: [
      { question: "Für welche Gewerbeobjekte eignet sich das?", answer: "Für Büros, Praxen, Kanzleien und kleinere Gewerbeeinheiten, bei denen Licht, Zutritt, Sensorik oder Energie zentraler gesteuert werden sollen." },
      { question: "Gibt es Dokumentation und Support?", answer: "Ja. Gerade im Gewerbe sind klare Dokumentation, Nutzerrechte und Supportoptionen sinnvoll." },
      { question: "Wer macht Elektroarbeiten?", answer: siteConfig.electricianPartnerText },
      ...globalServiceFaqs,
    ],
  },
};

export const homeFaqs: FaqItem[] = [
  { question: "Was macht ein Smart-Home-Systemintegrator?", answer: "Ein Systemintegrator sorgt dafür, dass Licht, Beschattung, Heizung, Sicherheit, Energie, Apps und Visualisierung logisch zusammenspielen." },
  { question: "Ist Heimlogik ein Elektrofachbetrieb?", answer: "Nein. Heimlogik plant, integriert, programmiert und betreut Smart-Home-Systeme. Elektroarbeiten erfolgen in Zusammenarbeit mit qualifizierten Elektriker-Partnern." },
  { question: "Arbeiten Sie mit Elektrikern zusammen?", answer: "Ja. Feste Elektroarbeiten, Unterputzinstallationen, Sicherungskasten, Verteilungen und 230V-Anschlüsse gehören in die Hände qualifizierter Fachbetriebe." },
  { question: "Welche Systeme nutzen Sie?", answer: "Wir wählen Systeme nach Objekt und Ziel. KNX-/Loxone-/Matter-kompatible Lösungen sind möglich, werden aber nicht pauschal als beste Lösung verkauft." },
  { question: "Eignet sich Smart Home für Neubau und Sanierung?", answer: "Ja. Im Neubau kann besonders sauber geplant werden, bei Sanierungen prüfen wir bauliche Möglichkeiten und sinnvolle Ausbaustufen." },
  { question: "Kann man Smart Home nachrüsten?", answer: "Ja, viele Funktionen lassen sich funkbasiert nachrüsten. Wir prüfen vorher Stabilität, WLAN, Stromversorgung und technische Grenzen." },
  { question: "Was kostet ein Smart-Home-Projekt?", answer: "Die Kosten hängen von Objekt, System, gewünschtem Funktionsumfang und baulichen Voraussetzungen ab. Nach dem Projekt-Check erhalten Sie ein transparentes Angebot." },
  { question: "Gibt es Support nach der Installation?", answer: "Ja, Support für Anpassungen, Erweiterungen und App-Fragen ist möglich." },
];

export const generalFaqs: FaqItem[] = [
  ...homeFaqs,
  { question: "Was ist der Unterschied zwischen Heimlogik und einem Elektriker?", answer: "Elektrohandwerk und Systemintegration ergänzen sich. Der Elektriker installiert Leitungen und Komponenten. Heimlogik plant und programmiert die Logik, Szenen, Schnittstellen und Bedienung." },
  { question: "Ist KNX oder Loxone besser?", answer: "Das lässt sich nicht pauschal sagen. Entscheidend sind Objekt, Funktionen, Budget, Bedienwunsch und Erweiterungsbedarf." },
  { question: "Eignet sich Smart Home für Altbau?", answer: "Ja, wenn die Lösung realistisch geplant wird. Funklösungen, smarte Thermostate, Sensorik und Netzwerk sind häufig gute Einstiege." },
  { question: "Kann ich mit smarten Heizkörperthermostaten starten?", answer: "Ja. Für viele Wohnungen, Häuser und Ferienwohnungen sind smarte Heizkörperthermostate ein sinnvoller Einstieg." },
  { question: "Funktioniert Smart Home auch in Ferienwohnungen?", answer: "Ja. Besonders WLAN, Zutritt, smarte Heizung, Sensorik und Gästeanleitungen können Betreuung und Betrieb vereinfachen." },
  { question: "Was ist bei Sicherheit und Kameras zu beachten?", answer: "Datenschutz, Ausrichtung, Nutzerrechte, Speicherorte, Updates und sichere Passwörter sind entscheidend. Smarte Sicherheit ersetzt keine zertifizierte Alarmanlage." },
];

export const localPages: Record<string, PageContent> = {
  "/smart-home-nienburg": localPage("Nienburg", "Smart Home Nienburg", "Smart Home Nienburg | Heimlogik", "Smart Home in Nienburg planen, nachrüsten und integrieren lassen: Heimlogik verbindet Licht, Heizung, Sicherheit, Energie und Bedienung.", "Smart Home in Nienburg - geplant, integriert und verständlich eingerichtet", "Heimlogik betreut Smart-Home-Projekte im Nienburger (Weser) - von der ersten Beratung über die Systemauswahl bis zur Programmierung und Einweisung."),
  "/smart-home-leese": localPage("Leese", "Smart Home Leese", "Smart Home Leese | Heimlogik", "Smart Home in Leese und Umgebung: Planung, Nachrüstung, smarte Thermostate, KNX-/Loxone-kompatible Integration und Support.", "Smart Home in Leese - regional geplant und sauber eingerichtet", "Heimlogik sitzt in 31633 Leese und betreut Projekte direkt vor Ort sowie im Nienburger (Weser)."),
  "/smart-home-stolzenau": localPage("Stolzenau", "Smart Home Stolzenau", "Smart Home Stolzenau | Heimlogik", "Smart Home in Stolzenau planen und nachrüsten lassen: Heizung, Licht, Sicherheit, Zutritt und Ferienwohnungslösungen mit Heimlogik.", "Smart Home in Stolzenau für Haus, Sanierung und Ferienwohnung", "Für Eigentümer und Vermieter in Stolzenau plant Heimlogik Smart-Home-Lösungen, die nicht nach Bastellösung aussehen, sondern im Alltag funktionieren."),
  "/smart-home-wunstorf": localPage("Wunstorf", "Smart Home Wunstorf", "Smart Home Wunstorf | Heimlogik", "Smart Home in Wunstorf: Heimlogik plant und integriert smarte Heizung, Licht, Sicherheit, KNX-/Loxone-kompatible Systeme und Nachrüstung.", "Smart Home in Wunstorf - Systemintegration statt Technikchaos", "In Wunstorf begleitet Heimlogik anspruchsvolle Smart-Home-Projekte für Neubau, Sanierung, Einfamilienhaus und hochwertige Bestandsimmobilien."),
  "/smart-home-hannover": localPage("Hannover", "Smart Home Hannover", "Smart Home Hannover | Heimlogik", "Smart Home in Hannover planen und integrieren lassen: Heimlogik verbindet Heizung, Licht, Sicherheit, Energie und Bedienung zu einem klaren System.", "Smart Home in Hannover - hochwertige Systemintegration", "In Hannover plant Heimlogik Smart-Home-Lösungen für Eigentümer, Neubauten, Sanierungen und hochwertige Bestandsimmobilien."),
  "/smart-home-isernhagen": localPage("Isernhagen", "Smart Home Isernhagen", "Smart Home Isernhagen | Heimlogik", "Smart Home in Isernhagen: Heimlogik plant und integriert smarte Heizung, Licht, Sicherheit, KNX-/Loxone-kompatible Systeme und Nachrüstung.", "Smart Home in Isernhagen - sauber geplant und verständlich bedienbar", "In Isernhagen begleitet Heimlogik Smart-Home-Projekte mit Fokus auf Komfort, Energieeffizienz, Sicherheit und einfache Bedienung."),
  "/smart-home-neustadt-am-ruebenberge": localPage("Neustadt am Rübenberge", "Smart Home Neustadt am Rübenberge", "Smart Home Neustadt am Rübenberge | Heimlogik", "Smart Home in Neustadt am Rübenberge: Planung, Nachrüstung, smarte Heizkörperthermostate, Sicherheit, Licht und Energie mit Heimlogik.", "Smart Home in Neustadt am Rübenberge - klar geplant, verständlich bedienbar", "Rund um Hannover, Isernhagen, Wunstorf und Nienburger (Weser) betreut Heimlogik Projekte mit Fokus auf Bedienbarkeit, Systemlogik und saubere Umsetzung."),
  "/smart-home-hannover-west": localPage("Hannover West", "Smart Home Hannover West", "Smart Home Hannover West | Heimlogik", "Smart Home in Hannover West und Region Hannover: Heimlogik plant Systemintegration, Nachrüstung, KNX-/Loxone-kompatible Lösungen und smarte Heizung.", "Smart Home in Hannover West - hochwertige Systemintegration", "Für Hannover West und die westliche Region Hannover plant Heimlogik Smart-Home-Lösungen für anspruchsvolle Eigentümer, Neubauten und Sanierungen."),
};

function localPage(
  city: string,
  kicker: string,
  metaTitle: string,
  metaDescription: string,
  h1: string,
  intro: string,
): PageContent {
  return {
    path: `/smart-home-${city.toLowerCase().replaceAll(" ", "-").replace("ü", "ue")}`,
    metaTitle,
    metaDescription,
    h1,
    kicker,
    heroText: `${intro} Wir verbinden Technik, Komfort, Sicherheit und Energieeffizienz zu einem verständlichen Gesamtsystem.`,
    heroBullets: [
      `Smart-Home-Beratung und Planung in ${city}`,
      "Nachrüstung, smarte Heizung, Licht und Sensorik",
      "KNX-/Loxone-/Matter-kompatible Lösungen möglich",
      "Elektroarbeiten über qualifizierte Partner",
    ],
    primaryCta: `Smart-Home-Projekt in ${city} anfragen`,
    secondaryCta: "Leistungen ansehen",
    secondaryHref: "/leistungen",
    imageSrc: defaultImage,
    imageAlt: `Smart Home Steuerung in Einfamilienhaus in ${city}`,
    icon: Home,
    serviceName: `Smart Home ${city}`,
    serviceType: "Lokale Smart Home Planung und Systemintegration",
    sections: [
      {
        title: `Smart-Home-Systemintegration für ${city} und Umgebung`,
        text: "Heimlogik denkt Smart Home nicht als Sammlung einzelner Geräte, sondern als System aus Planung, Integration, Programmierung und verständlicher Bedienung.",
      },
      {
        title: "Passende Leistungen vor Ort",
        items: ["Smart Home nachrüsten", "Smarte Heizkörperthermostate", "KNX & Loxone Systemintegration", "Licht & Rollläden", "Energiemanagement & Heizung", "Sicherheit & Zutritt"],
        links: [
          { label: "Smart Home nachrüsten", href: "/smart-home-nachruesten" },
          { label: "Smarte Heizkörperthermostate", href: "/smarte-heizkoerperthermostate" },
          { label: "KNX & Loxone", href: "/knx-loxone-systemintegration" },
          { label: "Licht & Rollläden", href: "/licht-rollladen-beschattung" },
          { label: "Energiemanagement", href: "/energiemanagement-heizung" },
          { label: "Sicherheit & Zutritt", href: "/smart-home-sicherheit-zutritt" },
        ],
      },
      {
        title: "Regionaler Ablauf",
        text: "Nach der Anfrage klären wir telefonisch Ziel und Objekt. Danach folgt je nach Projekt ein Vor-Ort-Check, eine Planprüfung oder ein konkretes Systemkonzept.",
      },
      {
        title: `Was wir in ${city} konkret prüfen`,
        items: ["vorhandene Elektro- und Netzwerksituation", "gewünschte Bedienung per Schalter, App oder Szene", "sinnvolle Funk- oder kabelgebundene Systemwahl", "Datenschutz, Nutzerrechte und Fernzugriff", "Erweiterbarkeit für spätere Funktionen", "Schnittstellen zu Heizung, Licht, Beschattung und Sicherheit"],
      },
      {
        title: "Das Ergebnis",
        text: "Sie erhalten keine lose Gerätesammlung, sondern eine nachvollziehbare Smart-Home-Struktur mit klaren Funktionen, sauberer Bedienung und realistischen nächsten Schritten.",
      },
    ],
    boundary: siteConfig.electricianPartnerText,
    faqs: [
      { question: `Bietet Heimlogik Smart Home in ${city} an?`, answer: `Ja. Heimlogik betreut Smart-Home-Projekte in ${city} sowie in Isernhagen, Wunstorf und Hannover.` },
      { question: `Kann ich in ${city} smarte Heizkörperthermostate installieren lassen?`, answer: "Ja, Heimlogik richtet smarte Heizkörperthermostate inklusive App, Räumen, Zeitplänen und Einweisung ein." },
      { question: "Macht Heimlogik Elektroarbeiten selbst?", answer: siteConfig.electricianPartnerText },
      { question: "Welche Leistungen sind lokal sinnvoll?", answer: "Häufig starten Projekte mit Nachrüstung, smarter Heizung, Lichtsteuerung, Sicherheit, Zutritt oder einer Systemplanung für Neubau und Sanierung." },
    ],
  };
}

export const footerServices = [
  ["Smart Home Installation", "/smart-home-installation"],
  ["Smart-Home Planung", "/smart-home-planung"],
  ["Smart Home nachrüsten", "/smart-home-nachruesten"],
  ["Smarte Heizkörperthermostate installieren lassen", "/smarte-heizkoerperthermostate"],
  ["KNX & Loxone Systemintegration", "/knx-loxone-systemintegration"],
  ["Licht & Rollläden", "/licht-rollladen-beschattung"],
  ["Energiemanagement & Heizung", "/energiemanagement-heizung"],
  ["Sicherheit & Zutritt", "/smart-home-sicherheit-zutritt"],
  ["Ferienwohnung Smart Home", "/ferienwohnung-smart-home"],
  ["Gebäudeautomation Gewerbe", "/gebaeudeautomation-gewerbe"],
];

export const serviceAreaLinks = [
  ["Isernhagen", "/smart-home-isernhagen"],
  ["Wunstorf", "/smart-home-wunstorf"],
  ["Hannover", "/smart-home-hannover"],
  ["Leese", "/smart-home-leese"],
  ["Nienburg", "/smart-home-nienburg"],
  ["Stolzenau", "/smart-home-stolzenau"],
  ["Neustadt am Rübenberge", "/smart-home-neustadt-am-ruebenberge"],
  ["Hannover West", "/smart-home-hannover-west"],
];

export const featureIcons = [CheckCircle2, CalendarClock, Camera, Zap, Lightbulb, KeyRound];
