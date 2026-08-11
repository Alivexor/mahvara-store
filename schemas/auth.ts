import { z } from "zod";

export const iranianPhone = /^09\d{9}$/;
export const loginSchema = z.object({
  email: z.email("ایمیل معتبر وارد کنید.").transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد.").max(128),
});
export const registerSchema = loginSchema.extend({
  firstName: z.string().trim().min(2, "نام را کامل وارد کنید.").max(50),
  lastName: z.string().trim().min(2, "نام خانوادگی را کامل وارد کنید.").max(70),
  phone: z.string().regex(iranianPhone, "شماره موبایل معتبر نیست."),
});
