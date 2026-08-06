# Heimlogik SEO- und Website-Übergabe

## 1. Finale Seitenarchitektur

- `/` Startseite
- `/leistungen`
- `/knx-home-assistant-systemintegration`
- `/smart-home-nachruesten`
- `/smarte-heizkoerperthermostate`
- `/energiemanagement-heizung`
- `/licht-rollladen-beschattung`
- `/smart-home-sicherheit-zutritt`
- `/ferienwohnung-smart-home`
- `/gebaeudeautomation-gewerbe`
- `/ueber-uns`
- `/faq`
- `/kontakt`
- `/smart-home-nienburg`
- `/smart-home-leese`
- `/smart-home-stolzenau`
- `/smart-home-wunstorf`
- `/smart-home-neustadt-am-ruebenberge`
- `/smart-home-hannover-west`
- `/impressum`
- `/datenschutz`

Legacy-Weiterleitungen:

- `/smarte-heizungssteuerung` -> `/smarte-heizkoerperthermostate`
- `/smart-home-sicherheit` -> `/smart-home-sicherheit-zutritt`
- `/smart-home-installateur-stadt` -> `/smart-home-nienburg`

## 2. Keyword-Zuordnung je Seite

- `/`: Smart Home Installateur Nienburg, Smart Home Systemintegrator Region Hannover, Smart Home installieren lassen
- `/leistungen`: Smart Home Leistungen, Smart Home Planung, Smart Home Installation, Smart Home Systemintegration
- `/knx-home-assistant-systemintegration`: KNX Systemintegrator, KNX Planung, KNX Programmierung, Home Assistant Smart Home
- `/smart-home-nachruesten`: Smart Home nachrüsten, Smart Home Bestand, Matter Smart Home, Smart Home ohne Umbau
- `/smarte-heizkoerperthermostate`: smarte Heizkörperthermostate installieren lassen, Heizungssteuerung per App, smarte Thermostate installieren
- `/energiemanagement-heizung`: Energiemanagement Smart Home, smarte Heizungssteuerung, PV Energiemanagement, Wallbox Energiemanagement
- `/licht-rollladen-beschattung`: Lichtsteuerung Smart Home, Rollladensteuerung Smart Home, Beschattung Smart Home, DALI Lichtsteuerung
- `/smart-home-sicherheit-zutritt`: Smart Home Sicherheit, Zutrittskontrolle Smart Home, Smart Lock installieren, Wassersensoren
- `/ferienwohnung-smart-home`: Smart Home Ferienwohnung, Smart Lock Ferienwohnung, WLAN Ferienwohnung, Ferienwohnung Heizung smart steuern
- `/gebaeudeautomation-gewerbe`: Gebäudeautomation Gewerbe, Smart Home Gewerbe, Lichtsteuerung Gewerbe, Zutrittskontrolle Gewerbe
- Lokale Seiten: Smart Home + Ort, Smart Home Installateur + Ort, Gebäudeautomation + Region, smarte Heizkörperthermostate + Ort

## 3. Meta Title und Meta Description

Die Meta-Daten sind in den jeweiligen `app/**/page.tsx` Dateien beziehungsweise zentral in `lib/content.ts` gepflegt. Alle Leistungs- und lokalen Landingpages nutzen eigene Title, Description und Canonical-URLs.

## 4. H1 je Seite

Jede geprüfte Seite hat genau eine H1. Die H1-Werte stehen zentral in `lib/content.ts` für Leistungs- und lokale Seiten sowie direkt in den statischen Seiten für Start, Leistungen, Kontakt, FAQ, Über uns, Impressum und Datenschutz.

## 5. Hero-Texte je Seite

Alle Haupt- und Landingpages haben einen eigenen Hero mit lokalem Bezug, sichtbarer Telefonnummer, primärem CTA und sekundärem CTA. Die stärkste Startseiten-Variante ist Variante 1: "Smart Home, das einfach funktioniert.", weil sie den Hauptclaim klar trägt und sich lokal sowie premiumfähig erweitern lässt.

## 6. CTA-Texte je Seite

- Standard: Projekt-Check vereinbaren, Beratung anfragen, 0511-9012188-1
- KNX/Home Assistant: KNX- und Home Assistant-Projekt besprechen
- Nachrüstung: Nachrüst-Check vereinbaren
- Thermostate: Thermostat-Check anfragen
- Energie: Energiemanagement-Beratung anfragen
- Licht/Beschattung: Licht- und Beschattungsprojekt prüfen lassen
- Sicherheit: Sicherheitskonzept anfragen
- Ferienwohnung: Ferienwohnung prüfen lassen
- Gewerbe: Gewerbeprojekt besprechen

## 7. Interne Verlinkungsstruktur

- Startseite verlinkt auf alle Hauptleistungen und lokalen Standortseiten.
- Leistungen verlinkt auf alle Leistungsseiten.
- Thermostat-Seite verlinkt auf Energiemanagement, Nachrüstung, Ferienwohnung und Sicherheit.
- Energiemanagement verlinkt prominent auf die Thermostat-Seite.
- Ferienwohnung verlinkt auf Thermostate, Sicherheit und Energiemanagement.
- KNX/Home Assistant verlinkt auf Licht/Beschattung, Energiemanagement und Gewerbe.
- Lokale Seiten verlinken auf passende Leistungsseiten.
- Footer enthält Leistungslinks, Servicegebiet und Rechtliches.

## 8. FAQ-Fragen je Seite

Startseite und `/faq` enthalten globale Fragen zu Systemintegrator, Elektroarbeiten, Systemwahl, Neubau, Sanierung, Nachrüstung, Kosten und Support. Leistungsseiten enthalten je Seite eigene transaktionale oder fachliche FAQs, zum Beispiel Thermostat-Nachrüstung, Mietwohnung, Wasser ablassen, vorhandene Geräte, klemmende Ventile und Fernzugriff.

## 9. Schema-Markup-Empfehlungen

Umgesetzt:

- LocalBusiness auf der Startseite
- Service-Schema auf Leistungs- und lokalen Landingpages
- BreadcrumbList auf allen Seiten mit Breadcrumb-Komponente
- FAQPage auf Seiten mit echten FAQs

Nicht als Garantie für Rich Results verstehen.

## 10. Google-Ads-Priorisierung

Priorität 1:

- `/smarte-heizkoerperthermostate`
- `/smart-home-nachruesten`
- `/energiemanagement-heizung`
- `/ferienwohnung-smart-home`

Priorität 2:

- `/licht-rollladen-beschattung`
- `/knx-home-assistant-systemintegration`
- `/smart-home-sicherheit-zutritt`

Priorität 3:

- `/gebaeudeautomation-gewerbe`
- lokale SEO-Seiten

## 11. Auszufüllende Platzhalter

- `site.config.ts`: rechtlicher Firmenname, Straße/Hausnummer, E-Mail-Adresse, WhatsApp-Nummer
- `app/impressum/page.tsx`: Vertretungsberechtigte Person, Register, Umsatzsteuer-ID, Aufsicht/Kammer, Streitbeilegung
- `app/datenschutz/page.tsx`: Hosting-Anbieter, Rechtsgrundlagen, Speicherdauer, Empfänger, Tracking-Anbieter, Drittlandübermittlung, Opt-out
- `.env.local`: `RESEND_API_KEY`, `CONTACT_EMAIL`, optional Tracking-IDs

## 12. Lokal starten

```bash
npm install
npm run dev
```

Danach ist die Website standardmäßig unter `http://localhost:3000` erreichbar.
