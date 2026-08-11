import { AlertTriangle, Banknote, ShoppingCart, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatPrice } from "@/utils/format";
import { orderStatusLabel, orderStatusTone } from "@/utils/status";

export default async function AdminDashboard(){
  await requireAdmin();
  const [revenue,orders,customers,lowStock,recent]=await Promise.all([
    db.order.aggregate({_sum:{total:true},where:{status:{in:["PAID","PROCESSING","SHIPPED","DELIVERED"]}}}),
    db.order.count(),db.user.count({where:{role:"CUSTOMER"}}),db.inventory.count({where:{stock:{lte:5}}}),
    db.order.findMany({take:6,orderBy:{createdAt:"desc"},include:{user:true}}),
  ]);
  const cards=[{Icon:Banknote,label:"فروش تأییدشده",value:formatPrice(revenue._sum.total??0)},{Icon:ShoppingCart,label:"کل سفارش‌ها",value:new Intl.NumberFormat("fa-IR").format(orders)},{Icon:Users,label:"مشتریان",value:new Intl.NumberFormat("fa-IR").format(customers)},{Icon:AlertTriangle,label:"کم‌موجودی",value:new Intl.NumberFormat("fa-IR").format(lowStock)}];
  return <div><p className="eyebrow">نمای کلی</p><h1 className="mt-2 text-3xl font-black">داشبورد فروشگاه</h1><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({Icon,label,value})=><article key={label} className="surface-card p-5"><Icon className="text-brand"/><p className="mt-4 text-xs text-muted">{label}</p><b className="price-ltr mt-1 block text-xl">{value}</b></article>)}</div><section className="surface-card mt-7 overflow-hidden"><h2 className="border-b border-black/5 p-5 font-black">سفارش‌های اخیر</h2><div className="divide-y divide-black/5">{recent.map(order=><div key={order.id} className="grid grid-cols-3 items-center gap-3 p-4 text-sm"><div><b dir="ltr">{order.orderNumber}</b><small className="block text-muted">{order.user.firstName} {order.user.lastName}</small></div><b className="price-ltr">{formatPrice(order.total)}</b><span className={`justify-self-end rounded-full px-2 py-1 text-[11px] font-bold ${orderStatusTone[order.status]}`}>{orderStatusLabel[order.status]}</span></div>)}</div></section></div>;
}
