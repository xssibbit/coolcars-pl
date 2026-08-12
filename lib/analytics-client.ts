"use client";

const VISITOR_KEY = "coolcars_visitor_id";

function makeVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `cc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorId() {
  if (typeof window === "undefined") return undefined;
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = makeVisitorId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export function trackVehicleEvent(type: "VIEW" | "CALL" | "COMPARE" | "QUICK_VIEW", vehicleId: string) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ type, vehicleId, visitorId: getVisitorId() });
  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      if (ok) return;
    }
  } catch {}
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
