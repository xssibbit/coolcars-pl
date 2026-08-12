import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function isAdmin() {
  const user = await getCurrentUser();
  return Boolean(user && user.role === "ADMIN");
}

function blobConfigured() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  return NextResponse.json({
    blobConfigured: blobConfigured(),
    authMode: process.env.BLOB_STORE_ID ? "oidc" : process.env.BLOB_READ_WRITE_TOKEN ? "token" : "none",
  });
}

export async function POST(request: Request) {
  if (!blobConfigured()) {
    return NextResponse.json(
      { error: "Vercel Blob nie jest połączony z projektem." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") throw new Error("Brak uprawnień");

        const payload = JSON.parse(clientPayload || "{}") as {
          vehicleId?: string;
          sortOrder?: number;
          makePrimary?: boolean;
        };
        if (!payload.vehicleId) throw new Error("Brak pojazdu");

        const vehicle = await db.vehicle.findUnique({
          where: { id: payload.vehicleId },
          select: { id: true },
        });
        if (!vehicle) throw new Error("Pojazd nie istnieje");

        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            vehicleId: payload.vehicleId,
            sortOrder: Number.isFinite(payload.sortOrder) ? payload.sortOrder : 0,
            makePrimary: payload.makePrimary === true,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload || "{}") as {
          vehicleId?: string;
          sortOrder?: number;
          makePrimary?: boolean;
        };
        if (!payload.vehicleId) return;

        const sortOrder = Number.isFinite(payload.sortOrder) ? Number(payload.sortOrder) : 0;
        await db.$transaction(async (tx) => {
          await tx.vehicleImage.create({
            data: { vehicleId: payload.vehicleId!, url: blob.url, sortOrder },
          });
          if (payload.makePrimary) {
            await tx.vehicle.update({
              where: { id: payload.vehicleId! },
              data: { image: blob.url },
            });
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
