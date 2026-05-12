import { siteConfig } from "@/site.config";

export function TrackingPlaceholders() {
  return (
    <>
      <script
        id="tracking-consent-placeholder"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            note: "Platzhalter für DSGVO-bewusste Consent-Logik. Tracking erst nach wirksamer Einwilligung aktivieren.",
            googleAnalyticsId: siteConfig.tracking.googleAnalyticsId,
            googleAdsId: siteConfig.tracking.googleAdsId,
            metaPixelId: siteConfig.tracking.metaPixelId,
          }),
        }}
      />
    </>
  );
}
