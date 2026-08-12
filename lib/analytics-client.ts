"use client";

const VISITOR_KEY = "coolcars_visitor_id";
const FIRST_TOUCH_KEY = "coolcars_first_touch";
const SESSION_TOUCH_KEY = "coolcars_session_touch";

type Touch = {
  source: string;
  medium: string;
  campaign?: string;
  referrerHost?: string;
  landingPath?: string;
};

export type AnalyticsAttribution = {
  visitorId?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  firstSource?: string;
  firstMedium?: string;
  firstCampaign?: string;
  referrerHost?: string;
  landingPath?: string;
};

export type TrackableVehicleEvent = "VIEW" | "CALL" | "FAVORITE" | "COMPARE" | "QUICK_VIEW" | "WHATSAPP" | "CALLBACK" | "SHARE";

function makeVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `cc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clean(value: string | null | undefined, max = 120) {
  const text = value?.trim();
  return text ? text.slice(0, max) : undefined;
}

function readJson<T>(storage: Storage, key: string): T | undefined {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}

function writeJson(storage: Storage, key: string, value: unknown) {
  try { storage.setItem(key, JSON.stringify(value)); } catch {}
}

function referrerTouch(host: string): Pick<Touch, "source" | "medium"> {
  const h = host.toLowerCase().replace(/^www\./, "");
  if (h.includes("google.")) return { source: "google", medium: "organic" };
  if (h.includes("bing.com")) return { source: "bing", medium: "organic" };
  if (h.includes("facebook.com") || h.includes("fb.com")) return { source: "facebook", medium: "social" };
  if (h.includes("instagram.com")) return { source: "instagram", medium: "social" };
  if (h.includes("tiktok.com")) return { source: "tiktok", medium: "social" };
  if (h.includes("youtube.com") || h.includes("youtu.be")) return { source: "youtube", medium: "social" };
  if (h.includes("linkedin.com")) return { source: "linkedin", medium: "social" };
  return { source: h.slice(0, 120), medium: "referral" };
}

function detectTouch(): { touch: Touch; explicit: boolean } | undefined {
  if (typeof window === "undefined") return undefined;
  const url = new URL(window.location.href);
  const params = url.searchParams;
  const landingPath = clean(`${url.pathname}${url.search}`, 300);
  const utmSource = clean(params.get("utm_source"));
  const utmMedium = clean(params.get("utm_medium"));
  const utmCampaign = clean(params.get("utm_campaign"));

  if (utmSource) return { touch: { source: utmSource.toLowerCase(), medium: utmMedium?.toLowerCase() || "campaign", campaign: utmCampaign, landingPath }, explicit: true };
  if (params.get("gclid")) return { touch: { source: "google", medium: "cpc", campaign: utmCampaign, landingPath }, explicit: true };
  if (params.get("fbclid")) return { touch: { source: "facebook", medium: "paid_social", campaign: utmCampaign, landingPath }, explicit: true };
  if (params.get("ttclid")) return { touch: { source: "tiktok", medium: "paid_social", campaign: utmCampaign, landingPath }, explicit: true };
  if (params.get("msclkid")) return { touch: { source: "bing", medium: "cpc", campaign: utmCampaign, landingPath }, explicit: true };

  if (document.referrer) {
    try {
      const ref = new URL(document.referrer);
      if (ref.host !== window.location.host) {
        const mapped = referrerTouch(ref.hostname);
        return { touch: { ...mapped, referrerHost: clean(ref.hostname), landingPath }, explicit: true };
      }
      return undefined;
    } catch {}
  }

  return { touch: { source: "direct", medium: "none", landingPath }, explicit: false };
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

export function initializeAttribution() {
  if (typeof window === "undefined") return;
  const detected = detectTouch();
  let session = readJson<Touch>(sessionStorage, SESSION_TOUCH_KEY);
  if (!session || detected?.explicit) {
    session = detected?.touch || { source: "direct", medium: "none", landingPath: window.location.pathname };
    writeJson(sessionStorage, SESSION_TOUCH_KEY, session);
  }
  const first = readJson<Touch>(localStorage, FIRST_TOUCH_KEY);
  if (!first && session) writeJson(localStorage, FIRST_TOUCH_KEY, session);
}

export function getAttribution(): AnalyticsAttribution {
  if (typeof window === "undefined") return {};
  initializeAttribution();
  const current = readJson<Touch>(sessionStorage, SESSION_TOUCH_KEY);
  const first = readJson<Touch>(localStorage, FIRST_TOUCH_KEY);
  return {
    visitorId: getVisitorId(),
    source: current?.source,
    medium: current?.medium,
    campaign: current?.campaign,
    firstSource: first?.source,
    firstMedium: first?.medium,
    firstCampaign: first?.campaign,
    referrerHost: current?.referrerHost,
    landingPath: current?.landingPath,
  };
}

export function trackVehicleEvent(type: TrackableVehicleEvent, vehicleId: string) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ type, vehicleId, ...getAttribution() });
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
