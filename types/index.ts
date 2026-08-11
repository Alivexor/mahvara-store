export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  sku: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  skinTypes: string[];
  productType: string;
  features: string[];
  ingredients: string;
  usage: string;
  warnings: string;
  isNew?: boolean;
  isFeatured?: boolean;
};

export type CartLine = { productId: string; quantity: number };

export type CouponInput = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minimumOrder: number;
  maximumDiscount?: number;
  expiresAt?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
};

export type OrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};
