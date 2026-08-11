"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const search = useSearchParams();
  async function submit(formData: FormData) {
    setLoading(true); setError("");
    const payload = Object.fromEntries(formData);
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) { setError(data.message ?? "خطایی رخ داد؛ لطفاً دوباره تلاش کنید."); return; }
      const next = search.get("next");
      router.push(next?.startsWith("/") && !next.startsWith("//") ? next : "/account"); router.refresh();
    } catch { setError("ارتباط با سرور برقرار نشد؛ اتصال اینترنت را بررسی کنید."); }
    finally { setLoading(false); }
  }
  return <form action={submit} className="space-y-4">{mode === "register" && <><div className="grid grid-cols-2 gap-3"><div><label className="field-label" htmlFor="firstName">نام</label><input className="field" id="firstName" name="firstName" autoComplete="given-name" required /></div><div><label className="field-label" htmlFor="lastName">نام خانوادگی</label><input className="field" id="lastName" name="lastName" autoComplete="family-name" required /></div></div><div><label className="field-label" htmlFor="phone">شماره موبایل</label><input className="field text-left" dir="ltr" id="phone" name="phone" inputMode="tel" autoComplete="tel" placeholder="09123456789" required /></div></>}<div><label className="field-label" htmlFor="email">ایمیل</label><input className="field text-left" dir="ltr" id="email" name="email" type="email" autoComplete="email" required /></div><div><div className="flex justify-between"><label className="field-label" htmlFor="password">رمز عبور</label>{mode === "login" && <Link href="/forgot-password" className="text-xs font-bold text-brand">رمز را فراموش کرده‌اید؟</Link>}</div><input className="field text-left" dir="ltr" id="password" name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required /><p className="mt-1 text-xs text-muted">حداقل ۸ کاراکتر</p></div><p className="min-h-6 text-sm font-bold text-red-700" role="alert">{error}</p><button className="btn-primary w-full" disabled={loading}>{loading ? "کمی صبر کنید…" : mode === "login" ? "ورود به ماه‌ورا" : "ساخت حساب کاربری"}</button><p className="text-center text-sm text-muted">{mode === "login" ? "حساب ندارید؟" : "قبلاً ثبت‌نام کرده‌اید؟"} <Link className="font-black text-brand" href={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "ثبت‌نام" : "ورود"}</Link></p></form>;
}
