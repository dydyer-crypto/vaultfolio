import { NextResponse } from "next/server";
import { getAllAlerts, markAlertTriggered } from "@/lib/alerts-store";
import type { PriceMap } from "@/lib/prices";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alerts = await getAllAlerts();
  if (alerts.length === 0) {
    return NextResponse.json({ checked: 0, triggered: 0 });
  }

  const coinIds = Array.from(new Set(alerts.map((a) => a.coinId)));
  let prices: PriceMap = {};
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&vs_currencies=usd`,
      { headers: { accept: "application/json" } }
    );
    if (res.ok) prices = (await res.json()) as PriceMap;
  } catch {
    return NextResponse.json({ error: "Price fetch failed" }, { status: 500 });
  }

  let triggered = 0;
  const emails: { to: string; alert: typeof alerts[0]; price: number }[] = [];

  for (const alert of alerts) {
    const price = prices[alert.coinId]?.usd;
    if (price === undefined) continue;

    const shouldTrigger =
      (alert.condition === "above" && price >= alert.targetPrice) ||
      (alert.condition === "below" && price <= alert.targetPrice);

    if (shouldTrigger) {
      triggered++;
      emails.push({ to: alert.email, alert, price });
      await markAlertTriggered(alert.id);
    }
  }

  // Send emails via Resend if configured
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "alerts@vaultfolio.app";
  if (resendKey && emails.length > 0) {
    for (const { to, alert, price } of emails) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            authorization: `Bearer ${resendKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            from: `Vaultfolio <${fromEmail}>`,
            to,
            subject: `Price alert: ${alert.symbol} ${alert.condition} ${alert.targetPrice} USD`,
            html: `
              <h2>Price alert triggered</h2>
              <p><strong>${alert.symbol}</strong> is now at <strong>$${price.toFixed(4)}</strong></p>
              <p>Your alert: ${alert.condition} $${alert.targetPrice}</p>
              <p>Track your portfolio at <a href="https://vaultfolio.app">vaultfolio.app</a></p>
            `,
          }),
        });
      } catch {
        // ignore email send failure
      }
    }
  }

  return NextResponse.json({ checked: alerts.length, triggered });
}