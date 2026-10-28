import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const schema = z.object({ email: z.email(), password: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Elektron pochta yoki parol noto‘g‘ri kiritildi." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Elektron pochta yoki parol mos kelmadi. Qayta tekshirib ko‘ring." }, { status: 401 });
  }

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  return NextResponse.json({ role: user.role });
}
