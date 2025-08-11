// src/components/TermlyCMP.js
"use client";
import { useEffect } from "react";

export default function TermlyCMP({
  websiteUUID,
  autoBlock,
  masterConsentsOrigin,
}) {
  useEffect(() => {
    if (typeof window === "undefined" || !websiteUUID) return; // SSR guard + required prop
    if (document.querySelector('script[data-termly="rb"]')) return; // don’t inject twice

    const u = new URL("https://app.termly.io");
    u.pathname = `/resource-blocker/${websiteUUID}`;
    if (autoBlock) u.searchParams.set("autoBlock", "on");
    if (masterConsentsOrigin)
      u.searchParams.set("masterConsentsOrigin", masterConsentsOrigin);

    const s = document.createElement("script");
    s.src = u.toString();
    s.async = true;
    s.dataset.termly = "rb";
    s.onload = () => {
      // Termly self-initializes; mark ready if its element appears (optional).
      if (document.querySelector("termly-code-snippet-support")) {
        window.__termlyInitialized = true;
      }
    };
    document.head.appendChild(s);
  }, [websiteUUID, autoBlock, masterConsentsOrigin]);

  return null;
}
