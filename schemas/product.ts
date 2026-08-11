import { z } from "zod";
export const productCreateSchema = z.object({
  name: z.string().trim().min(3).max(160), slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(160), sku: z.string().trim().min(3).max(50),
  shortDescription: z.string().trim().min(10).max(300), description: z.string().trim().min(20).max(10_000), ingredients: z.string().max(5000).optional(), usage: z.string().max(3000).optional(), warnings: z.string().max(3000).optional(),
  productType: z.string().trim().min(2).max(80), price: z.number().int().positive(), salePrice: z.number().int().positive().nullable().optional(), stock: z.number().int().min(0), lowStockThreshold: z.number().int().min(0).default(5), categoryId: z.string().min(1), brandId: z.string().min(1), imageUrl: z.string().startsWith("/images/").default("/images/category-skincare.png"), skinTypes: z.array(z.string()).default(["همه انواع"]), seoTitle: z.string().max(70).optional(), seoDescription: z.string().max(170).optional(),
}).refine((data) => !data.salePrice || data.salePrice < data.price, { message: "قیمت فروش باید کمتر از قیمت اصلی باشد.", path: ["salePrice"] });
