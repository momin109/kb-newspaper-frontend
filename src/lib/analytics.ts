const VISITOR_ID_KEY = "provatbarta_visitor_id";
const SESSION_ID_KEY = "provatbarta_session_id";
const SESSION_START_KEY = "provatbarta_session_start";

const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

type TrafficSource = {
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

type TrackAnalyticsParams = {
  action?: string;
  target?: string;
  targetId?: string | null;
  details?: string | null;
};

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

// ---------------------------------------------
// Visitor ID
// ---------------------------------------------
export function getVisitorId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId = generateId("visitor");
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  return visitorId;
}

// ---------------------------------------------
// Session ID
// ---------------------------------------------
export function getSessionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const now = Date.now();

  const storedSession = sessionStorage.getItem(SESSION_ID_KEY);
  const sessionStart = sessionStorage.getItem(SESSION_START_KEY);

  if (
    storedSession &&
    sessionStart &&
    now - Number(sessionStart) < SESSION_DURATION
  ) {
    return storedSession;
  }

  const sessionId = generateId("session");

  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  sessionStorage.setItem(SESSION_START_KEY, String(now));

  return sessionId;
}

// ---------------------------------------------
// Traffic Source
// ---------------------------------------------
function getTrafficSource(): TrafficSource {
  if (typeof window === "undefined") {
    return {
      referrer: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
    };
  }

  const url = new URL(window.location.href);

  return {
    referrer: document.referrer || null,
    utmSource: url.searchParams.get("utm_source"),
    utmMedium: url.searchParams.get("utm_medium"),
    utmCampaign: url.searchParams.get("utm_campaign"),
  };
}

// ---------------------------------------------
// Track Analytics
// ---------------------------------------------
export async function trackAnalytics({
  action = "page_view",
  target = "Page",
  targetId = null,
  details = null,
}: TrackAnalyticsParams = {}): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const traffic = getTrafficSource();

    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

    await fetch(`${API_BASE_URL}/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        target,
        targetId,

        visitorId,
        sessionId,

        referrer: traffic.referrer,
        utmSource: traffic.utmSource,
        utmMedium: traffic.utmMedium,
        utmCampaign: traffic.utmCampaign,

        pageUrl: window.location.href,
        userAgent: navigator.userAgent,

        details,
      }),

      keepalive: true,
    });
  } catch (error) {
    // Analytics failure should never break the website
    console.error("Analytics tracking failed:", error);
  }
}
