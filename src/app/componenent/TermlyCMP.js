// src/components/TermlyCMP.js
"use client";
import { useEffect, useMemo } from "react";

export default function TermlyCMP({
  websiteUUID,
  autoBlock = true,
  masterConsentsOrigin,
}) {
  const scriptSrc = useMemo(() => {
    if (!websiteUUID) return null;

    const params = new URLSearchParams();
    // Accept boolean or truthy string values
    if (
      autoBlock === true ||
      String(autoBlock).toLowerCase() === "true" ||
      autoBlock === "on"
    ) {
      params.set("autoBlock", "on");
    }
    if (masterConsentsOrigin)
      params.set("masterConsentsOrigin", masterConsentsOrigin);

    const qs = params.toString();
    return `https://app.termly.io/resource-blocker/${websiteUUID}${
      qs ? `?${qs}` : ""
    }`;
  }, [websiteUUID, autoBlock, masterConsentsOrigin]);

  useEffect(() => {
    if (typeof window === "undefined" || !scriptSrc) return;

    const sel = 'script[data-termly="rb"]';
    const existing = document.querySelector(sel);

    // If a script exists but src differs, replace it; otherwise do nothing.
    if (existing) {
      if (existing.getAttribute("src") !== scriptSrc) {
        existing.remove();
      } else {
        return;
      }
    }

    const s = document.createElement("script");
    s.src = scriptSrc;
    s.async = true;
    s.dataset.termly = "rb";
    document.head.appendChild(s);
  }, [scriptSrc]);

  return null;
}
