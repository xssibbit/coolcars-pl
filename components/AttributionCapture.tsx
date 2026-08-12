"use client";

import { useEffect } from "react";
import { initializeAttribution } from "@/lib/analytics-client";

export function AttributionCapture() {
  useEffect(() => {
    initializeAttribution();
  }, []);
  return null;
}
