import { AdminProductForm } from "@/components/admin/admin-product-form";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatPrice } from "@/utils/format";
export default async function AdminProducts(){
  await requireAdmin();
  const [products,categories,brands]=await Promise.all([db.product.findMany({orderBy:{createdAt:"desc"},take:50,include:{brand:true,category:true,inventory:true}}),db.category.findMany({where:{isActive:true},select:{id:true,name:true}}),db.brand.findMany({select:{id:true,name:true}})]);
  return <div><h1 className="text-2xl font-black">مدیریت محصولات</h1><p className="mt-2 text-sm text-muted">ساخت، قیمت‌گذاری، موجودی و آرشیو محصولات.</p><div className="mt-6"><AdminProductForm categories={categories} brands={brands}/></div><section className="surface-card mt-6 overflow-x-auto"><table className="w-full min-w-[720px] text-right text-sm"><thead className="bg-ivory text-xs"><tr><th className="p-4">محصول</th><th>SKU</th><th>دسته / برند</th><th>قیمت</th><th>موجودی</th><th>وضعیت</th><th></th></tr></thead><tbody className="divide-y divide-black/5">{products.map(p=><tr key={p.id}><td className="p-4 font-bold">{p.name}</td><td dir="ltr">{p.sku}</td><td>{p.category.name} / {p.brand.name}</td><td className="price-ltr">{formatPrice(p.salePrice??p.price)}</td><td className={p.inventory&&p.inventory.stock<=p.inventory.lowStockThreshold?"font-black text-red-700":""}>{new Intl.NumberFormat("fa-IR").format(p.inventory?.stock??0)}</td><td>{p.status}</td><td><ProductRowActions id={p.id}/></td></tr>)}</tbody></table></section></div>;
}
