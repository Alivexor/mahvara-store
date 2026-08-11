export const siteConfig = {
  name: "ماه‌ورا",
  latinName: "MAHVARA",
  description: "انتخاب حرفه‌ای محصولات اصل آرایشی و مراقبت پوست، با راهنمای روشن و خرید مطمئن.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportPhone: "—",
  supportEmail: "support@example.com",
  freeShippingThreshold: 2_500_000,
  standardShipping: 95_000,
  socials: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "",
  },
} as const;

export const navigation = [
  { label: "فروشگاه", href: "/shop" },
  { label: "مراقبت پوست", href: "/shop?category=skincare" },
  { label: "آرایش", href: "/shop?category=makeup" },
  { label: "مراقبت مو", href: "/shop?category=haircare" },
  { label: "عطر", href: "/shop?category=fragrance" },
  { label: "مجله ماه‌ورا", href: "/blog" },
] as const;

export const categoryNavigation = [
  { label: "مراقبت پوست", href: "/shop?category=skincare" },
  { label: "آرایش", href: "/shop?category=makeup" },
  { label: "مراقبت مو", href: "/shop?category=haircare" },
  { label: "عطر", href: "/shop?category=fragrance" },
] as const;
