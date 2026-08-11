import type { CouponInput, OrderTotals } from "@/types";

export const FREE_SHIPPING_THRESHOLD = 2_500_000;
export const STANDARD_SHIPPING = 95_000;

export function calculateCoupon(subtotal: number, coupon?: CouponInput, now = new Date()): number {
  if (!coupon || !coupon.isActive || subtotal < coupon.minimumOrder) return 0;
  if (coupon.expiresAt && coupon.expiresAt <= now) return 0;
  if (coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) return 0;
  const raw = coupon.type === "percentage" ? Math.floor((subtotal * coupon.value) / 100) : coupon.value;
  return Math.min(raw, coupon.maximumDiscount ?? raw, subtotal);
}

export function calculateOrderTotals(subtotal: number, coupon?: CouponInput): OrderTotals {
  const discount = calculateCoupon(subtotal, coupon);
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0 ? 0 : STANDARD_SHIPPING;
  return { subtotal, discount, shipping, total: discountedSubtotal + shipping };
}
