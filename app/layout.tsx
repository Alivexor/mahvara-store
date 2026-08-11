import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/features/cart/cart-provider";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "ماه‌ورا | فروشگاه آرایشی و مراقبت پوست", template: "%s | ماه‌ورا" },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "Beauty & Skincare",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fa_IR", siteName: siteConfig.name, title: "ماه‌ورا؛ زیبایی، روشن و انتخاب‌شده", description: siteConfig.description, images: [{ url: "/images/mahvara-hero.png", width: 1536, height: 1024, alt: "مجموعه مراقبت پوست ماه‌ورا" }] },
  twitter: { card: "summary_large_image", title: "ماه‌ورا", description: siteConfig.description, images: ["/images/mahvara-hero.png"] },
};

export const viewport: Viewport = { themeColor: "#fffdf9", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = { "@context": "https://schema.org", "@type": "Organization", name: siteConfig.name, url: siteConfig.url, logo: `${siteConfig.url}/brand/mahvara-mark.svg`, potentialAction: { "@type": "SearchAction", target: `${siteConfig.url}/shop?q={search_term_string}`, "query-input": "required name=search_term_string" } };
  return <html lang="fa" dir="rtl"><body><a href="#main" className="skip-link">رفتن به محتوای اصلی</a><CartProvider><Header /><main id="main">{children}</main><Footer /></CartProvider><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} /></body></html>;
}
