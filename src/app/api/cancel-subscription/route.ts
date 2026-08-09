import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as { address?: string };
  if (!body.address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const subs = await stripe.subscriptions.list({
      limit: 100,
    });

    const activeSub = subs.data.find(
      (s) =>
        (s.status === "active" || s.status === "trialing") &&
        s.metadata?.address === (body.address ?? "").toLowerCase()
    );

    if (!activeSub) {
      return NextResponse.json({ canceled: false, message: "No active subscription found" });
    }

    await stripe.subscriptions.cancel(activeSub.id);
    return NextResponse.json({ canceled: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}