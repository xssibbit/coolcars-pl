import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Sprawdź e-mail i hasło." }, { status: 400 });
  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Nieprawidłowy e-mail lub hasło." }, { status: 401 });
  await createSession({ userId: user.id, role: user.role });
  return NextResponse.json({ ok: true, redirect: user.role === "ADMIN" ? "/admin" : "/konto" });
}
