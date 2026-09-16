import type { NextConfig } from "next";

const production = process.env.NODE_ENV === "production";
const apiOrigin = (() => {
  try { return process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL).origin : ""; }
  catch { return ""; }
})();
const connectSources = ["'self'", apiOrigin, "https://api.stripe.com", "https://checkout.stripe.com", ...(production ? [] : ["http://localhost:*", "ws://localhost:*"])].filter(Boolean).join(" ");
const scriptSources = ["'self'", "'unsafe-inline'", "https://js.stripe.com", ...(production ? [] : ["'unsafe-eval'"])].join(" ");
const directives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://checkout.stripe.com",
  `script-src ${scriptSources}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  `connect-src ${connectSources}`,
  "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' https://res.cloudinary.com",
  "worker-src 'self' blob:",
];
if (production) directives.push("upgrade-insecure-requests");
const securityHeaders = [
  { key: "Content-Security-Policy", value: directives.join("; ") },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(production ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/dr6linfry/image/upload/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/dk3v0m35u/image/upload/**" },
    ],
  },
  async headers() { return [{ source: "/:path*", headers: securityHeaders }]; },
};
export default nextConfig;
