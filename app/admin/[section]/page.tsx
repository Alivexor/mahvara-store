import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
const labels:Record<string,string>={categories:"دسته‌بندی‌ها",brands:"برندها",coupons:"کوپن‌ها",users:"کاربران",reviews:"دیدگاه‌ها",blog:"نوشته‌های مجله",banners:"بنرهای صفحه اصلی"};
type Row={id:string;title:string;detail:string;status:string};
export default async function AdminSection({params}:{params:Promise<{section:string}>}){
  await requireAdmin();const {section}=await params;if(!labels[section])notFound();let rows:Row[]=[];
  if(section==="categories")rows=(await db.category.findMany()).map(x=>({id:x.id,title:x.name,detail:x.slug,status:x.isActive?"فعال":"غیرفعال"}));
  if(section==="brands")rows=(await db.brand.findMany()).map(x=>({id:x.id,title:x.name,detail:x.slug,status:x.isFeatured?"منتخب":"عادی"}));
  if(section==="coupons")rows=(await db.coupon.findMany()).map(x=>({id:x.id,title:x.code,detail:`${x.type} · ${x.value}`,status:x.isActive?"فعال":"غیرفعال"}));
  if(section==="users")rows=(await db.user.findMany({take:100})).map(x=>({id:x.id,title:`${x.firstName} ${x.lastName}`,detail:x.email,status:x.role}));
  if(section==="reviews")rows=(await db.review.findMany({take:100,include:{product:true,user:true}})).map(x=>({id:x.id,title:x.product.name,detail:`${x.user.firstName} · ${x.rating}/5`,status:x.status}));
  if(section==="blog")rows=(await db.blogPost.findMany()).map(x=>({id:x.id,title:x.title,detail:x.slug,status:x.isPublished?"منتشرشده":"پیش‌نویس"}));
  if(section==="banners")rows=(await db.banner.findMany()).map(x=>({id:x.id,title:x.title,detail:x.position,status:x.isActive?"فعال":"غیرفعال"}));
  return <div><h1 className="text-2xl font-black">مدیریت {labels[section]}</h1><p className="mt-2 text-sm text-muted">نمای ساخت‌یافته داده‌ها؛ عملیات حساس از API محافظت‌شده و Audit Log عبور می‌کند.</p><div className="surface-card mt-6 divide-y divide-black/5">{rows.length?rows.map(row=><article key={row.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"><b>{row.title}</b><span className="text-sm text-muted">{row.detail}</span><span className="w-fit rounded-full bg-ivory px-3 py-1 text-xs font-bold">{row.status}</span></article>):<p className="p-8 text-center text-sm text-muted">داده‌ای برای نمایش وجود ندارد.</p>}</div></div>;
}
