// src/components/TermlyCMP.js
"use client";

import { useEffect, useMemo, useRef } from "react";

const SCRIPT_SRC_BASE = "https://app.termly.io";

export default function TermlyCMP({
  autoBlock,
  masterConsentsOrigin,
  websiteUUID,
}) {
  const scriptSrc = useMemo(() => {
    const u = new URL(SCRIPT_SRC_BASE);
    u.pathname = `/resource-blocker/${websiteUUID}`;
    if (autoBlock) u.searchParams.set("autoBlock", "on");
    if (masterConsentsOrigin)
      u.searchParams.set("masterConsentsOrigin", masterConsentsOrigin);
    return u.toString();
  }, [autoBlock, masterConsentsOrigin, websiteUUID]);

  const appended = useRef(false);

  useEffect(() => {
    // Everything that touches window/document lives here.
    if (typeof window === "undefined") return;

    // Avoid adding the script multiple times
    if (appended.current) return;
    if (document.querySelector('script[data-termly="rb"]')) return;
    if (window.__termlyScriptLoaded) return;

    const s = document.createElement("script");
    s.src = scriptSrc;
    s.async = true;
    s.dataset.termly = "rb";
    s.onload = () => {
      window.__termlyScriptLoaded = true;
      // Mark initialized if the support element exists (embed.js self-invokes)
      const mark = () => {
        if (document.querySelector("termly-code-snippet-support")) {
          window.__termlyInitialized = true;
        }
      };
      mark();
      setTimeout(mark, 0);
    };
    document.head.appendChild(s);
    appended.current = true;

    // Optional: expose a safe, idempotent initializer ONLY on the client
    window.safeTermlyInitialize = () => {
      if (window.__termlyInitialized) return;
      if (document.querySelector("termly-code-snippet-support")) {
        window.__termlyInitialized = true;
        return;
      }
      try {
        window.Termly?.initialize?.(); // provided by embed.js
        window.__termlyInitialized = true;
      } catch {
        // swallow if Termly not ready
      }
    };
  }, [scriptSrc]);

  return null;
}
