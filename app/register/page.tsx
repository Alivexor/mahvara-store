import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/features/auth/auth-form";
export const metadata: Metadata = { title: "ساخت حساب کاربری", robots: { index: false, follow: false } };
export default function RegisterPage() { return <div className="container-shell grid min-h-[70vh] place-items-center py-12"><div className="surface-card w-full max-w-lg p-6 md:p-8"><p className="eyebrow">عضویت در ماه‌ورا</p><h1 className="mt-2 text-2xl font-black">حساب خود را بسازید</h1><p className="mb-7 mt-2 text-sm leading-7 text-muted">ثبت‌نام کوتاه، پیگیری آسان‌تر و خرید سریع‌تر.</p><Suspense><AuthForm mode="register" /></Suspense></div></div>; }
