"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { categoryNavigation, navigation } from "@/config/site";
import { useCart } from "@/features/cart/cart-provider";
import { formatPrice } from "@/utils/format";

type SearchProduct = { id: string; slug: string; name: string; brand: string; image: string; price: number; salePrice?: number };

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchProduct[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const { count } = useCart();
  const router = useRouter();
  const dialogOpen = menuOpen || searchOpen;

  useEffect(() => {
    if (!dialogOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); setSearchOpen(false); }
    };
    document.addEventListener("keydown", closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [dialogOpen]);
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchFailed(false);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("search request failed");
        const data = await response.json() as { products: SearchProduct[] };
        setSuggestions(data.products);
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") { setSuggestions([]); setSearchFailed(true); }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 220);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query]);
  useEffect(() => {
    const openWithShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && !dialogOpen && target?.tagName !== "INPUT" && target?.tagName !== "TEXTAREA") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", openWithShortcut);
    return () => document.removeEventListener("keydown", openWithShortcut);
  }, [dialogOpen]);
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  }
  return (
    <>
      <div className="bg-brand px-4 py-2 text-center text-xs font-bold text-white">ارسال رایگان برای خریدهای بالای ۲٬۵۰۰٬۰۰۰ تومان</div>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-surface/95 shadow-[0_8px_28px_rgba(37,29,31,0.04)] backdrop-blur-xl">
        <div className="container-shell flex h-[4.7rem] items-center justify-between gap-5">
          <button onClick={() => setMenuOpen(true)} className="btn-ghost md:hidden" aria-label="باز کردن منو"><Menu /></button>
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-bold xl:flex" aria-label="ناوبری اصلی">
            {navigation.map((item) => <Link key={item.href} href={item.href} className="transition hover:text-brand">{item.label}</Link>)}
          </nav>
          <button onClick={() => setSearchOpen(true)} className="hidden min-h-11 flex-1 items-center gap-2 rounded-full border border-black/10 bg-ivory/65 px-4 text-right text-sm text-muted transition hover:border-brand/30 hover:bg-white xl:flex" aria-label="جست‌وجوی محصول"><Search size={18} /><span>جست‌وجوی محصول، برند یا نیاز پوستی</span><kbd className="mr-auto rounded border border-black/10 bg-white px-1.5 py-0.5 text-[10px]">/</kbd></button>
          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="btn-ghost" aria-label="جست‌وجو"><Search size={21} /></button>
            <Link href="/account" className="btn-ghost hidden sm:inline-flex" aria-label="حساب کاربری"><UserRound size={21} /></Link>
            <Link href="/cart" className="btn-ghost relative" aria-label={`سبد خرید، ${count} کالا`}><ShoppingBag size={21} />{count > 0 && <span className="absolute left-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] text-white">{new Intl.NumberFormat("fa-IR").format(count)}</span>}</Link>
          </div>
        </div>
        <nav className="hidden border-t border-black/5 lg:block" aria-label="دسته‌بندی‌های فروشگاه"><div className="container-shell flex h-11 items-center gap-5 overflow-x-auto text-xs font-bold no-scrollbar">{categoryNavigation.map((category) => <Link key={category.href} href={category.href} className="whitespace-nowrap text-muted transition hover:text-brand">{category.label}</Link>)}<span className="h-4 w-px shrink-0 bg-black/10" /><Link href="/shop?discounted=true" className="whitespace-nowrap text-brand">پیشنهادهای ویژه</Link><Link href="/blog" className="whitespace-nowrap text-muted transition hover:text-brand">مجلهٔ زیبایی</Link></div></nav>
      </header>
      {menuOpen && <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMenuOpen(false)}><aside className="h-full w-[86%] max-w-sm bg-surface p-6 shadow-2xl" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="منوی موبایل"><div className="mb-9 flex items-center justify-between"><Logo /><button className="btn-ghost" onClick={() => setMenuOpen(false)} aria-label="بستن منو"><X /></button></div><nav className="flex flex-col">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="border-b border-black/5 py-4 font-extrabold">{item.label}</Link>)}</nav><Link href="/account" onClick={() => setMenuOpen(false)} className="btn-secondary mt-8 w-full">ورود به حساب کاربری</Link></aside></div>}
      {searchOpen && <div className="fixed inset-0 z-50 bg-ink/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="جست‌وجوی محصولات"><div className="mx-auto mt-[7vh] max-w-2xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl"><form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-black/5 p-5"><Search className="text-muted" /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 border-0 py-3 text-base outline-none" placeholder="نام محصول، برند یا نیاز پوستی را بنویسید…" aria-label="عبارت جست‌وجو" aria-controls="search-suggestions" aria-autocomplete="list" /><button className="btn-ghost" type="button" onClick={() => { setSearchOpen(false); setQuery(""); }} aria-label="بستن جست‌وجو"><X /></button></form><div id="search-suggestions" className="max-h-[65vh] overflow-y-auto p-5" aria-live="polite" aria-busy={searchLoading}>{query.length < 2 ? <div><p className="mb-3 text-xs font-bold text-muted">جست‌وجوهای محبوب</p><div className="flex flex-wrap gap-2">{["ضدآفتاب", "سرم آبرسان", "رژگونه", "ماسک مو"].map((term) => <button key={term} type="button" onClick={() => setQuery(term)} className="rounded-full bg-ivory px-3 py-2 text-sm transition hover:bg-[#eadfd6]">{term}</button>)}</div><p className="mb-3 mt-7 text-xs font-bold text-muted">شروع سریع از دسته‌بندی</p><div className="flex flex-wrap gap-2">{categoryNavigation.map((category) => <Link key={category.href} href={category.href} onClick={() => setSearchOpen(false)} className="rounded-full border border-black/10 px-3 py-2 text-sm font-bold transition hover:border-brand hover:text-brand">{category.label}</Link>)}</div></div> : searchLoading ? <div className="space-y-3" aria-label="در حال جست‌وجو">{Array.from({ length: 3 }).map((_, index) => <div key={index} className="flex items-center gap-3"><span className="h-14 w-14 animate-pulse rounded-xl bg-ivory" /><span className="flex-1 space-y-2"><i className="block h-4 w-2/3 animate-pulse rounded bg-ivory" /><i className="block h-3 w-1/3 animate-pulse rounded bg-ivory" /></span></div>)}</div> : searchFailed ? <p className="py-8 text-center text-sm text-red-700">نمایش پیشنهادها ممکن نشد؛ می‌توانید جست‌وجوی کامل را انجام دهید.</p> : suggestions.length ? <div><p className="mb-2 text-xs font-bold text-muted">محصولات پیشنهادی</p>{suggestions.map((product) => <Link key={product.id} onClick={() => setSearchOpen(false)} href={`/product/${product.slug}`} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-ivory"><span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ivory"><Image src={product.image} alt="" fill sizes="56px" className="object-cover" /></span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{product.name}</strong><span className="mt-1 block text-xs text-muted">{product.brand}</span></span><span className="price-ltr shrink-0 text-xs font-black">{formatPrice(product.salePrice ?? product.price)}</span></Link>)}<button type="submit" className="btn-secondary mt-4 w-full">مشاهدهٔ همهٔ نتایج برای «{query}»</button></div> : <div className="py-8 text-center"><p className="text-sm text-muted">محصولی با این عبارت پیدا نشد.</p><button type="submit" className="btn-secondary mt-4">جست‌وجو در همهٔ محصولات</button></div>}</div></div></div>}
    </>
  );
}
