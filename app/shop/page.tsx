import type { Metadata } from "next";
import Link from "next/link";
import { Filter, SearchX, SlidersHorizontal } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { SortControl } from "@/features/catalog/sort-control";
import { categories, products } from "@/lib/catalog";

export const metadata: Metadata = { title: "فروشگاه محصولات آرایشی و مراقبت پوست", description: "خرید محصولات اصل مراقبت پوست، آرایش، مو و عطر با فیلترهای دقیق و اطلاعات شفاف.", alternates: { canonical: "/shop" } };

type Params = Record<string, string | string[] | undefined>;
const val = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
const shopUrlWithout = (query: Params, key: string) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([entryKey, entryValue]) => {
    const value = val(entryValue);
    if (entryKey !== key && value) params.set(entryKey, value);
  });
  const result = params.toString();
  return result ? `/shop?${result}` : "/shop";
};
const numberParam = (value: string | undefined, fallback: number) => {
  if (!value?.trim()) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  const query = await searchParams;
  const category = val(query.category);
  const brand = val(query.brand);
  const search = val(query.q)?.trim();
  const skinType = val(query.skinType);
  const productType = val(query.productType);
  const sort = val(query.sort) ?? "popular";
  const inStock = val(query.inStock) === "true";
  const discounted = val(query.discounted) === "true";
  const minRating = numberParam(val(query.rating), 0);
  const minPrice = numberParam(val(query.minPrice), 0);
  const maxPrice = numberParam(val(query.maxPrice), Number.MAX_SAFE_INTEGER);

  let filtered = products.filter((product) =>
    (!category || product.categorySlug === category) &&
    (!brand || product.brand === brand) &&
    (!search || `${product.name} ${product.brand} ${product.productType}`.includes(search)) &&
    (!skinType || product.skinTypes.includes(skinType)) &&
    (!productType || product.productType === productType) &&
    (!inStock || product.stock > 0) &&
    (!discounted || Boolean(product.salePrice)) &&
    product.rating >= minRating &&
    (product.salePrice ?? product.price) >= minPrice &&
    (product.salePrice ?? product.price) <= maxPrice
  );
  filtered = [...filtered].sort((a, b) => sort === "price-asc" ? (a.salePrice ?? a.price) - (b.salePrice ?? b.price) : sort === "price-desc" ? (b.salePrice ?? b.price) - (a.salePrice ?? a.price) : sort === "newest" ? Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) : b.rating - a.rating);
  const productTypes = Array.from(new Set(products.map((product) => product.productType)));
  const activeFilters = [
    category && { key: "category", label: `دسته: ${categories.find((item) => item.slug === category)?.name ?? category}` },
    brand && { key: "brand", label: `برند: ${brand}` },
    productType && { key: "productType", label: `نوع: ${productType}` },
    skinType && { key: "skinType", label: `پوست: ${skinType}` },
    search && { key: "q", label: `جست‌وجو: ${search}` },
    minPrice > 0 && { key: "minPrice", label: "حداقل قیمت" },
    maxPrice < Number.MAX_SAFE_INTEGER && { key: "maxPrice", label: "حداکثر قیمت" },
    minRating > 0 && { key: "rating", label: `${new Intl.NumberFormat("fa-IR").format(minRating)} ستاره و بیشتر` },
    inStock && { key: "inStock", label: "فقط موجود" },
    discounted && { key: "discounted", label: "تخفیف‌دار" },
  ].filter(Boolean) as { key: string; label: string }[];

  const filters = <form action="/shop" method="get" className="space-y-5">
    <div><label htmlFor="q" className="field-label">جست‌وجو در محصولات</label><input id="q" name="q" defaultValue={search} className="field" placeholder="مثلاً سرم آبرسان" /></div>
    <div><label htmlFor="category" className="field-label">دسته‌بندی</label><select id="category" name="category" defaultValue={category ?? ""} className="field"><option value="">همه دسته‌ها</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></div>
    <div><label htmlFor="brand" className="field-label">برند</label><select id="brand" name="brand" defaultValue={brand ?? ""} className="field"><option value="">همه برندها</option>{Array.from(new Set(products.map((p) => p.brand))).sort().map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
    <div><label htmlFor="productType" className="field-label">نوع محصول</label><select id="productType" name="productType" defaultValue={productType ?? ""} className="field"><option value="">همه انواع</option>{productTypes.map((item) => <option value={item} key={item}>{item}</option>)}</select></div>
    <div><label htmlFor="skinType" className="field-label">نوع پوست</label><select id="skinType" name="skinType" defaultValue={skinType ?? ""} className="field"><option value="">همه انواع پوست</option>{["نرمال", "خشک", "مختلط", "حساس"].map((item) => <option key={item}>{item}</option>)}</select></div>
    <fieldset><legend className="field-label">بازه قیمت (تومان)</legend><div className="grid grid-cols-2 gap-2"><input name="minPrice" type="number" defaultValue={minPrice || ""} className="field" placeholder="از" min="0" /><input name="maxPrice" type="number" defaultValue={Number.isFinite(maxPrice) && maxPrice < Number.MAX_SAFE_INTEGER ? maxPrice : ""} className="field" placeholder="تا" min="0" /></div></fieldset>
    <div><label htmlFor="rating" className="field-label">حداقل امتیاز</label><select id="rating" name="rating" defaultValue={String(minRating)} className="field"><option value="0">همه امتیازها</option><option value="4">۴ ستاره و بیشتر</option><option value="4.5">۴٫۵ ستاره و بیشتر</option></select></div>
    <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" name="inStock" value="true" defaultChecked={inStock} className="h-4 w-4 accent-brand" /> فقط کالاهای موجود</label>
    <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" name="discounted" value="true" defaultChecked={discounted} className="h-4 w-4 accent-brand" /> فقط محصولات تخفیف‌دار</label>
    <button className="btn-primary w-full"><Filter size={17} /> اعمال فیلترها</button><Link href="/shop" className="block text-center text-xs font-bold text-muted hover:text-brand">پاک کردن همه فیلترها</Link>
  </form>;

  return <><Breadcrumbs items={[{ label: "فروشگاه" }]} /><div className="container-shell pb-20"><div className="mb-8"><p className="eyebrow mb-2">فروشگاه ماه‌ورا</p><h1 className="section-title font-black">انتخاب‌های دقیق برای روتین شما</h1><p className="mt-3 max-w-2xl leading-8 text-muted">میان محصولات مراقبت پوست، آرایش، مو و عطر جست‌وجو کنید و با فیلترهای کاربردی به انتخاب مناسب برسید.</p></div><div className="grid gap-8 lg:grid-cols-[18rem_1fr]"><aside className="surface-card sticky top-24 hidden h-fit p-5 lg:block"><h2 className="mb-5 flex items-center gap-2 font-black"><SlidersHorizontal size={19} /> فیلترها</h2>{filters}</aside><div><details className="surface-card mb-5 p-4 lg:hidden"><summary className="flex cursor-pointer list-none items-center justify-between font-black"><span className="inline-flex items-center gap-2"><SlidersHorizontal size={19} /> فیلتر و جست‌وجو</span></summary><div className="mt-5 border-t border-black/5 pt-5">{filters}</div></details>{activeFilters.length > 0 && <div className="mb-5 rounded-2xl border border-brand/15 bg-brand/5 p-3"><div className="flex flex-wrap items-center gap-2"><span className="ml-1 text-xs font-black text-brand">فیلترهای فعال:</span>{activeFilters.map((filter) => <Link key={filter.key} href={shopUrlWithout(query, filter.key)} className="inline-flex items-center gap-1 rounded-full border border-brand/20 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-brand hover:text-brand" aria-label={`حذف فیلتر ${filter.label}`}>{filter.label}<span aria-hidden="true">×</span></Link>)}<Link href="/shop" className="mr-auto px-2 py-1 text-xs font-bold text-muted underline underline-offset-4 hover:text-brand">پاک کردن همه</Link></div></div>}<div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted"><b className="text-ink">{new Intl.NumberFormat("fa-IR").format(filtered.length)}</b> محصول</p><SortControl value={sort} /></div>{filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="surface-card grid min-h-96 place-items-center p-8 text-center"><div><SearchX className="mx-auto text-brand" size={42} /><h2 className="mt-4 text-xl font-black">محصولی با این فیلترها پیدا نشد</h2><p className="mt-2 text-sm leading-7 text-muted">بازه قیمت یا یکی از فیلترها را تغییر دهید.</p><Link href="/shop" className="btn-primary mt-5">مشاهده همه محصولات</Link></div></div>}</div></div></div></>;
}
