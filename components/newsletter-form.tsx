"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  async function submit(formData: FormData) {
    setStatus("loading");
    const response = await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email: formData.get("email") }), headers: { "Content-Type": "application/json" } });
    setStatus(response.ok ? "success" : "error");
  }
  return <form action={submit} className="mt-6"><div className="flex flex-col gap-2 sm:flex-row"><label className="sr-only" htmlFor="newsletter-email">ایمیل</label><input id="newsletter-email" name="email" type="email" required dir="ltr" className="field flex-1 text-left" placeholder="you@example.com" /><button className="btn-primary shrink-0" disabled={status === "loading"}>{status === "loading" ? "در حال ثبت…" : "عضویت در خبرنامه"}</button></div><p className="mt-3 min-h-5 text-xs" aria-live="polite">{status === "success" ? "عضویت شما ثبت شد؛ خوشحالیم که همراه مایید." : status === "error" ? "ایمیل معتبر وارد کنید و دوباره تلاش کنید." : "فقط خبرهای مهم و پیشنهادهای منتخب؛ بدون پیام‌های مزاحم."}</p></form>;
}
