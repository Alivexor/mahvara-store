import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { calculateOrderTotals } from "@/lib/commerce";
import { getPaymentProvider } from "@/lib/payment";
import type { CouponInput } from "@/types";
import type { z } from "zod";
import type { checkoutSchema } from "@/schemas/checkout";

type CheckoutInput = z.infer<typeof checkoutSchema>;
export async function createOrder(userId: string, input: CheckoutInput) {
  return db.$transaction(async (tx) => {
    const ids = input.items.map((item) => item.productId);
    const databaseProducts = await tx.product.findMany({ where: { id: { in: ids }, status: "ACTIVE" }, include: { inventory: true } });
    if (databaseProducts.length !== ids.length) throw new Error("PRODUCT_NOT_FOUND");
    const lines = input.items.map((line) => {
      const product = databaseProducts.find((item) => item.id === line.productId);
      if (!product?.inventory || product.inventory.stock - product.inventory.reserved < line.quantity) throw new Error("OUT_OF_STOCK");
      const unitPrice = product.salePrice ?? product.price;
      return { product, quantity: line.quantity, unitPrice, total: unitPrice * line.quantity };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    const couponRecord = input.couponCode ? await tx.coupon.findUnique({ where: { code: input.couponCode.toUpperCase() } }) : null;
    const coupon: CouponInput | undefined = couponRecord ? { code: couponRecord.code, type: couponRecord.type === "PERCENTAGE" ? "percentage" : "fixed", value: couponRecord.value, minimumOrder: couponRecord.minimumOrder, maximumDiscount: couponRecord.maximumDiscount ?? undefined, expiresAt: couponRecord.expiresAt ?? undefined, usageLimit: couponRecord.usageLimit ?? undefined, usedCount: couponRecord.usedCount, isActive: couponRecord.isActive } : undefined;
    const totals = calculateOrderTotals(subtotal, coupon);
    const orderNumber = `MH-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const order = await tx.order.create({ data: { orderNumber, userId, subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, total: totals.total, couponCode: totals.discount ? coupon?.code : null, recipientName: `${input.firstName} ${input.lastName}`, phone: input.phone, province: input.province, city: input.city, addressLine: input.address, postalCode: input.postalCode, note: input.note, items: { create: lines.map((line) => ({ productId: line.product.id, productName: line.product.name, sku: line.product.sku, unitPrice: line.unitPrice, quantity: line.quantity, total: line.total })) } } });
    for (const line of lines) await tx.inventory.update({ where: { productId: line.product.id }, data: { reserved: { increment: line.quantity } } });
    if (couponRecord && totals.discount > 0) { await tx.coupon.update({ where: { id: couponRecord.id }, data: { usedCount: { increment: 1 } } }); await tx.couponUsage.create({ data: { couponId: couponRecord.id, userId, orderId: order.id } }); }
    const payment = await tx.payment.create({ data: { orderId: order.id, provider: process.env.PAYMENT_PROVIDER ?? "mock", amount: order.total, status: "PENDING" } });
    return { order, payment };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function beginPayment(paymentId: string, orderNumber: string, amount: number) {
  const provider = getPaymentProvider();
  const result = await provider.create({ paymentId, orderNumber, amount, callbackUrl: process.env.PAYMENT_CALLBACK_URL ?? "http://localhost:3000/api/payments/callback" });
  await db.payment.update({ where: { id: paymentId }, data: { authority: result.authority } });
  return result;
}
