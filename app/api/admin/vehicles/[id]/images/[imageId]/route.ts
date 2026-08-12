import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });

  const { id, imageId } = await params;
  const image = await db.vehicleImage.findFirst({ where: { id: imageId, vehicleId: id } });
  if (!image) return NextResponse.json({ error: "Zdjęcie nie istnieje" }, { status: 404 });

  try {
    if (process.env.BLOB_STORE_ID) {
      await del(image.url, { storeId: process.env.BLOB_STORE_ID });
    }
    await db.vehicleImage.delete({ where: { id: imageId } });
    const next = await db.vehicleImage.findFirst({ where: { vehicleId: id }, orderBy: { sortOrder: "asc" } });
    await db.vehicle.update({
      where: { id },
      data: { image: next?.url || "/vehicles/truck-1.svg" },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Blob delete error:", error);
    return NextResponse.json({ error: "Nie udało się usunąć zdjęcia" }, { status: 400 });
  }
}
