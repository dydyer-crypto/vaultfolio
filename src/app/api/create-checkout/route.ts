import { NextResponse } from "next/server";
import { getStripe, tiers, type Tier } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as { tier?: string; address?: string; period?: "monthly" | "yearly" };

  if (!body.address || !body.tier) {
    return NextResponse.json({ error: "Missing address or tier" }, { status: 400 });
  }

  const tier = body.tier as Tier;
  const config = tiers[tier];
  if (!config || !config.stripePriceId) {
    return NextResponse.json({ error: "Invalid or free tier" }, { status: 400 });
  }

  try {
    const stripe = getStripe();

    const priceId =
      body.period === "yearly" && process.env.STRIPE_PRICE_PRO_YEARLY && tier === "pro"
        ? process.env.STRIPE_PRICE_PRO_YEARLY
        : body.period === "yearly" && process.env.STRIPE_PRICE_WHALE_YEARLY && tier === "whale"
          ? process.env.STRIPE_PRICE_WHALE_YEARLY
          : config.stripePriceId;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: body.address.toLowerCase(),
      metadata: { address: body.address.toLowerCase(), tier },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/?checkout=cancelled`,
      subscription_data: {
        metadata: { address: body.address.toLowerCase(), tier },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}