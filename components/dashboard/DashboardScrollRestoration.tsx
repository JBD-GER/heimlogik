"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const storagePrefix = "heimlogik-dashboard-scroll";

function storageKeys(pathname: string, search: string) {
  return [`${storagePrefix}:${pathname}${search}`, `${storagePrefix}:${pathname}`];
}

function saveScrollPosition() {
  const { pathname, search } = window.location;
  const value = JSON.stringify({ x: window.scrollX, y: window.scrollY, at: Date.now() });

  try {
    for (const key of storageKeys(pathname, search)) {
      window.sessionStorage.setItem(key, value);
    }
  } catch {
    return;
  }
}

function readScrollPosition(pathname: string, search: string) {
  try {
    for (const key of storageKeys(pathname, search)) {
      const raw = window.sessionStorage.getItem(key);
      if (!raw) continue;
      window.sessionStorage.removeItem(key);

      try {
        const parsed = JSON.parse(raw) as { x?: number; y?: number; at?: number };
        const isFresh = typeof parsed.at === "number" && Date.now() - parsed.at < 60_000;
        if (isFresh && typeof parsed.y === "number") return { x: parsed.x ?? 0, y: parsed.y };
      } catch {
        return null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function DashboardScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    window.history.scrollRestoration = "manual";

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.dataset.scrollRestore === "off") return;

      const method = form.method.toLowerCase();
      if (method && method !== "post") return;

      saveScrollPosition();
    };

    document.addEventListener("submit", onSubmit, { capture: true });
    return () => document.removeEventListener("submit", onSubmit, { capture: true });
  }, []);

  useEffect(() => {
    const search = window.location.search;
    const position = readScrollPosition(pathname, search);
    if (!position) return;

    requestAnimationFrame(() => {
      window.scrollTo({ left: position.x, top: position.y, behavior: "auto" });
      requestAnimationFrame(() => window.scrollTo({ left: position.x, top: position.y, behavior: "auto" }));
    });
  }, [pathname]);

  return null;
}
