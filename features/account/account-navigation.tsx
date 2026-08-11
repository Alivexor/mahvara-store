"use client";

import Link from "next/link";
import { Heart, LayoutDashboard, MapPin, Package, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [["پیشخوان", "/account", LayoutDashboard], ["سفارش‌های من", "/account/orders", Package], ["آدرس‌ها", "/account/addresses", MapPin], ["علاقه‌مندی‌ها", "/account/wishlist", Heart], ["اطلاعات حساب", "/account/profile", UserRound]] as const;

export function AccountNavigation() {
  const pathname = usePathname();
  return <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible" aria-label="حساب کاربری">{links.map(([label, href, Icon]) => { const active = href === "/account" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`btn-ghost shrink-0 justify-start whitespace-nowrap lg:w-full ${active ? "bg-brand text-white hover:bg-brand-dark" : ""}`}><Icon size={18} /> {label}</Link>; })}</nav>;
}
