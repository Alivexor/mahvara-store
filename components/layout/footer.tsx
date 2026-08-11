import Link from "next/link";
import { Instagram, Send, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";

const groups = [
  { title: "ماه‌ورا", links: [["درباره ما", "/about"], ["تماس با ما", "/contact"], ["مجله", "/blog"], ["سوالات متداول", "/faq"]] },
  { title: "راهنمای خرید", links: [["شرایط ارسال", "/shipping"], ["بازگشت کالا", "/returns"], ["قوانین و مقررات", "/terms"], ["حریم خصوصی", "/privacy"]] },
  { title: "حساب شما", links: [["ورود و ثبت‌نام", "/login"], ["سفارش‌های من", "/account/orders"], ["علاقه‌مندی‌ها", "/account/wishlist"], ["پیگیری سفارش", "/account/orders"]] },
] as const;

export function Footer() {
  return <footer className="mt-16 border-t border-black/5 bg-[#f0e9e0]"><div className="container-shell grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(3,1fr)]"><div><Logo /><p className="mt-5 max-w-sm text-sm leading-7 text-muted">انتخاب روشن برای زیبایی روزمره؛ محصولاتی معتبر، اطلاعات شفاف و تجربه خریدی آرام.</p><div className="mt-5 flex gap-2">{siteConfig.socials.instagram && <a href={siteConfig.socials.instagram} aria-label="اینستاگرام" className="btn-ghost"><Instagram size={19} /></a>}{siteConfig.socials.telegram && <a href={siteConfig.socials.telegram} aria-label="تلگرام" className="btn-ghost"><Send size={19} /></a>}</div></div>{groups.map((group) => <div key={group.title}><h2 className="mb-4 font-black">{group.title}</h2><ul className="space-y-3 text-sm text-muted">{group.links.map(([label, href]) => <li key={`${label}-${href}`}><Link className="hover:text-brand" href={href}>{label}</Link></li>)}</ul></div>)}</div><div className="border-t border-black/10"><div className="container-shell flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted sm:flex-row"><p>© ۱۴۰۵ ماه‌ورا — نسخه نمایشی حرفه‌ای، همه حقوق محفوظ است.</p><p className="inline-flex items-center gap-2"><ShieldCheck size={16} /> خرید امن، اطلاعات شفاف، احترام به حریم خصوصی</p></div></div></footer>;
}
