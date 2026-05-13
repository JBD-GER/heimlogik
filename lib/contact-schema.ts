import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Bitte geben Sie Ihren Namen ein."),
  phone: z.string().min(5, "Bitte geben Sie eine Telefonnummer ein."),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  location: z.string().min(2, "Bitte geben Sie Ort oder PLZ ein."),
  propertyType: z.enum(["Wohnung", "Haus", "Ferienwohnung", "Mietwohnung", "Gewerbe", "Neubau", "Sanierung"], {
    required_error: "Bitte wählen Sie den Immobilientyp.",
  }),
  service: z.enum(
    [
      "Smart Home Planung",
      "Smart Home Installation",
      "KNX/Home Assistant",
      "Nachrüstung",
      "smarte Thermostate",
      "Heizung/Energie",
      "Licht/Rollläden",
      "Sicherheit/Zutritt",
      "Ferienwohnung",
      "Gewerbe",
      "Komplettprojekt",
    ],
    { required_error: "Bitte wählen Sie eine Leistung." },
  ),
  rooms: z.string().optional(),
  radiators: z.string().optional(),
  thermostatsPresent: z.enum(["Ja", "Nein", "Teilweise"]).optional().or(z.literal("")),
  preferredSystem: z.enum(["Homematic IP", "Bosch Smart Home", "FRITZ!DECT", "tado", "Eve", "Matter", "anderes", "noch offen"]).optional().or(z.literal("")),
  wifiIssues: z.enum(["Ja", "Nein", "unsicher"]).optional().or(z.literal("")),
  message: z.string().min(10, "Bitte beschreiben Sie Ihr Anliegen kurz."),
  privacy: z.literal("on", {
    errorMap: () => ({ message: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu." }),
  }),
  website: z.string().max(0, "Spam erkannt.").optional(),
});

export type ContactFormInput = z.infer<typeof contactSchema>;
