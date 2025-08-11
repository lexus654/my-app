// File: src/components/TermlyCMP.js
"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SCRIPT_SRC_BASE = "https://app.termly.io";

// Inner component: where the hooks actually run
function TermlyCMPInner({ autoBlock, masterConsentsOrigin, websiteUUID }) {
  const scriptSrc = useMemo(() => {
    const src = new URL(SCRIPT_SRC_BASE);
    src.pathname = `/resource-blocker/${websiteUUID}`;
    if (autoBlock) src.searchParams.set("autoBlock", "on");
    if (masterConsentsOrigin)
      src.searchParams.set("masterConsentsOrigin", masterConsentsOrigin);
    return src.toString();
  }, [autoBlock, masterConsentsOrigin, websiteUUID]);

  const isScriptAdded = useRef(false);

  useEffect(() => {
    if (isScriptAdded.current) return;
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => {
      // Initialize once the script is ready
      window.Termly?.initialize?.();
    };
    document.head.appendChild(script);
    isScriptAdded.current = true;
  }, [scriptSrc]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Re-initialize when route or query string changes
  useEffect(() => {
    window.Termly?.initialize?.();
  }, [pathname, searchParams]);

  return null;
}

// Exported component: always wrapped in Suspense
export default function TermlyCMP(props) {
  return (
    <Suspense fallback={null}>
      <TermlyCMPInner {...props} />
    </Suspense>
  );
}
