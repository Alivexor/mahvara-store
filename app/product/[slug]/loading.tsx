import { ProductCardSkeleton } from "@/components/ui/product-card-skeleton";

export default function ProductLoading() {
  return <div className="container-shell py-8" aria-label="در حال بارگذاری محصول"><div className="grid gap-10 lg:grid-cols-2"><div className="aspect-square animate-pulse rounded-[1.6rem] bg-ivory" /><div className="pt-4"><div className="h-4 w-24 animate-pulse rounded bg-ivory" /><div className="mt-4 h-11 w-4/5 animate-pulse rounded-xl bg-ivory" /><div className="mt-5 h-5 w-2/5 animate-pulse rounded bg-ivory" /><div className="mt-7 h-20 animate-pulse rounded-2xl bg-ivory" /><div className="mt-4 h-12 animate-pulse rounded-full bg-ivory" /></div></div><div className="mt-16"><div className="mb-6 h-8 w-64 animate-pulse rounded-lg bg-ivory" /><div className="product-grid">{Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)}</div></div></div>;
}
