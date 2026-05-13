import { siteConfig } from "@/site.config";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.companyName,
    legalName: siteConfig.legalCompanyName,
    description:
      "Smart-Home-Beratung, Planung, Systemintegration, Programmierung, App-Einrichtung, Einweisung und Support in Wunstorf, Isernhagen und Hannover.",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: siteConfig.address,
    areaServed: siteConfig.serviceArea.split(", "),
    priceRange: "individuell",
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/images/heimlogik-smart-home-hero.png`,
    makesOffer: [
      "Smart Home Planung",
      "Smart Home Installation im rechtlich zulässigen Rahmen",
      "Smart Home Systemintegration",
      "Gebäudeautomation",
      "KNX-/Loxone-kompatible Lösungen",
      "Lichtsteuerung",
      "Beschattung",
      "smarte Heizkörperthermostate",
      "Energiemanagement",
      "smarte Heizung",
      "Sicherheit",
      "Zutritt",
      "Ferienwohnung Smart Home",
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ServiceSchema({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: serviceType ?? name,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.companyName,
      telephone: siteConfig.phone,
      address: siteConfig.address,
      areaServed: siteConfig.serviceArea.split(", "),
    },
    areaServed: siteConfig.serviceArea.split(", "),
    url: `${siteConfig.siteUrl}${path}`,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
