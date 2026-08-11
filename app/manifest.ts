import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "ماه‌ورا | فروشگاه آرایشی و مراقبت پوست", short_name: "ماه‌ورا", description: "فروشگاه محصولات آرایشی و مراقبت پوست ماه‌ورا", start_url: "/", display: "standalone", background_color: "#fffdf9", theme_color: "#6e2438", lang: "fa", dir: "rtl", icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }] };
}
