import { ProductCardSkeleton } from "@/components/ui/product-card-skeleton";

export default function ShopLoading() { return <div className="container-shell py-14" aria-label="در حال بارگذاری محصولات"><div className="mb-8 h-12 w-64 animate-pulse rounded-xl bg-ivory" /><div className="product-grid">{Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}</div></div>; }
