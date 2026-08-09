import { NextResponse } from "next/server";
import { createAlert, listAlerts, deleteAlert } from "@/lib/alerts-store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const address = url.searchParams.get("address");
  if (!address) return NextResponse.json({ error: "Missing address" }, { status: 400 });
  const alerts = await listAlerts(address);
  return NextResponse.json({ alerts });
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    address?: string;
    action?: "create" | "delete";
    alert?: {
      coinId: string;
      symbol: string;
      condition: "above" | "below";
      targetPrice: number;
      email: string;
    };
    alertId?: string;
  };

  if (!body.address) return NextResponse.json({ error: "Missing address" }, { status: 400 });

  if (body.action === "delete" && body.alertId) {
    await deleteAlert(body.alertId);
    return NextResponse.json({ deleted: true });
  }

  if (body.action === "create" && body.alert) {
    if (!body.alert.coinId || !body.alert.symbol || !body.alert.email || body.alert.targetPrice <= 0) {
      return NextResponse.json({ error: "Invalid alert data" }, { status: 400 });
    }
    const alert = await createAlert({
      address: body.address,
      coinId: body.alert.coinId,
      symbol: body.alert.symbol,
      condition: body.alert.condition,
      targetPrice: body.alert.targetPrice,
      email: body.alert.email,
    });
    return NextResponse.json({ alert });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}