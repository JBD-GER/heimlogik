"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

const projectTypes = ["Neubau", "Sanierung", "Nachrüstung", "Bestandsimmobilie"];
const services = [
  "Beratung & Budgetierung",
  "Smart Home Planung",
  "Kabelkonzept",
  "Programmierung/Inbetriebnahme",
  "Smart Home Installation",
  "KNX/Home Assistant",
  "Nachrüstung",
];

export function AdsLeadForm() {
  const router = useRouter();
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrors({});
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setState("error");
        setErrors(result.errors || {});
        setMessage(result.message || "Bitte prüfen Sie Ihre Angaben.");
        return;
      }

      form.reset();
      setState("success");
      setMessage(result.message || "Vielen Dank. Ihre Anfrage wurde übermittelt.");
      router.push(result.redirectTo || "/danke");
    } catch {
      setState("error");
      setMessage("Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-md border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name} required />
        <Field label="E-Mail" name="email" type="email" error={errors.email} required />
        <Field label="Telefon" name="phone" type="tel" error={errors.phone} required />
        <Field label="Postleitzahl / Ort" name="location" error={errors.location} required />
        <Select label="Projektart" name="propertyType" error={errors.propertyType} required options={projectTypes} />
        <Select label="Wobei brauchen Sie Unterstützung?" name="service" error={errors.service} required options={services} />
        <Field label="Anzahl Räume optional" name="rooms" error={errors.rooms} />
        <Field label="Anzahl Heizkörper optional" name="radiators" error={errors.radiators} />
        <div className="hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="text-sm font-semibold text-slate-800">
            Kurzbeschreibung
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Zum Beispiel: Neubau, Rohbau startet im Herbst, gewünscht sind Licht, Beschattung, Heizung, Türkommunikation und eine zentrale Bedienung."
            className="focus-ring mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900"
          />
          {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message}</p> : null}
        </div>
      </div>
      <label className="mt-5 flex gap-3 text-sm leading-6 text-slate-700">
        <input name="privacy" type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-accent" />
        <span>Ich stimme zu, dass meine Angaben zur Bearbeitung der Anfrage verarbeitet werden. Details stehen in der Datenschutzerklärung.</span>
      </label>
      {errors.privacy ? <p className="mt-1 text-sm text-red-600">{errors.privacy}</p> : null}
      <button
        type="submit"
        disabled={state === "loading"}
        className="focus-ring mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-ink transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {state === "loading" ? "Wird gesendet..." : "Kostenloses Erstgespräch anfragen"}
      </button>
      {message ? (
        <p className={`mt-4 rounded-md p-3 text-sm ${state === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="focus-ring mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900"
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  error,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-slate-800">
        {label}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        className="focus-ring mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900"
      >
        <option value="" disabled>
          Bitte wählen
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
