"use client";

import { useRouter, useSearchParams } from "next/navigation";

const options = [
  ["popular", "محبوب‌ترین"],
  ["newest", "جدیدترین"],
  ["price-asc", "ارزان‌ترین"],
  ["price-desc", "گران‌ترین"],
] as const;

export function SortControl({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  function changeSort(nextSort: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (nextSort === "popular") next.delete("sort");
    else next.set("sort", nextSort);
    const query = next.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  }
  return <label className="flex items-center gap-2 text-xs font-bold">مرتب‌سازی:<select aria-label="مرتب‌سازی محصولات" value={value} onChange={(event) => changeSort(event.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-brand">{options.map(([optionValue, label]) => <option key={optionValue} value={optionValue}>{label}</option>)}</select></label>;
}
