import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const optionalShort = z.string().trim().min(1).max(120).optional();
const schema = z.object({
  type: z.enum(["VIEW", "CALL", "FAVORITE", "COMPARE", "QUICK_VIEW", "WHATSAPP", "CALLBACK", "SHARE"]),
  vehicleId: z.string().min(1),
  visitorId: z.string().min(8).max(80).optional(),
  source: optionalShort,
  medium: optionalShort,
  campaign: optionalShort,
  firstSource: optionalShort,
  firstMedium: optionalShort,
  firstCampaign: optionalShort,
  referrerHost: optionalShort,
  landingPath: z.string().trim().min(1).max(300).optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });

  const vehicle = await db.vehicle.findUnique({ where: { id: parsed.data.vehicleId }, select: { id: true } });
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });

  const user = await getCurrentUser();
  const { type, vehicleId, visitorId, ...attribution } = parsed.data;

  if (type === "VIEW" && visitorId) {
    const recent = await db.analyticsEvent.findFirst({
      where: {
        type: "VIEW",
        vehicleId,
        visitorId,
        createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) },
      },
      select: { id: true },
    });
    if (recent) return NextResponse.json({ ok: true, deduped: true });
  }

  await db.analyticsEvent.create({ data: { type, vehicleId, visitorId, userId: user?.id, ...attribution } });
  return NextResponse.json({ ok: true }, { status: 201 });
}
