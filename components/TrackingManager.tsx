"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/site.config";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    heimlogikTrackingLoaded?: boolean;
  }
}

const STORAGE_KEY = "heimlogik-cookie-consent";
const CONVERSION_STORAGE_KEY = "heimlogik-lead-conversion-sent";
const adsConversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || siteConfig.tracking.googleAdsConversionId;
const adsConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || siteConfig.tracking.googleAdsConversionLabel;

export function TrackingManager() {
  const pathname = usePathname();

  useEffect(() => {
    const storedConsent = readConsent();
    if (storedConsent) applyConsent(storedConsent);

    function handleConsentUpdate(event: Event) {
      const consent = (event as CustomEvent<Consent>).detail;
      applyConsent(consent);
    }

    window.addEventListener("heimlogik:consent-updated", handleConsentUpdate);
    return () => window.removeEventListener("heimlogik:consent-updated", handleConsentUpdate);
  }, []);

  useEffect(() => {
    const consent = readConsent();
    if (!consent?.marketing) return;
    const searchParams = new URLSearchParams(window.location.search);
    if (pathname !== "/danke" || searchParams.get("lead") !== "1") return;
    if (window.sessionStorage.getItem(CONVERSION_STORAGE_KEY) === "true") return;

    loadTrackingScripts();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "lead_form_submit",
      google_ads_conversion_id: adsConversionId,
      google_ads_conversion_label: adsConversionLabel,
    });
    window.gtag?.("event", "conversion", {
      send_to: `${adsConversionId}/${adsConversionLabel}`,
    });
    window.sessionStorage.setItem(CONVERSION_STORAGE_KEY, "true");
  }, [pathname]);

  return null;
}

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function applyConsent(consent: Consent) {
  window.dataLayer = window.dataLayer || [];
  window.gtag?.("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });
  window.dataLayer.push({
    event: "heimlogik_consent_update",
    analytics: consent.analytics,
    marketing: consent.marketing,
  });

  if (consent.marketing) loadTrackingScripts();
}

function loadTrackingScripts() {
  if (window.heimlogikTrackingLoaded) return;
  window.heimlogikTrackingLoaded = true;
  window.dataLayer = window.dataLayer || [];

  if (adsConversionId) {
    injectScript("heimlogik-google-ads", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsConversionId)}`, () => {
      window.gtag?.("js", new Date());
      window.gtag?.("config", adsConversionId);
    });
  }
}

function injectScript(id: string, src: string, onload?: () => void) {
  if (document.getElementById(id)) {
    onload?.();
    return;
  }

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  if (onload) script.onload = onload;
  document.head.appendChild(script);
}
