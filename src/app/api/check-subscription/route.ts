import { NextResponse } from "next/server";
import { getSubscription } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as { address?: string };
  if (!body.address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  const sub = await getSubscription(body.address);
  return NextResponse.json(sub);
}