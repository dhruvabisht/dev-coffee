"use client";

import { useSyncExternalStore } from "react";

// The site's own URL, read in the browser (keeps the page fully static).
export function useOrigin(fallback = "https://<this-site>") {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => fallback,
  );
}
