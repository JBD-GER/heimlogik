# Heimlogik Website

Öffentliche Website mit Startseite, Leistungs- und Ortsseiten, Ratgeber, Kontaktformular und rechtlichen Seiten. Es gibt keine Anmeldung, Kundenverwaltung, Zeiterfassung oder Datenbankanbindung mehr.

## Lokal starten

```sh
npm ci
cp .env.example .env.local # Nur wenn noch keine lokale Konfiguration existiert.
npm run dev
```

## Kontaktformular

Kontakt- und Anzeigenformular senden an `/api/contact`. Diese einzige serverseitige Funktion prüft die Eingaben und verschickt die Anfrage über Resend an `CONTACT_EMAIL`. Nach erfolgreichem Versand wird eine Eingangsbestätigung an den Absender gesendet. Die Website speichert Anfragen nicht in einer Datenbank.

Für den Versand müssen lokal und beim Hosting diese Variablen gesetzt sein:

- `RESEND_API_KEY`: gültiger Resend-Schlüssel.
- `RESEND_FROM_EMAIL`: Absenderadresse der in Resend verifizierten Domain.
- `CONTACT_EMAIL`: Empfänger der Formularanfragen, derzeit `smart@heimlogik.de`.

Ohne Schlüssel oder bei Versandfehlern zeigt das Formular einen Fehler statt einer erfolgreichen Übermittlung an. Die Resend-Zugangsdaten bleiben ausschließlich auf dem Server. Deshalb wird die Website weiterhin als Next.js-Anwendung betrieben; ein rein statischer Export würde einen externen Formulardienst erfordern.

## Prüfen und veröffentlichen

```sh
npm run lint
npm run build
npm start
```

Die neue Version vor dem Löschen des bisherigen Supabase-Projekts veröffentlichen. Danach werden die bisherigen Supabase-, Admin- und OpenAI-Umgebungsvariablen auch beim Hosting nicht mehr benötigt. Das Entfernen der Anbindung aus diesem Repository löscht das gehostete Supabase-Projekt und dessen Daten nicht automatisch.
