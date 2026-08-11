import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export type Crumb = { label: string; href?: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return <nav aria-label="مسیر صفحه" className="container-shell py-5"><ol className="flex flex-wrap items-center gap-1 text-xs text-muted"><li><Link href="/" className="hover:text-brand">خانه</Link></li>{items.map((item) => <li key={item.label} className="inline-flex items-center gap-1"><ChevronLeft size={13} />{item.href ? <Link href={item.href} className="hover:text-brand">{item.label}</Link> : <span aria-current="page" className="text-ink">{item.label}</span>}</li>)}</ol></nav>;
}
