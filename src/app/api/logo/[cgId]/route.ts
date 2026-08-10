import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Logo proxy with multiple sources + fallback.
 * CoinGecko blocks hotlinking (403) — we try several sources and fall back.
 */

const SOURCES: Array<(id: string) => string> = [
  // IconScout (free, no hotlink protection)
  (id) => `https://img.icons8.com/color/96/${id}.png`,
  // GitHub hosted CoinIcons
  (id) => `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${id}.svg`,
  // CoinGecko (last resort, may 403)
  (id) => `https://assets.coingecko.com/coins/${id}/small/${id}.png`,
];

const CG_TO_IDS: Record<string, { icons8?: string; github?: string }> = {
  "usd-coin": { icons8: "usdc", github: "usdc" },
  tether: { icons8: "tether", github: "usdt" },
  uniswap: { icons8: "uniswap", github: "uni" },
  chainlink: { icons8: "chainlink", github: "link" },
  "wrapped-bitcoin": { icons8: "wrapped-bitcoin", github: "wbtc" },
  dai: { icons8: "dai", github: "dai" },
  "matic-network": { icons8: "polygon", github: "matic" },
  aave: { icons8: "aave", github: "aave" },
  "degen-base": { github: "degen" },
  "brettt-base": { github: "brett" },
  arbitrum: { icons8: "arbitrum", github: "arb" },
  gmx: { icons8: "gmx", github: "gmx" },
  optimism: { icons8: "optimism", github: "op" },
  "velodrome-finance": { github: "velo" },
  joe: { icons8: "joe", github: "joe" },
  ethereum: { icons8: "ethereum", github: "eth" },
  avalanche_2: { icons8: "avalanche", github: "avax" },
  "avalanche-2": { icons8: "avalanche", github: "avax" },
};

export async function GET(req: Request, { params }: { params: { cgId: string } }) {
  const cgId = params.cgId;
  const idMap = CG_TO_IDS[cgId];

  if (!idMap) {
    return NextResponse.json({ error: "Unknown token" }, { status: 404 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  // Try each source
  for (const source of SOURCES) {
    try {
      const url = idMap.github
        ? source(idMap.github)
        : idMap.icons8
          ? source(idMap.icons8)
          : "";
      if (!url) continue;

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://vaultfolio.app",
        },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("image") || contentType.includes("svg") || contentType.includes("octet-stream")) {
          const buffer = await res.arrayBuffer();
          const type = contentType.includes("svg") ? "image/svg+xml" : "image/png";
          return new NextResponse(new Uint8Array(buffer), {
            headers: {
              "Content-Type": type,
              "Cache-Control": "public, max-age=86400, immutable",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      }
    } catch {
      continue;
    }
  }

  // Fallback: return transparent placeholder SVG with token initials
  const initials = (idMap.icons8 ?? idMap.github ?? cgId)
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" fill="#3366ff" opacity="0.2"/><text x="48" y="62" font-family="Inter,sans-serif" font-size="36" font-weight="700" fill="#588bff" text-anchor="middle">${initials}</text></svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}