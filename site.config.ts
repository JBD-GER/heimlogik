export const siteConfig = {
  companyName: "Heimlogik",
  legalCompanyName: "[RECHTLICHER FIRMENNAME]",
  claim: "Smart Home, das einfach funktioniert.",
  alternativeClaim: "Planung. Integration. Programmierung. Betreuung.",
  phone: "05761 8429666",
  email: "[E-MAIL-ADRESSE]",
  city: "Leese",
  serviceArea:
    "Leese, Nienburg, Stolzenau, Neustadt am Rübenberge, Wunstorf, Hannover West und Region Hannover",
  serviceRadius: "Landkreis Nienburg und westliche Region Hannover",
  address: {
    "@type": "PostalAddress",
    postalCode: "31633",
    addressLocality: "Leese",
    addressCountry: "DE",
    streetAddress: "[STRASSE UND HAUSNUMMER]",
  },
  whatsappNumber: "[WHATSAPP-NUMMER]",
  siteUrl: "https://www.heimlogik.de",
  logo: {
    compact: "/images/heimlogik-logo-compact.png",
    main: "/images/heimlogik-logo-main.png",
    mark: "/images/heimlogik-logo-mark.png",
    favicon: "/images/Favicon.png",
  },
  isMasterCompany: false,
  isElectricalCompany: false,
  hasKnxCertification: false,
  hasIsoCertification: false,
  showPrices: false,
  electricianPartnerText:
    "Elektroarbeiten erfolgen in Zusammenarbeit mit qualifizierten Elektriker-Partnern.",
  tracking: {
    googleAnalyticsId: "[GA_MEASUREMENT_ID]",
    googleAdsId: "[GOOGLE_ADS_ID]",
    metaPixelId: "[META_PIXEL_ID]",
  },
} as const;

export type SiteConfig = typeof siteConfig;
