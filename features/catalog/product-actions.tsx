"use client";

import { CheckCircle2, Minus, PackageCheck, Plus, Share2, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { useCart } from "@/features/cart/cart-provider";
import { WishlistButton } from "./wishlist-button";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/commerce";
import { formatPrice } from "@/utils/format";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { addItem } = useCart();
  const router = useRouter();
  const currentPrice = product.salePrice ?? product.price;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - currentPrice * quantity);
  const add = () => { addItem(product, quantity); setMessage("محصول به سبد خرید اضافه شد."); };
  const share = async () => { const data = { title: product.name, url: window.location.href }; if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(window.location.href); setMessage("لینک محصول کپی شد."); } };
  return <div className="mt-7"><div className="flex flex-wrap items-stretch gap-3"><div className="flex items-center rounded-full border border-black/15 p-1"><button type="button" className="btn-ghost h-10 w-10 p-0" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="کاهش تعداد"><Minus size={17} /></button><span className="w-8 text-center font-black">{new Intl.NumberFormat("fa-IR").format(quantity)}</span><button type="button" className="btn-ghost h-10 w-10 p-0" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} aria-label="افزایش تعداد"><Plus size={17} /></button></div><button type="button" disabled={!product.stock} onClick={add} className="btn-primary min-w-[13rem] flex-1"><ShoppingBag size={19} /> افزودن به سبد خرید</button><button type="button" disabled={!product.stock} onClick={() => { add(); router.push("/checkout"); }} className="btn-secondary min-w-[9rem] flex-1">خرید سریع</button></div><div className="mt-3 rounded-2xl border border-[#dce5d8] bg-[#f2f5ef] px-4 py-3 text-xs leading-6 text-[#52604b]" role="status">{remainingForFreeShipping > 0 ? <span className="inline-flex items-center gap-2"><Truck size={17} /> با افزودن <b className="price-ltr">{formatPrice(remainingForFreeShipping)}</b> دیگر، ارسال سفارش رایگان می‌شود.</span> : <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} /> این انتخاب، شما را به ارسال رایگان می‌رساند.</span>}</div><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-muted"><span className="inline-flex items-center gap-1.5"><PackageCheck size={16} className="text-sage" /> آماده‌سازی و ارسال در ۱ تا ۲ روز کاری</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={16} className="text-sage" /> بازگشت مطابق شرایط کالاهای بهداشتی</span></div><div className="mt-3 flex gap-2"><WishlistButton productId={product.id} label/><button type="button" className="btn-ghost text-sm" onClick={share}><Share2 size={18} /> اشتراک‌گذاری</button></div><p className="min-h-6 pt-2 text-xs font-bold text-brand" aria-live="polite">{message}</p></div>;
}
