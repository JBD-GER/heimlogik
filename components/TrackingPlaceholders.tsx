import { siteConfig } from "@/site.config";

export function TrackingPlaceholders() {
  return (
    <>
      <script
        id="tracking-consent-config"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            note: "Consent Mode v2 startet standardmäßig abgelehnt. Google Ads Tracking lädt erst nach Marketing-Einwilligung.",
            googleAdsConversionId: siteConfig.tracking.googleAdsConversionId,
            googleAdsConversionLabel: siteConfig.tracking.googleAdsConversionLabel,
          }),
        }}
      />
      <script
        id="google-consent-mode-default"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            window.gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              wait_for_update: 500
            });
          `,
        }}
      />
    </>
  );
}
