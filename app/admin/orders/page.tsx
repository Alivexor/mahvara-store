import { OrderStatusForm } from "@/components/admin/order-status-form";
import { requireAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { formatPrice } from "@/utils/format";
export default async function AdminOrders(){
  await requireAdmin();
  const orders=await db.order.findMany({take:100,orderBy:{createdAt:"desc"},include:{user:true,_count:{select:{items:true}}}});
  return <div><h1 className="text-2xl font-black">مدیریت سفارش‌ها</h1><div className="surface-card mt-6 overflow-x-auto"><table className="w-full min-w-[800px] text-right text-sm"><thead className="bg-ivory text-xs"><tr><th className="p-4">شماره</th><th>مشتری</th><th>تاریخ</th><th>اقلام</th><th>مبلغ</th><th>وضعیت</th></tr></thead><tbody className="divide-y divide-black/5">{orders.map(order=><tr key={order.id}><td className="p-4 font-black" dir="ltr">{order.orderNumber}</td><td>{order.user.firstName} {order.user.lastName}</td><td>{new Intl.DateTimeFormat("fa-IR").format(order.createdAt)}</td><td>{new Intl.NumberFormat("fa-IR").format(order._count.items)}</td><td className="price-ltr">{formatPrice(order.total)}</td><td><OrderStatusForm id={order.id} status={order.status}/></td></tr>)}</tbody></table></div></div>;
}
