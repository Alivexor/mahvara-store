"use client";
import Link from "next/link";
import { Archive, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
export function ProductRowActions({id}:{id:string}){const router=useRouter();return <div className="flex items-center"><Link href={`/admin/products/${id}/edit`} className="btn-ghost text-xs text-brand"><Pencil size={15}/> ویرایش</Link><button type="button" className="btn-ghost text-xs text-red-700" onClick={async()=>{if(!confirm("این محصول آرشیو شود؟"))return;await fetch(`/api/admin/products/${id}`,{method:"DELETE"});router.refresh()}}><Archive size={15}/> آرشیو</button></div>}
