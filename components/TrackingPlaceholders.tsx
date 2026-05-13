import { siteConfig } from "@/site.config";

export function TrackingPlaceholders() {
  return (
    <>
      <script
        id="tracking-consent-config"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            note: "Google Ads Tracking darf erst nach wirksamer Marketing-Einwilligung geladen werden.",
            googleAdsId: siteConfig.tracking.googleAdsId,
          }),
        }}
      />
    </>
  );
}
