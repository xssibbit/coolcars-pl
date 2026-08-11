import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Uzupełnij poprawnie wszystkie pola." }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  if (await db.user.findUnique({ where: { email } })) return NextResponse.json({ error: "Konto z tym adresem już istnieje." }, { status: 409 });
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const role = configuredAdminEmail && email === configuredAdminEmail ? "ADMIN" : "USER";
  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
      role,
    },
  });
  await createSession({ userId: user.id, role: user.role });
  return NextResponse.json({ ok: true, redirect: "/konto" });
}
