import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payment";
import { hasTrustedOrigin, rateLimit, requestFingerprint } from "@/lib/security";

async function releaseFailedPayment(payment: {
  id: string;
  order: { id: string; items: { productId: string; quantity: number }[] };
}, failureReason?: string) {
  await db.$transaction(async (tx) => {
    const updated = await tx.payment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: { status: "FAILED", failureReason },
    });

    if (!updated.count) return;

    for (const item of payment.order.items) {
      const released = await tx.inventory.updateMany({
        where: { productId: item.productId, reserved: { gte: item.quantity } },
        data: { reserved: { decrement: item.quantity } },
      });
      if (released.count !== 1) throw new Error("INVENTORY_RESERVATION_CONFLICT");
    }

    const couponUsage = await tx.couponUsage.findUnique({
      where: { orderId: payment.order.id },
      select: { couponId: true },
    });
    if (couponUsage) {
      const released = await tx.coupon.updateMany({
        where: { id: couponUsage.couponId, usedCount: { gte: 1 } },
        data: { usedCount: { decrement: 1 } },
      });
      if (released.count !== 1) throw new Error("COUPON_USAGE_CONFLICT");
      await tx.couponUsage.delete({ where: { orderId: payment.order.id } });
    }

    await tx.order.update({ where: { id: payment.order.id }, data: { status: "CANCELLED" } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function POST(request: NextRequest) {
  // A payment gateway calls this endpoint from its own origin. Authentication is
  // performed by the provider's server-side verification, not a browser Origin header.
  if (!rateLimit(`callback:${requestFingerprint(request)}`, 15).allowed) {
    return NextResponse.json({ message: "درخواست بیش از حد" }, { status: 429 });
  }

  const provider = getPaymentProvider();
  // The mock flow is initiated by the browser and should retain CSRF protection.
  // A real gateway calls from a remote origin and is authenticated by its provider verification.
  if (provider.name === "mock" && !hasTrustedOrigin(request)) {
    return NextResponse.json({ message: "درخواست نامعتبر است." }, { status: 403 });
  }

  let body: { authority?: string; status?: string };
  try {
    body = await request.json() as { authority?: string; status?: string };
  } catch {
    return NextResponse.json({ message: "بدنه درخواست معتبر نیست." }, { status: 400 });
  }

  if (!body.authority) return NextResponse.json({ message: "شناسه پرداخت موجود نیست." }, { status: 400 });

  const payment = await db.payment.findUnique({
    where: { authority: body.authority },
    include: { order: { include: { items: true } } },
  });
  if (!payment) return NextResponse.json({ message: "پرداخت پیدا نشد." }, { status: 404 });
  if (payment.status === "VERIFIED") {
    return NextResponse.json({ ok: true, orderNumber: payment.order.orderNumber, referenceId: payment.referenceId, duplicate: true });
  }
  if (payment.status !== "PENDING") {
    return NextResponse.json({ ok: false, orderNumber: payment.order.orderNumber, message: "این پرداخت دیگر قابل تأیید نیست." }, { status: 409 });
  }

  let verification;
  try {
    verification = await provider.verify({ authority: body.authority, amount: payment.amount, status: body.status });
  } catch {
    return NextResponse.json({ message: "تأیید پرداخت موقتاً در دسترس نیست." }, { status: 502 });
  }

  if (!verification.success) {
    await releaseFailedPayment(payment, verification.failureReason);
    return NextResponse.json({ ok: false, orderNumber: payment.order.orderNumber, message: verification.failureReason }, { status: 402 });
  }

  const result = await db.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({
      where: { id: payment.id, status: "PENDING" },
      data: { status: "VERIFIED", referenceId: verification.referenceId, verifiedAt: new Date() },
    });
    if (!claimed.count) return { verified: false };

    for (const item of payment.order.items) {
      const changed = await tx.inventory.updateMany({
        where: { productId: item.productId, stock: { gte: item.quantity }, reserved: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity }, reserved: { decrement: item.quantity } },
      });
      if (changed.count !== 1) throw new Error("INVENTORY_CONFLICT");
    }

    await tx.order.update({ where: { id: payment.order.id }, data: { status: "PAID" } });
    await tx.auditLog.create({
      data: {
        action: "PAYMENT_VERIFIED",
        entityType: "Order",
        entityId: payment.order.id,
        metadata: { orderNumber: payment.order.orderNumber, referenceId: verification.referenceId },
      },
    });
    return { verified: true };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  if (!result.verified) {
    const current = await db.payment.findUnique({ where: { id: payment.id }, select: { status: true, referenceId: true } });
    if (current?.status === "VERIFIED") {
      return NextResponse.json({ ok: true, orderNumber: payment.order.orderNumber, referenceId: current.referenceId, duplicate: true });
    }
    return NextResponse.json({ ok: false, orderNumber: payment.order.orderNumber, message: "این پرداخت دیگر قابل تأیید نیست." }, { status: 409 });
  }

  return NextResponse.json({ ok: true, orderNumber: payment.order.orderNumber, referenceId: verification.referenceId });
}
