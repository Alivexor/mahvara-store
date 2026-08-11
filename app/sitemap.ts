import type { MetadataRoute } from "next";
import { products, blogPosts } from "@/lib/catalog";
import { siteConfig } from "@/config/site";
export default function sitemap():MetadataRoute.Sitemap{const now=new Date();const staticRoutes=["","/shop","/blog","/about","/contact","/faq","/shipping","/returns","/terms","/privacy"].map(path=>({url:`${siteConfig.url}${path}`,lastModified:now,changeFrequency:path===""?"daily" as const:"weekly" as const,priority:path===""?1:.7}));return[...staticRoutes,...products.map(p=>({url:`${siteConfig.url}/product/${p.slug}`,lastModified:now,changeFrequency:"weekly" as const,priority:.8})),...blogPosts.map(p=>({url:`${siteConfig.url}/blog/${p.slug}`,lastModified:now,changeFrequency:"monthly" as const,priority:.6}))]}
