import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/catalog";
import { rateLimit, requestFingerprint } from "@/lib/security";

export const revalidate = 60;

export function GET(request: NextRequest) {
  if (!rateLimit(`search:${requestFingerprint(request)}`, 40, 60_000).allowed) {
    return NextResponse.json({ message: "تعداد جست‌وجوها زیاد است؛ کمی بعد دوباره تلاش کنید." }, { status: 429 });
  }
  const query = request.nextUrl.searchParams.get("q")?.trim().toLocaleLowerCase("fa-IR") ?? "";
  if (query.length < 2) return NextResponse.json({ products: [] }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  const results = products
    .filter((product) => `${product.name} ${product.brand} ${product.category} ${product.productType}`.toLocaleLowerCase("fa-IR").includes(query))
    .slice(0, 5)
    .map(({ id, slug, name, brand, image, price, salePrice }) => ({ id, slug, name, brand, image, price, salePrice }));
  return NextResponse.json({ products: results }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
