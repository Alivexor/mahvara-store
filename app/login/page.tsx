import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/features/auth/auth-form";
export const metadata: Metadata = { title: "ورود به حساب کاربری", robots: { index: false, follow: false } };
export default function LoginPage() { return <div className="container-shell grid min-h-[70vh] place-items-center py-12"><div className="surface-card w-full max-w-md p-6 md:p-8"><p className="eyebrow">خوش آمدید</p><h1 className="mt-2 text-2xl font-black">ورود به حساب ماه‌ورا</h1><p className="mb-7 mt-2 text-sm leading-7 text-muted">سفارش‌ها، آدرس‌ها و علاقه‌مندی‌های خود را یکجا ببینید.</p><Suspense><AuthForm mode="login" /></Suspense></div></div>; }
