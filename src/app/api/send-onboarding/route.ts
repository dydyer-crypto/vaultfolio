import { NextResponse } from "next/server";
import { getAllOnboardingEntries, updateLastSentDay, getEmailTemplate, sendEmail } from "@/lib/onboarding-store";

export const runtime = "nodejs";

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS = [0, 1, 3, 5, 7];

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await getAllOnboardingEntries();
  let sent = 0;

  for (const entry of entries) {
    const elapsed = Date.now() - entry.enrolledAt;
    for (const day of DAYS) {
      if (day <= entry.lastSentDay) continue;
      const dayStart = day * DAY_MS;
      const dayEnd = (day + 1) * DAY_MS;
      if (elapsed >= dayStart && elapsed < dayEnd + DAY_MS) {
        const template = getEmailTemplate(day, entry.address, entry.tier);
        if (template) {
          const ok = await sendEmail(entry.email, template.subject, template.html);
          if (ok) {
            sent++;
            await updateLastSentDay(entry.address, day);
          }
        }
        break;
      }
    }
  }

  return NextResponse.json({ processed: entries.length, sent });
}