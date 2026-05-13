"use client";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("heimlogik:cookie-settings"))}
      className="text-left text-slate-300 hover:text-white"
    >
      Cookie-Einstellungen
    </button>
  );
}
