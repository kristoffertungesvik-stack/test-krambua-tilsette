"use client";

import { useEffect } from "react";
import { BASE_PATH } from "@/lib/base-path";

/** Registers the app-shell service worker (public/sw.js) once, client-side only. */
export default function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` })
        .catch(() => {
          // Installing to the home screen still works without it; just no offline shell.
        });
    }
  }, []);
  return null;
}
