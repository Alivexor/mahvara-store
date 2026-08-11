import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { hasTrustedOrigin, rateLimit, requestFingerprint } from "@/lib/security";
import { registerSchema } from "@/schemas/auth";

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 403 });
  if (!rateLimit(`register:${requestFingerprint(request)}`, 4, 60 * 60_000).allowed) return NextResponse.json({ message: "تعداد درخواست‌ها زیاد است." }, { status: 429 });
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "اطلاعات معتبر نیست." }, { status: 400 });
  try {
    const existing = await db.user.findFirst({ where: { OR: [{ email: parsed.data.email }, { phone: parsed.data.phone }] } });
    if (existing) return NextResponse.json({ message: "حسابی با این ایمیل یا موبایل وجود دارد." }, { status: 409 });
    const { password, ...profile } = parsed.data;
    const user = await db.user.create({ data: { ...profile, passwordHash: await hash(password, 12) } });
    await createSession(user.id);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ message: "ثبت‌نام در دسترس نیست؛ اتصال پایگاه داده را بررسی کنید." }, { status: 503 }); }
}
