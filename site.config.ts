export const siteConfig = {
  companyName: "Heimlogik",
  legalCompanyName: "Bauelemente Pfad UG",
  claim: "Smart Home Planung & Installation",
  alternativeClaim: "Planung. Integration. Programmierung. Betreuung.",
  phone: "05761 8429666",
  email: "smart@heimlogik.de",
  city: "Leese",
  serviceArea:
    "Hannover, Isernhagen, Wunstorf, Nienburger (Weser)",
  serviceRadius: "Hannover, Isernhagen, Wunstorf & Nienburger (Weser)",
  address: {
    "@type": "PostalAddress",
    postalCode: "31633",
    addressLocality: "Leese",
    addressCountry: "DE",
    streetAddress: "Großer Kamp 5a",
  },
  addressLine: "Großer Kamp 5a, 31633 Leese",
  whatsappNumber: "",
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
    googleAdsConversionId: "AW-18159642295",
    googleAdsConversionLabel: "90bcCKXko6wcELfNmNND",
  },
} as const;

export type SiteConfig = typeof siteConfig;
