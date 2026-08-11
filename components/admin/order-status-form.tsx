"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const statuses=[["PENDING","در انتظار پرداخت"],["PAID","پرداخت‌شده"],["PROCESSING","در حال پردازش"],["SHIPPED","ارسال‌شده"],["DELIVERED","تحویل‌شده"],["CANCELLED","لغوشده"],["REFUNDED","مرجوع‌شده"]];
export function OrderStatusForm({id,status}:{id:string;status:string}){const [value,setValue]=useState(status);const router=useRouter();return <div className="flex gap-2"><select className="rounded-lg border border-black/10 px-2 py-1.5 text-xs" value={value} onChange={e=>setValue(e.target.value)}>{statuses.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select><button type="button" className="rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white" onClick={async()=>{await fetch(`/api/admin/orders/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:value})});router.refresh()}}>ثبت</button></div>}
