import { NextResponse } from "next/server";
import { enrollOnboarding } from "@/lib/onboarding-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as { address?: string; email?: string; tier?: string };
  if (!body.address || !body.email) {
    return NextResponse.json({ error: "Missing address or email" }, { status: 400 });
  }
  await enrollOnboarding(body.address, body.email, body.tier ?? "free");
  return NextResponse.json({ ok: true });
}