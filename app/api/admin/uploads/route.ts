import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") throw new Error("Brak uprawnień");

        const payload = JSON.parse(clientPayload || "{}") as { vehicleId?: string };
        if (!payload.vehicleId) throw new Error("Brak pojazdu");
        const vehicle = await db.vehicle.findUnique({ where: { id: payload.vehicleId }, select: { id: true } });
        if (!vehicle) throw new Error("Pojazd nie istnieje");

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ vehicleId: payload.vehicleId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const { vehicleId } = JSON.parse(tokenPayload || "{}") as { vehicleId?: string };
        if (!vehicleId) return;

        const count = await db.vehicleImage.count({ where: { vehicleId } });
        await db.$transaction(async (tx) => {
          await tx.vehicleImage.create({
            data: { vehicleId, url: blob.url, sortOrder: count },
          });
          if (count === 0) {
            await tx.vehicle.update({ where: { id: vehicleId }, data: { image: blob.url } });
          }
        });
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload token error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Nie udało się przesłać zdjęcia" },
      { status: 400 },
    );
  }
}
