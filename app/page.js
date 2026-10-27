import { headers } from "next/headers";

// Always render per request — the host changes per subdomain.
export const dynamic = "force-dynamic";

// Optional: set ROOT_DOMAIN in Vercel (e.g. "domain.com").
// If unset, the first label of a 3+ part host is used.
function getSubdomain(host) {
  const hostname = (host || "").split(":")[0].toLowerCase();
  const root = (process.env.ROOT_DOMAIN || "").toLowerCase();

  if (root) {
    if (hostname === root || hostname === `www.${root}`) return null;
    if (hostname.endsWith(`.${root}`)) return hostname.slice(0, -(root.length + 1));
    return null;
  }

  // Local dev: mani.localhost:3000
  if (hostname.endsWith(".localhost")) return hostname.replace(".localhost", "");

  const parts = hostname.split(".");
  if (parts.length < 3 || parts[0] === "www") return null;
  return parts[0];
}

export default async function Page() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const sub = getSubdomain(host);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>{sub || "no subdomain"}</h1>
    </main>
  );
}
