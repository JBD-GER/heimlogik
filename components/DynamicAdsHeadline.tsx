"use client";

import { useSearchParams } from "next/navigation";

const defaultHeadline = "Smart Home professionell planen lassen, bevor auf der Baustelle teure Fehler entstehen";

const headlineByKeyword: Record<string, string> = {
  "smart home installateur": "Smart Home Installateur für Neubau & Sanierung",
  "smart home fachpartner": "Smart Home Fachpartner für professionelle Planung & Programmierung",
  "smart home dienstleister": "Smart Home Dienstleister für Planung, Kabelkonzept & Inbetriebnahme",
  "smart home firma": "Smart Home Firma für herstellerunabhängige Gebäudeautomation",
  "smart home neubau planung": "Smart Home Neubau Planung, bevor auf der Baustelle teure Fehler entstehen",
};

export function DynamicAdsHeadline() {
  const searchParams = useSearchParams();
  const keyword = normalizeKeyword(searchParams.get("kw"));
  const headline = keyword ? headlineByKeyword[keyword] ?? defaultHeadline : defaultHeadline;

  return <h1 className="max-w-3xl text-3xl font-bold tracking-normal sm:text-4xl lg:text-5xl">{headline}</h1>;
}

function normalizeKeyword(value: string | null) {
  if (!value) return "";

  return value
    .replaceAll("+", " ")
    .replaceAll("-", " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}
