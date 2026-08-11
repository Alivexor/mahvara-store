import { compare } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { hasTrustedOrigin, rateLimit, requestFingerprint } from "@/lib/security";
import { loginSchema } from "@/schemas/auth";

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 403 });
  if (!rateLimit(`login:${requestFingerprint(request)}`, 5, 15 * 60_000).allowed) return NextResponse.json({ message: "تعداد تلاش‌ها زیاد است؛ کمی بعد دوباره امتحان کنید." }, { status: 429 });
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "اطلاعات ورود معتبر نیست." }, { status: 400 });
  try {
    const user = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !user.isActive || !(await compare(parsed.data.password, user.passwordHash))) return NextResponse.json({ message: "ایمیل یا رمز عبور نادرست است." }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ ok: true, role: user.role });
  } catch { return NextResponse.json({ message: "سرویس ورود در دسترس نیست؛ اتصال پایگاه داده را بررسی کنید." }, { status: 503 }); }
}
