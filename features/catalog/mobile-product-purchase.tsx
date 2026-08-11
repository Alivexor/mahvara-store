"use client";

import { Check, CreditCard, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/format";
import { useCart } from "@/features/cart/cart-provider";

export function MobileProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const price = product.salePrice ?? product.price;

  if (product.stock < 1) return null;

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }
  function handleFastCheckout() {
    addItem(product, 1);
    router.push("/checkout");
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pt-3 shadow-[0_-12px_32px_rgba(31,24,21,0.12)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-muted">قیمت این انتخاب</p>
          <p className="price-ltr mt-0.5 truncate text-base font-black">{formatPrice(price)}</p>
        </div>
        <button type="button" onClick={handleAdd} className="btn-primary min-h-12 shrink-0 px-4" aria-live="polite">
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          {added ? "به سبد افزوده شد" : "افزودن به سبد"}
        </button>
        <button type="button" onClick={handleFastCheckout} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-brand/25 text-brand transition hover:bg-brand hover:text-white" aria-label="خرید سریع و رفتن به تسویه‌حساب"><CreditCard size={18} /></button>
      </div>
    </div>
  );
}
