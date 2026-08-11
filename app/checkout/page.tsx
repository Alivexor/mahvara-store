import type { Metadata } from "next";
import { Suspense } from "react";
import { LockKeyhole } from "lucide-react";
import { CheckoutForm } from "@/features/cart/checkout-form";
export const metadata: Metadata = { title: "تسویه‌حساب", robots: { index: false, follow: false } };
export default function CheckoutPage() { return <div className="container-shell py-8 md:py-12"><header className="mb-8"><p className="eyebrow inline-flex items-center gap-2"><LockKeyhole size={15} /> پرداخت و اطلاعات شما محافظت می‌شود</p><h1 className="mt-2 text-2xl font-black md:text-3xl">تسویه‌حساب امن</h1><p className="mt-2 max-w-2xl text-sm leading-7 text-muted">اطلاعات سفارش را مرحله‌به‌مرحله کامل کنید؛ پیش از پرداخت، مبلغ، موجودی و تخفیف دوباره در سرور بررسی می‌شوند.</p></header><Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-ivory" />}><CheckoutForm /></Suspense></div>; }
