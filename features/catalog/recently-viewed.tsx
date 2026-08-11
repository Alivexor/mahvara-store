"use client";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
const KEY="mahvara-recent-v1";
export function RecentlyViewed({current}:{current:Product}){const [recent,setRecent]=useState<Product[]>([]);useEffect(()=>{const frame=requestAnimationFrame(()=>{let ids:string[]=[];try{ids=JSON.parse(localStorage.getItem(KEY)??"[]") as string[]}catch{}setRecent(ids.filter(id=>id!==current.id).map(id=>products.find(p=>p.id===id)).filter((p):p is Product=>Boolean(p)).slice(0,4));localStorage.setItem(KEY,JSON.stringify([current.id,...ids.filter(id=>id!==current.id)].slice(0,8)))});return()=>cancelAnimationFrame(frame)},[current.id]);if(!recent.length)return null;return <section className="mt-16"><p className="eyebrow">مرور دوباره</p><h2 className="section-title mb-8 mt-2 font-black">آخرین محصولاتی که دیده‌اید</h2><div className="product-grid">{recent.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
