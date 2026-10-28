import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(4000),
  })).max(10).optional().default([]),
});

function extractText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const data = payload as { output_text?: unknown; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  return (data.output ?? []).flatMap((item) => item.content ?? []).filter((part) => part.type === "output_text" && typeof part.text === "string").map((part) => part.text as string).join("\n").trim();
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "AI yordamchidan foydalanish uchun tizimga kiring." }, { status: 401 });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Xabar matnini tekshirib qayta yuboring." }, { status: 400 });
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI_API_KEY sozlanmagan. Loyiha ichidagi .env fayliga yangi API kalitni kiriting va serverni qayta ishga tushiring." }, { status: 503 });

  const input = [
    { role: "developer", content: "Siz EduMind ta’lim platformasining muloyim AI yordamchisisiz. Foydalanuvchiga o‘zbek tilida, aniq va sodda tushuntiring. Dars, o‘qish rejasi va mavzularni o‘rganishda yordam bering. Javoblarni ixcham tuting va bilmagan narsangizni to‘qimang." },
    ...parsed.data.history.map((item) => ({ role: item.role, content: item.content })),
    { role: "user", content: parsed.data.message },
  ];
  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.AI_MODEL || "gpt-5-mini", input, max_output_tokens: 700 }),
      signal: AbortSignal.timeout(45000),
      cache: "no-store",
    });
    if (!upstream.ok) {
      console.error("EduMind AI provider returned status", upstream.status);
      return NextResponse.json({ error: upstream.status === 401 ? "AI API kaliti yaroqsiz ko‘rinadi. .env dagi kalitni yangilab, serverni qayta ishga tushiring." : "AI hozir javob bera olmadi. API billing va foydalanish limitlarini tekshirib, qayta urinib ko‘ring." }, { status: 502 });
    }
    const reply = extractText(await upstream.json());
    if (!reply) return NextResponse.json({ error: "AI javobi bo‘sh keldi. Yana bir bor urinib ko‘ring." }, { status: 502 });
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "AI xizmatiga ulanib bo‘lmadi. Internet aloqasini tekshirib, yana urinib ko‘ring." }, { status: 502 });
  }
}
