import { Redis } from "@upstash/redis";

export interface OnboardingEmail {
  address: string;
  email: string;
  tier: string;
  enrolledAt: number;
  lastSentDay: number;
}

const KEY_PREFIX = "vaultfolio:onboard:";
const INDEX_KEY = "vaultfolio:onboard:index";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) redis = new Redis({ url, token });
  return redis;
}

export async function enrollOnboarding(address: string, email: string, tier: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  const key = `${KEY_PREFIX}${address.toLowerCase()}`;
  const existing = (await r.get<OnboardingEmail>(key)) as OnboardingEmail | null;
  if (existing) return;
  const entry: OnboardingEmail = { address: address.toLowerCase(), email, tier, enrolledAt: Date.now(), lastSentDay: -1 };
  try {
    await r.set(key, entry);
    await r.sadd(INDEX_KEY, address.toLowerCase());
  } catch {
    // ignore
  }
}

export async function getOnboardingEntry(address: string): Promise<OnboardingEmail | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    return (await r.get<OnboardingEmail>(`${KEY_PREFIX}${address.toLowerCase()}`)) as OnboardingEmail | null;
  } catch {
    return null;
  }
}

export async function updateLastSentDay(address: string, day: number): Promise<void> {
  const r = getRedis();
  if (!r) return;
  const key = `${KEY_PREFIX}${address.toLowerCase()}`;
  const entry = (await r.get<OnboardingEmail>(key)) as OnboardingEmail | null;
  if (!entry) return;
  try {
    await r.set(key, { ...entry, lastSentDay: day });
  } catch {
    // ignore
  }
}

export async function getAllOnboardingEntries(): Promise<OnboardingEmail[]> {
  const r = getRedis();
  if (!r) return [];
  try {
    const addresses = (await r.smembers(INDEX_KEY)) as string[];
    const entries: OnboardingEmail[] = [];
    for (const addr of addresses) {
      const entry = (await r.get<OnboardingEmail>(`${KEY_PREFIX}${addr}`)) as OnboardingEmail | null;
      if (entry) entries.push(entry);
    }
    return entries;
  } catch {
    return [];
  }
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

export function getEmailTemplate(day: number, address: string, tier: string): EmailTemplate | null {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vaultfolio.app";

  if (day === 0) {
    return {
      subject: "Your Vaultfolio portfolio is ready 🚀",
      html: `
        <h2>Welcome to Vaultfolio${tier !== "free" ? ` ${tier}` : ""}!</h2>
        <p>Your wallet <code>${address.slice(0, 8)}…${address.slice(-6)}</code> is now tracked.</p>
        <p>You can see your tokens, NFTs and DeFi positions across multiple chains.</p>
        <a href="${appUrl}" style="display:inline-block;background:#3366ff;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">View my portfolio</a>
        <p style="color:#888;font-size:12px;margin-top:20px;">Read-only · No signatures · No risk</p>
      `,
    };
  }

  if (day === 1) {
    return {
      subject: "You're tracking your Web3 portfolio — here's what's next",
      html: `
        <h2>Did you check your dashboard?</h2>
        <p>You can now see all your assets in one place — sorted by value, with live prices.</p>
        <p><strong>What you can do today:</strong></p>
        <ul>
          <li>Add more wallets (Pro: 3, Whale: 20)</li>
          <li>Set up price alerts</li>
          <li>Export your portfolio to CSV</li>
        </ul>
        <a href="${appUrl}" style="display:inline-block;background:#3366ff;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">Open dashboard</a>
      `,
    };
  }

  if (day === 3) {
    return {
      subject: "Missing chains? Unlock Base, Arbitrum, Optimism & more",
      html: `
        <h2>Are all your assets covered?</h2>
        <p>Free plan tracks <strong>Ethereum + Polygon</strong>. But your wallet might hold assets on:</p>
        <ul>
          <li><strong>Base</strong> — Coinbase's L2</li>
          <li><strong>Arbitrum</strong> — largest L2 by TVL</li>
          <li><strong>Optimism</strong></li>
          <li><strong>Avalanche</strong> + 15 more chains</li>
        </ul>
        <p>Upgrade to <strong>Pro ($9/mo)</strong> to track 6 chains, or <strong>Whale ($29/mo)</strong> for all 19.</p>
        <a href="${appUrl}/pricing" style="display:inline-block;background:#3366ff;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">See plans</a>
      `,
    };
  }

  if (day === 5) {
    return {
      subject: "Your DeFi positions, tracked automatically",
      html: `
        <h2>DeFi tracking is here</h2>
        <p>Vaultfolio detects your DeFi positions automatically:</p>
        <ul>
          <li>Aave (aUSDC, aDAI, aETH…)</li>
          <li>Compound (cUSDC, cDAI…)</li>
          <li>Uniswap LP tokens</li>
          <li>GMX, Velodrome, Joe…</li>
        </ul>
        <p>Want price alerts on these? Get them with <strong>Pro</strong>.</p>
        <a href="${appUrl}/pricing" style="display:inline-block;background:#3366ff;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">Upgrade to Pro</a>
      `,
    };
  }

  if (day === 7) {
    return {
      subject: "⚡ Limited: 20% off your first year of Pro",
      html: `
        <h2>Special launch offer</h2>
        <p>As an early user, you get <strong>20% off</strong> your first year of Pro.</p>
        <p>That's <strong>$63/year</strong> instead of $79 — for:</p>
        <ul>
          <li>6 chains (Base, Arbitrum, Optimism, Avalanche + ETH + Polygon)</li>
          <li>3 wallets</li>
          <li>DeFi positions + alerts</li>
          <li>CSV/JSON export + 24h PnL history</li>
        </ul>
        <a href="${appUrl}/pricing" style="display:inline-block;background:#3366ff;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">Claim 20% off</a>
        <p style="color:#888;font-size:12px;margin-top:20px;">Offer expires in 48 hours.</p>
      `,
    };
  }

  return null;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@vaultfolio.app";
  if (!resendKey) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from: `Vaultfolio <${fromEmail}>`, to, subject, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}