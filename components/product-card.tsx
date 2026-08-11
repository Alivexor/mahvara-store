import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { discountPercent, formatPrice } from "@/utils/format";
import { AddToCart } from "@/features/cart/add-to-cart";
import { WishlistButton } from "@/features/catalog/wishlist-button";

export function ProductCard({ product }: { product: Product }) {
  const activePrice = product.salePrice ?? product.price;
  const discount = discountPercent(product.price, product.salePrice);
  return (
    <article className="group min-w-0 rounded-[1.55rem] border border-transparent p-2 transition duration-300 hover:-translate-y-1 hover:border-[#eaded4] hover:bg-white hover:shadow-[0_16px_35px_rgb(49_35_31_/_10%)] focus-within:border-[#d7bec5] focus-within:bg-white">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-ivory">
        <Link href={`/product/${product.slug}`} aria-label={`مشاهده ${product.name}`}>
          <Image src={product.image} alt={`تصویر ${product.name} از برند ${product.brand}`} fill priority={product.isFeatured || product.isNew} sizes="(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
        </Link>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {discount > 0 && <span className="rounded-full bg-brand px-2.5 py-1 text-xs font-black text-white">٪{new Intl.NumberFormat("fa-IR").format(discount)}</span>}
          {product.isNew && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-ink backdrop-blur">جدید</span>}
          {product.isFeatured && !product.isNew && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-ink backdrop-blur">منتخب</span>}
        </div>
        <div className="absolute left-3 top-3"><WishlistButton productId={product.id} /></div>
        <div className="absolute bottom-3 left-3 opacity-100 transition md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"><AddToCart product={product} compact /></div>
      </div>
      <div className="px-1 pb-2 pt-4">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs text-muted"><span className="truncate">{product.brand}</span><span className="shrink-0 inline-flex items-center gap-1"><Star size={13} fill="#b78c62" strokeWidth={0} /> {new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(product.rating)}</span></div>
        <h3 className="min-h-12 text-sm font-extrabold leading-6 md:text-[15px]"><Link href={`/product/${product.slug}`} className="transition-colors hover:text-brand">{product.name}</Link></h3>
        <div className="mt-2 flex min-h-6 flex-wrap items-baseline gap-x-2 gap-y-1"><span className="price-ltr text-sm font-black md:text-base">{formatPrice(activePrice)}</span>{product.salePrice && <del className="price-ltr text-xs text-muted">{formatPrice(product.price)}</del>}</div>
        <p className={`mt-2 text-[11px] font-bold ${product.stock > 0 ? "text-sage" : "text-red-700"}`}>{product.stock > 0 ? product.stock <= 3 ? `تنها ${new Intl.NumberFormat("fa-IR").format(product.stock)} عدد باقی مانده` : "موجود و آمادهٔ ارسال" : "ناموجود"}</p>
      </div>
    </article>
  );
}
