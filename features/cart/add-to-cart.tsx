"use client";

import { ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { useCart } from "./cart-provider";
import { useState } from "react";

export function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      disabled={product.stock <= 0}
      onClick={() => { addItem(product); setAdded(true); setTimeout(() => setAdded(false), 1600); }}
      className={compact ? "grid h-10 w-10 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:opacity-40" : "btn-primary w-full disabled:opacity-40"}
      aria-label={`افزودن ${product.name} به سبد خرید`}
    >
      <ShoppingBag size={compact ? 18 : 19} /> {!compact && (added ? "به سبد اضافه شد" : product.stock > 0 ? "افزودن به سبد" : "ناموجود")}
    </button>
  );
}
