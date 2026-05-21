"use client";

import { useState } from "react";

type EuroInputProps = {
  name: string;
  placeholder?: string;
  className?: string;
};

function parseEuroValue(value: string) {
  const cleaned = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function formatEuroValue(value: string) {
  const number = parseEuroValue(value);
  if (number === null) return "";

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(number);
}

export function EuroInput({ name, placeholder, className }: EuroInputProps) {
  const [value, setValue] = useState("");

  return (
    <input
      name={name}
      inputMode="decimal"
      value={value}
      placeholder={placeholder}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => setValue((current) => formatEuroValue(current))}
      onFocus={() => setValue((current) => current.replace(/[^\d,.-]/g, ""))}
      className={className}
    />
  );
}
