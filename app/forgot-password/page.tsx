import type { Metadata } from "next";
import { PasswordResetRequest } from "@/components/password-reset-request";
export const metadata: Metadata = { title: "بازیابی رمز عبور", robots: { index: false, follow: false } };
export default function ForgotPasswordPage() { return <div className="container-shell grid min-h-[65vh] place-items-center py-12"><div className="surface-card w-full max-w-md p-7"><p className="eyebrow">بازیابی حساب</p><h1 className="mt-2 text-2xl font-black">فراموشی رمز عبور</h1><p className="mt-3 text-sm leading-7 text-muted">یک درخواست یک‌بارمصرف و زمان‌دار ساخته می‌شود. ارسال واقعی ایمیل پس از تنظیم Adapter ایمیل مالک فروشگاه فعال خواهد شد.</p><PasswordResetRequest/></div></div>; }
