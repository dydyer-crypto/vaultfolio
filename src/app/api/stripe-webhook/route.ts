import { NextResponse } from "next/server";
import { getStripe, tierFromStripePrice } from "@/lib/stripe";
import { setSubscriptionFromStripe } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    const raw = await req.text();
    event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const address =
          session.client_reference_id ??
          (session.metadata?.address as string | undefined) ??
          "";
        if (address) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          const priceId = sub.items.data[0]?.price?.id;
          const tier = tierFromStripePrice(priceId);
          await setSubscriptionFromStripe(
            address,
            sub.status === "trialing" ? "trialing" : "active",
            sub.current_period_end * 1000,
            sub.cancel_at_period_end,
            tier
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object;
        const address = (sub.metadata?.address as string | undefined) ?? "";
        if (address) {
          const priceId = sub.items.data[0]?.price?.id;
          const tier = tierFromStripePrice(priceId);
          await setSubscriptionFromStripe(
            address,
            sub.status === "active"
              ? "active"
              : sub.status === "trialing"
                ? "trialing"
                : sub.status === "past_due"
                  ? "past_due"
                  : "canceled",
            sub.current_period_end * 1000,
            sub.cancel_at_period_end,
            tier
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const address = (sub.metadata?.address as string | undefined) ?? "";
        if (address) {
          await setSubscriptionFromStripe(
            address,
            "canceled",
            sub.current_period_end * 1000,
            true,
            "free"
          );
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return NextResponse.json({ received: true });
}