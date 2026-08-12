import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 4 * 1024 * 1024;

async function requireAdmin() {
  const user = await getCurrentUser();
  return user && user.role === "ADMIN" ? user : null;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });

  return NextResponse.json({
    blobConfigured: Boolean(process.env.BLOB_STORE_ID),
    authMode: process.env.BLOB_STORE_ID ? "oidc" : "none",
  });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });

  if (!process.env.BLOB_STORE_ID) {
    return NextResponse.json({ error: "Vercel Blob nie jest połączony z projektem." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const vehicleId = String(formData.get("vehicleId") || "");
    const requestedSortOrder = Number(formData.get("sortOrder"));
    const makePrimary = String(formData.get("makePrimary") || "false") === "true";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Brak zdjęcia" }, { status: 400 });
    }
    if (!vehicleId) {
      return NextResponse.json({ error: "Brak pojazdu" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Dozwolone są tylko JPG, PNG i WEBP." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Zdjęcie jest zbyt duże po optymalizacji. Maksymalnie 4 MB." }, { status: 400 });
    }

    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true },
    });
    if (!vehicle) {
      return NextResponse.json({ error: "Pojazd nie istnieje" }, { status: 404 });
    }

    const safeName = (file.name || "photo.jpg").toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const blob = await put(`vehicles/${vehicleId}/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      storeId: process.env.BLOB_STORE_ID,
    });

    const count = await db.vehicleImage.count({ where: { vehicleId } });
    const sortOrder = Number.isFinite(requestedSortOrder) ? requestedSortOrder : count;

    const image = await db.vehicleImage.create({
      data: { vehicleId, url: blob.url, sortOrder },
    });

    if (makePrimary || count === 0) {
      await db.vehicle.update({
        where: { id: vehicleId },
        data: { image: blob.url },
      });
    }

    return NextResponse.json({ id: image.id, url: blob.url, sortOrder });
  } catch (error) {
    console.error("Blob direct upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nie udało się przesłać zdjęcia" },
      { status: 400 },
    );
  }
}
