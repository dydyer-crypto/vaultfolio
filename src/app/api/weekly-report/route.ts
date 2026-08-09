import { NextResponse } from "next/server";
import { getAllOnboardingEntries, sendEmail } from "@/lib/onboarding-store";
import { getSubscription } from "@/lib/store";
import type { SubscriptionStatus } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await getAllOnboardingEntries();
  let sent = 0;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vaultfolio.app";

  for (const entry of entries) {
    const sub: SubscriptionStatus = await getSubscription(entry.address);
    if (sub.status !== "active") continue;

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    if (entry.enrolledAt > weekAgo) continue;

    const tierLabel = sub.tier === "pro" ? "Pro" : sub.tier === "whale" ? "Whale" : "";

    const html = `
      <h2>Your weekly Vaultfolio report ${tierLabel}</h2>
      <p>Here's your portfolio summary for this week:</p>
      <ul>
        <li><strong>Wallet:</strong> ${entry.address.slice(0, 8)}…${entry.address.slice(-6)}</li>
        <li><strong>Plan:</strong> ${tierLabel || "Free"}</li>
        <li><strong>Chains tracked:</strong> ${sub.tier === "whale" ? "19+" : sub.tier === "pro" ? "6" : "2"}</li>
      </ul>
      <p>Log in to see your full dashboard with live prices, NFTs and DeFi positions.</p>
      <a href="${appUrl}" style="display:inline-block;background:#3366ff;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">Open my dashboard</a>
      <p style="color:#888;font-size:12px;margin-top:20px;">You receive this email because you enabled weekly reports. Reply to unsubscribe.</p>
    `;

    const ok = await sendEmail(entry.email, "Your weekly Vaultfolio portfolio report 📊", html);
    if (ok) sent++;
  }

  return NextResponse.json({ processed: entries.length, sent });
}