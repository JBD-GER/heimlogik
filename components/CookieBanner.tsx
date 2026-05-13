"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "heimlogik-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (!existing) setVisible(true);

    function openSettings() {
      setVisible(true);
      setSettingsOpen(true);
    }

    window.addEventListener("heimlogik:cookie-settings", openSettings);
    return () => window.removeEventListener("heimlogik:cookie-settings", openSettings);
  }, []);

  function saveConsent(consent: Consent) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, savedAt: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent("heimlogik:consent-updated", { detail: consent }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-ink/55 p-4 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full max-w-3xl rounded-md border border-slate-200 bg-white p-5 shadow-soft md:p-6">
        <p className="text-base font-bold text-ink">Cookie-Einstellungen</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Bitte treffen Sie eine Auswahl. Wir nutzen notwendige Cookies für den Betrieb der Website. Google Ads Conversion-Tracking wird erst nach Ihrer Zustimmung zu Marketing-Cookies aktiviert.
          Details finden Sie in der <Link href="/datenschutz" className="font-semibold text-ink underline">Datenschutzerklärung</Link>.
        </p>
        {settingsOpen ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
              <input type="checkbox" checked disabled className="mr-2" />
              Notwendig
            </label>
            <label className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="mr-2" />
              Analyse
            </label>
            <label className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
              <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} className="mr-2" />
              Marketing
            </label>
          </div>
        ) : null}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => saveConsent({ necessary: true, analytics: true, marketing: true })}
            className="focus-ring min-h-11 rounded-md bg-accent px-4 text-sm font-semibold text-ink"
          >
            Alle akzeptieren
          </button>
          <button
            type="button"
            onClick={() => (settingsOpen ? saveConsent({ necessary: true, analytics, marketing }) : setSettingsOpen(true))}
            className="focus-ring min-h-11 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-ink"
          >
            {settingsOpen ? "Auswahl speichern" : "Einstellungen"}
          </button>
          <button
            type="button"
            onClick={() => saveConsent({ necessary: true, analytics: false, marketing: false })}
            className="focus-ring min-h-11 rounded-md px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Nur notwendige
          </button>
        </div>
      </div>
    </div>
  );
}
