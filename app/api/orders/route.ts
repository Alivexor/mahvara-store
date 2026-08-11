import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { hasTrustedOrigin, rateLimit, requestFingerprint } from "@/lib/security";
import { checkoutSchema } from "@/schemas/checkout";
import { beginPayment, createOrder } from "@/services/order-service";

export async function POST(request: NextRequest) {
  if (!hasTrustedOrigin(request)) return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 403 });
  if (!rateLimit(`order:${requestFingerprint(request)}`, 5, 10 * 60_000).allowed) return NextResponse.json({ message: "تعداد درخواست‌ها زیاد است." }, { status: 429 });
  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ message: "برای ثبت سفارش ابتدا وارد حساب کاربری شوید.", loginRequired: true }, { status: 401 });
  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "اطلاعات سفارش کامل نیست." }, { status: 400 });
  try { const { order, payment } = await createOrder(user.id, parsed.data); const result = await beginPayment(payment.id, order.orderNumber, order.total); return NextResponse.json({ redirectUrl: result.redirectUrl, orderNumber: order.orderNumber }); }
  catch (error) { const code = error instanceof Error ? error.message : "UNKNOWN"; const message = code === "OUT_OF_STOCK" ? "موجودی یکی از کالاها کافی نیست." : code === "PRODUCT_NOT_FOUND" ? "یکی از کالاها دیگر قابل سفارش نیست." : "ثبت سفارش انجام نشد؛ دوباره تلاش کنید."; return NextResponse.json({ message }, { status: 409 }); }
}
