"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, LockKeyhole } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { products } from "@/lib/catalog";
import { calculateOrderTotals } from "@/lib/commerce";
import { formatPrice } from "@/utils/format";
import { useCart } from "./cart-provider";
import type { CouponInput } from "@/types";

const couponMap: Record<string, CouponInput> = { ROUTINE15: { code: "ROUTINE15", type: "percentage", value: 15, minimumOrder: 2_000_000, maximumDiscount: 700_000, usedCount: 0, isActive: true }, WELCOME200: { code: "WELCOME200", type: "fixed", value: 200_000, minimumOrder: 1_200_000, usedCount: 0, isActive: true } };
const steps = ["نشانی", "ارسال", "بازبینی", "پرداخت"];

export function CheckoutForm() {
  const { items, hydrated } = useCart();
  const search = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const lines = useMemo(() => items.map((line) => ({ ...line, product: products.find((p) => p.id === line.productId) })).filter((line) => line.product), [items]);
  const subtotal = lines.reduce((sum, line) => sum + ((line.product?.salePrice ?? line.product?.price) ?? 0) * line.quantity, 0);
  const couponCode = search.get("coupon")?.toUpperCase() ?? "";
  const totals = calculateOrderTotals(subtotal, couponMap[couponCode]);
  const nextStep = (form: HTMLFormElement) => { if (!form.reportValidity()) return; setStep((current) => Math.min(3, current + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  async function submit(formData: FormData) {
    setLoading(true); setError("");
    const payload = { firstName: formData.get("firstName"), lastName: formData.get("lastName"), phone: formData.get("phone"), province: formData.get("province"), city: formData.get("city"), address: formData.get("address"), postalCode: formData.get("postalCode"), note: formData.get("note") || undefined, shippingMethod: formData.get("shippingMethod"), couponCode: couponCode || undefined, items };
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json() as { message?: string; redirectUrl?: string; loginRequired?: boolean };
    if (!response.ok) { if (data.loginRequired) router.push(`/login?next=${encodeURIComponent(`/checkout${couponCode ? `?coupon=${couponCode}` : ""}`)}`); else setError(data.message ?? "ثبت سفارش انجام نشد."); setLoading(false); return; }
    if (data.redirectUrl) router.push(data.redirectUrl);
  }
  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-ivory" />;
  if (!lines.length) return <div className="surface-card p-10 text-center"><h1 className="text-xl font-black">سبد شما برای تسویه‌حساب خالی است</h1><Link href="/shop" className="btn-primary mt-5">بازگشت به فروشگاه</Link></div>;
  return <form action={submit} className="grid gap-8 lg:grid-cols-[1fr_23rem]">
    <section><ol className="mb-8 grid grid-cols-4 gap-1" aria-label="مراحل پرداخت">{steps.map((label, index) => <li key={label} className="text-center"><span className={`mx-auto grid h-9 w-9 place-items-center rounded-full text-sm font-black ${index <= step ? "bg-brand text-white" : "bg-ivory text-muted"}`}>{index < step ? <Check size={16} /> : new Intl.NumberFormat("fa-IR").format(index + 1)}</span><span className={`mt-2 block text-xs font-bold ${index === step ? "text-brand" : "text-muted"}`}>{label}</span></li>)}</ol>
      <div className="surface-card p-5 md:p-7">
        <div hidden={step !== 0}><h1 className="text-xl font-black">نشانی تحویل</h1><p className="mt-2 text-sm text-muted">اطلاعات گیرنده را دقیق و با اعداد انگلیسی وارد کنید.</p><div className="mt-6 grid gap-4 sm:grid-cols-2"><div><label className="field-label" htmlFor="firstName">نام</label><input className="field" id="firstName" name="firstName" required minLength={2} /></div><div><label className="field-label" htmlFor="lastName">نام خانوادگی</label><input className="field" id="lastName" name="lastName" required minLength={2} /></div><div><label className="field-label" htmlFor="phone">شماره موبایل</label><input className="field text-left" dir="ltr" id="phone" name="phone" required pattern="09[0-9]{9}" placeholder="09123456789" /></div><div><label className="field-label" htmlFor="postalCode">کد پستی</label><input className="field text-left" dir="ltr" id="postalCode" name="postalCode" required pattern="[0-9]{10}" inputMode="numeric" /></div><div><label className="field-label" htmlFor="province">استان</label><select className="field" id="province" name="province" required defaultValue=""><option value="" disabled>انتخاب استان</option>{["تهران","البرز","اصفهان","فارس","خراسان رضوی","گیلان","مازندران","آذربایجان شرقی","خوزستان","قم"].map((item)=><option key={item}>{item}</option>)}</select></div><div><label className="field-label" htmlFor="city">شهر</label><input className="field" id="city" name="city" required /></div><div className="sm:col-span-2"><label className="field-label" htmlFor="address">نشانی کامل</label><textarea className="field min-h-28 resize-y" id="address" name="address" required minLength={10} /></div><div className="sm:col-span-2"><label className="field-label" htmlFor="note">توضیحات سفارش (اختیاری)</label><textarea className="field min-h-20 resize-y" id="note" name="note" maxLength={500} /></div></div></div>
        <div hidden={step !== 1}><h2 className="text-xl font-black">روش ارسال</h2><p className="mt-2 text-sm text-muted">بازه تحویل پس از پردازش سفارش به‌روزرسانی می‌شود.</p><label className="mt-6 flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-brand bg-brand/5 p-5"><input type="radio" name="shippingMethod" value="standard" defaultChecked className="mt-1 accent-brand" /><span><b className="block">ارسال استاندارد</b><small className="mt-1 block leading-6 text-muted">تحویل معمولاً ۲ تا ۵ روز کاری — {totals.shipping ? formatPrice(totals.shipping) : "رایگان"}</small></span></label><div className="mt-4 rounded-xl bg-ivory p-4 text-xs leading-7 text-muted">ارسال فوری به شهر و ظرفیت ناوگان وابسته است و پس از اتصال سرویس لجستیک مالک فروشگاه فعال خواهد شد.</div></div>
        <div hidden={step !== 2}><h2 className="text-xl font-black">بازبینی سفارش</h2><div className="mt-5 space-y-3">{lines.map((line) => line.product && <div key={line.product.id} className="flex items-center gap-3 rounded-xl bg-ivory p-3"><div className="relative h-16 w-16 overflow-hidden rounded-lg"><Image src={line.product.image} alt="" fill sizes="64px" className="object-cover" /></div><div className="min-w-0 flex-1"><b className="block truncate text-sm">{line.product.name}</b><small className="text-muted">تعداد {new Intl.NumberFormat("fa-IR").format(line.quantity)}</small></div><b className="price-ltr text-xs">{formatPrice((line.product.salePrice ?? line.product.price) * line.quantity)}</b></div>)}</div><p className="mt-5 rounded-xl bg-[#eef0ea] p-4 text-sm leading-7">با ثبت سفارش، قوانین خرید، حریم خصوصی و شرایط بازگشت کالا را می‌پذیرید.</p></div>
        <div hidden={step !== 3}><h2 className="text-xl font-black">پرداخت امن</h2><div className="mt-5 rounded-2xl border-2 border-brand bg-brand/5 p-5"><div className="flex items-center gap-3"><LockKeyhole className="text-brand" /><div><b className="block">درگاه نمایشی امن ماه‌ورا</b><small className="text-muted">هیچ مبلغ واقعی جابه‌جا نمی‌شود</small></div></div><p className="mt-4 text-sm leading-7 text-muted">پس از ثبت، وارد شبیه‌ساز درگاه می‌شوید و می‌توانید نتیجه موفق یا ناموفق را انتخاب کنید. Adapter آماده اتصال درگاه ایرانی واقعی است.</p></div><p className="mt-4 min-h-6 text-sm font-bold text-red-700" role="alert">{error}</p></div>
        <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5">{step > 0 ? <button type="button" className="btn-ghost" onClick={() => setStep((current) => current - 1)}><ChevronRight size={18} /> مرحله قبل</button> : <Link href="/cart" className="btn-ghost"><ChevronRight size={18} /> بازگشت به سبد</Link>}{step < 3 ? <button type="button" className="btn-primary" onClick={(event) => nextStep(event.currentTarget.form!)}>ادامه <ChevronLeft size={18} /></button> : <button className="btn-primary" disabled={loading}>{loading ? "در حال ثبت…" : "ثبت و رفتن به پرداخت"}</button>}</div>
      </div>
    </section>
    <aside className="surface-card h-fit p-5 lg:sticky lg:top-24"><h2 className="font-black">خلاصه پرداخت</h2><div className="mt-5 space-y-3 text-sm"><p className="flex justify-between"><span className="text-muted">جمع کالاها</span><b className="price-ltr">{formatPrice(totals.subtotal)}</b></p><p className="flex justify-between"><span className="text-muted">تخفیف</span><b className="price-ltr text-brand">{totals.discount ? `− ${formatPrice(totals.discount)}` : "—"}</b></p><p className="flex justify-between"><span className="text-muted">ارسال</span><b>{totals.shipping ? formatPrice(totals.shipping) : "رایگان"}</b></p></div><div className="mt-5 flex justify-between border-t border-black/10 pt-5"><b>مبلغ نهایی</b><b className="price-ltr text-lg">{formatPrice(totals.total)}</b></div><p className="mt-4 text-xs leading-6 text-muted">مبلغ نهایی به‌طور مستقل در سرور و از روی قیمت و موجودی پایگاه داده محاسبه می‌شود.</p></aside>
  </form>;
}
