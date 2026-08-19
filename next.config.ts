import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Only one third-party origin in the whole app: the self-hosted Umami
// analytics instance below, which needs both script-src (to load
// script.js) and connect-src (its tracking beacon posts back to the same
// origin). Everything else stays 'self' — the only other non-'self' need is
// the data: URI that html-to-image's PNG export round-trips through fetch().
// 'unsafe-inline' on script-src is required because Next.js's App Router
// boots via inline scripts (the RSC payload pushes); a strict nonce-based
// CSP would need proxy.ts to mint one per request, which isn't worth the
// added infra for a static, no-backend app with this little injection
// surface to defend against in the first place.
const ANALYTICS_ORIGIN = "https://stats.jeromewirth.de";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${ANALYTICS_ORIGIN}${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self' data: ${ANALYTICS_ORIGIN};
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
