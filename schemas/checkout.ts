import { z } from "zod";
import { iranianPhone } from "./auth";

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(70),
  phone: z.string().regex(iranianPhone),
  province: z.string().trim().min(2).max(50),
  city: z.string().trim().min(2).max(50),
  address: z.string().trim().min(10).max(500),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد."),
  note: z.string().trim().max(500).optional(),
  couponCode: z.string().trim().max(30).optional(),
  shippingMethod: z.enum(["standard", "express"]),
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1),
});
