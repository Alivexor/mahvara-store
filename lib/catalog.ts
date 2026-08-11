import type { Product } from "@/types";

const descriptions = {
  skincare: "فرمولی سبک برای تکمیل روتین روزانه پوست؛ بافت خوش‌جذب، بدون حس سنگینی و مناسب استفاده منظم.",
  makeup: "بافت حرفه‌ای با جلوه‌ای طبیعی و ماندگار که به‌راحتی لایه‌گذاری می‌شود و نتیجه‌ای یکدست می‌سازد.",
  haircare: "مراقبت متعادل برای مو و پوست سر با بافتی خوش‌آبکشی و رایحه‌ای ملایم برای مصرف روزانه.",
  fragrance: "ترکیبی ظریف و چندلایه با شروع شفاف، قلب گرم و ردبویی آرام که برای استفاده روزمره طراحی شده است.",
};

const raw = [
  ["سرم آبرسان هیالورونیک ۲٪", "hydra-serum", "لاروش پوزای", "la-roche-posay", "skincare", "مراقبت پوست", "سرم", 1280000, 1090000, 4.8, 126, 18],
  ["ضدآفتاب فلوئید بی‌رنگ SPF50", "invisible-sunscreen", "بیوتی آو جوسان", "beauty-of-joseon", "skincare", "مراقبت پوست", "ضدآفتاب", 1490000, 1320000, 4.9, 204, 22],
  ["کرم ترمیم‌کننده سد دفاعی", "barrier-cream", "سراوی", "cerave", "skincare", "مراقبت پوست", "مرطوب‌کننده", 1890000, undefined, 4.7, 89, 9],
  ["تونر تسکین‌دهنده سنتلا", "centella-toner", "اسکین ۱۰۰۴", "skin1004", "skincare", "مراقبت پوست", "تونر", 1180000, 990000, 4.6, 72, 14],
  ["ژل شست‌وشوی پوست حساس", "gentle-cleanser", "اون", "avene", "skincare", "مراقبت پوست", "شوینده", 960000, undefined, 4.7, 64, 27],
  ["کرم دور چشم کافئین", "caffeine-eye-cream", "اوردینری", "the-ordinary", "skincare", "مراقبت پوست", "دور چشم", 920000, 790000, 4.4, 55, 7],
  ["سرم نیاسینامید متعادل‌کننده", "niacinamide-serum", "اوردینری", "the-ordinary", "skincare", "مراقبت پوست", "سرم", 870000, undefined, 4.5, 144, 33],
  ["ماسک خواب آبرسان", "sleeping-mask", "لانیژ", "laneige", "skincare", "مراقبت پوست", "ماسک", 2140000, 1890000, 4.8, 91, 12],
  ["رژ لب ساتن رز وود", "satin-lipstick", "نارس", "nars", "makeup", "آرایش", "رژ لب", 1760000, 1480000, 4.7, 83, 16],
  ["رژگونه ابری هلویی", "cloud-blush", "رر بیوتی", "rare-beauty", "makeup", "آرایش", "رژگونه", 1980000, undefined, 4.9, 231, 19],
  ["ریمل حجم‌دهنده مشکی", "volume-mascara", "اسنس", "essence", "makeup", "آرایش", "ریمل", 690000, 590000, 4.6, 178, 41],
  ["کانسیلر سبک روزانه", "daily-concealer", "میبلین", "maybelline", "makeup", "آرایش", "کانسیلر", 840000, undefined, 4.5, 112, 25],
  ["پالت سایه خاکی چهارتایی", "earth-eyeshadow", "شارلوت تیلبری", "charlotte-tilbury", "makeup", "آرایش", "سایه چشم", 3650000, 3190000, 4.8, 67, 6],
  ["تینت لب مخملی", "velvet-lip-tint", "رومند", "romand", "makeup", "آرایش", "تینت لب", 980000, undefined, 4.7, 196, 29],
  ["شامپو ترمیم‌کننده پیوند مو", "bond-shampoo", "اولاپلکس", "olaplex", "haircare", "مراقبت مو", "شامپو", 2450000, 2180000, 4.8, 103, 13],
  ["ماسک موی تغذیه‌کننده", "nourish-hair-mask", "بریوژئو", "briogeo", "haircare", "مراقبت مو", "ماسک مو", 2890000, undefined, 4.6, 47, 8],
  ["سرم ضد وز سبک", "anti-frizz-serum", "اوای", "ouai", "haircare", "مراقبت مو", "سرم مو", 2240000, 1990000, 4.7, 61, 17],
  ["اسکراب ملایم پوست سر", "scalp-scrub", "کریستف رابین", "christophe-robin", "haircare", "مراقبت مو", "اسکراب مو", 3180000, undefined, 4.5, 38, 5],
  ["اسپری محافظ حرارت", "heat-protection", "کالر واو", "color-wow", "haircare", "مراقبت مو", "محافظ حرارت", 2370000, 2050000, 4.6, 74, 11],
  ["عطر ادوپرفیوم آفتاب خاموش", "silent-sun-edp", "ماه‌ورا ادیت", "mahvara-edit", "fragrance", "عطر", "ادوپرفیوم", 3980000, 3490000, 4.9, 43, 10],
  ["عطر گل سفید و چوب سدر", "white-flower-cedar", "میسون مارژیلا", "maison-margiela", "fragrance", "عطر", "ادوپرفیوم", 5290000, undefined, 4.7, 58, 7],
  ["عطر جیبی چای و انجیر", "tea-fig-travel", "ماه‌ورا ادیت", "mahvara-edit", "fragrance", "عطر", "عطر جیبی", 1250000, 1080000, 4.6, 35, 24],
  ["بادی میست مشک و زنبق", "musk-iris-mist", "سول د ژانیرو", "sol-de-janeiro", "fragrance", "عطر", "بادی میست", 1880000, undefined, 4.5, 81, 15],
  ["ست روتین درخشش روزانه", "daily-glow-set", "ماه‌ورا ادیت", "mahvara-edit", "skincare", "مراقبت پوست", "ست مراقبتی", 3270000, 2790000, 4.9, 52, 9]
] as const;

const categoryImages: Record<string, string> = {
  skincare: "/images/category-skincare.png",
  makeup: "/images/category-makeup.png",
  haircare: "/images/category-hair.png",
  fragrance: "/images/category-fragrance.png",
};

const productImages: Record<keyof typeof descriptions, readonly [string, string]> = {
  skincare: ["/images/product-skincare-serum.webp", categoryImages.skincare],
  makeup: ["/images/product-makeup-rose.webp", categoryImages.makeup],
  haircare: ["/images/product-haircare-amber.webp", categoryImages.haircare],
  fragrance: ["/images/product-fragrance-amber.webp", categoryImages.fragrance],
};

export const products: Product[] = raw.map((item, index) => {
  const [name, slug, brand, brandSlug, categorySlug, category, productType, price, salePrice, rating, reviewCount, stock] = item;
  const base = descriptions[categorySlug];
  const image = productImages[categorySlug][index % 2];
  const gallery = Array.from(new Set([image, categoryImages[categorySlug], "/images/mahvara-hero.png"]));
  return {
    id: `prd_${String(index + 1).padStart(3, "0")}`,
    name, slug, brand, brandSlug, category, categorySlug, productType, price, salePrice, rating, reviewCount, stock,
    sku: `MH-${categorySlug.slice(0, 2).toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    image, gallery,
    shortDescription: base,
    description: `${base} این محصول با انتخاب دقیق ماه‌ورا و با تمرکز بر اصالت، تجربه مصرف و شفافیت اطلاعات عرضه می‌شود.`,
    skinTypes: categorySlug === "skincare" ? ["نرمال", index % 2 ? "خشک" : "مختلط", "حساس"] : ["همه انواع"],
    features: ["بافت سبک و خوش‌استفاده", "مناسب روتین روزانه", "بسته‌بندی استاندارد و پلمب"],
    ingredients: categorySlug === "skincare" ? "ترکیبات کلیدی مطابق برچسب محصول؛ پیش از مصرف فهرست کامل روی بسته‌بندی بررسی شود." : "جزئیات ترکیبات و مواد سازنده روی بسته‌بندی اصلی درج شده است.",
    usage: "مقدار مناسب را طبق راهنمای روی بسته‌بندی استفاده کنید. برای نتیجه بهتر، مصرف را با روتین سازگار و منظم ادامه دهید.",
    warnings: "فقط برای مصرف خارجی. دور از نور مستقیم و دسترس کودکان نگهداری شود. در صورت حساسیت، مصرف را متوقف کنید.",
    isNew: index % 5 === 0,
    isFeatured: rating >= 4.8,
  };
});

export const categories = [
  { name: "مراقبت پوست", slug: "skincare", image: categoryImages.skincare, caption: "از پاکسازی تا محافظت روزانه" },
  { name: "آرایش", slug: "makeup", image: categoryImages.makeup, caption: "رنگ‌هایی برای زیبایی طبیعی" },
  { name: "مراقبت مو", slug: "haircare", image: categoryImages.haircare, caption: "روتین موهای سالم و درخشان" },
  { name: "عطر", slug: "fragrance", image: categoryImages.fragrance, caption: "رایحه‌ای که امضای شماست" },
] as const;

export const brands = ["لاروش پوزای", "اوردینری", "نارس", "رر بیوتی", "اولاپلکس", "بیوتی آو جوسان"];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
export const relatedProducts = (product: Product) => products.filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id).slice(0, 4);

export const blogPosts = [
  { slug: "simple-skin-routine", title: "روتین ساده مراقبت پوست؛ کمتر، اما دقیق‌تر", excerpt: "چطور با سه قدم اصلی پاکسازی، رطوبت‌رسانی و ضدآفتاب یک روتین پایدار بسازیم؟", category: "راهنمای مراقبت", date: "۱۴۰۵/۰۴/۱۸", readTime: "۶ دقیقه", image: "/images/category-skincare.png" },
  { slug: "choose-sunscreen", title: "راهنمای انتخاب ضدآفتاب برای استفاده روزانه", excerpt: "بافت، میزان محافظت و سازگاری با پوست؛ معیارهایی که انتخاب را ساده‌تر می‌کنند.", category: "دانش پوست", date: "۱۴۰۵/۰۴/۰۸", readTime: "۵ دقیقه", image: "/images/mahvara-hero.png" },
  { slug: "makeup-skin-prep", title: "آماده‌سازی پوست برای آرایشی طبیعی و یکدست", excerpt: "چند نکته کم‌ریسک برای اینکه آرایش بهتر روی پوست بنشیند و ظاهر سنگین پیدا نکند.", category: "آرایش", date: "۱۴۰۵/۰۳/۲۶", readTime: "۴ دقیقه", image: "/images/category-makeup.png" },
] as const;
