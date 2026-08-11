import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Headphones, PackageCheck, RefreshCcw, ShieldCheck, Sparkles, Star } from "lucide-react";
import { categories, blogPosts, brands, products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { NewsletterForm } from "@/components/newsletter-form";

const needs = [
  { title: "کم‌آبی و کشیدگی", caption: "آبرسان‌ها و تقویت‌کننده‌های سد پوست", query: "خشک", color: "bg-[#dce2d6]" },
  { title: "کدری و ناهمواری", caption: "انتخاب‌هایی برای روتین شفافیت", query: "نرمال", color: "bg-[#ead9cf]" },
  { title: "چربی و منافذ", caption: "بافت‌های سبک و متعادل‌کننده", query: "مختلط", color: "bg-[#e3ded4]" },
] as const;

export default function HomePage() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const latest = products.filter((p) => p.isNew).slice(0, 4);
  return <>
    <section className="container-shell pt-5 md:pt-8">
      <div className="relative min-h-[38rem] overflow-hidden rounded-[1.8rem] bg-ivory md:min-h-[41rem]">
        <Image src="/images/mahvara-hero.png" alt="چیدمان مینیمال محصولات مراقبت پوست ماه‌ورا" fill priority sizes="(max-width: 1320px) 100vw, 1320px" className="object-cover object-left" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#f5eadc]/95 via-[#f5eadc]/65 to-transparent md:via-[#f5eadc]/28" />
        <div className="relative z-10 flex min-h-[38rem] max-w-xl flex-col justify-center px-6 py-16 md:min-h-[41rem] md:px-14 lg:px-20">
          <p className="eyebrow mb-4 inline-flex items-center gap-2"><Sparkles size={16} /> انتخاب تازه ماه‌ورا</p>
          <h1 className="display-title text-balance font-black">زیبایی، وقتی روشن انتخاب می‌شود.</h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#564a47] md:text-lg">محصولات اصل مراقبت پوست و آرایش، با اطلاعات شفاف و انتخابی دقیق برای روتینی که واقعاً با شما هماهنگ است.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" href="/shop">مشاهده فروشگاه <ArrowLeft size={18} /></Link><Link className="btn-secondary" href="/shop?category=skincare">ساخت روتین پوستی</Link></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-[#5c504c]"><span className="inline-flex items-center gap-2"><BadgeCheck size={17} className="text-brand" /> تضمین اصالت</span><span className="inline-flex items-center gap-2"><PackageCheck size={17} className="text-brand" /> بسته‌بندی امن</span><span className="inline-flex items-center gap-2"><Headphones size={17} className="text-brand" /> راهنمای خرید</span></div>
        </div>
      </div>
    </section>

    <section className="section-space container-shell">
      <SectionHeading eyebrow="انتخاب بر اساس دسته" title="هر چیزی که روتین شما نیاز دارد" href="/shop" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">{categories.map((category) => <Link href={`/shop?category=${category.slug}`} key={category.slug} className="group relative aspect-[4/5] overflow-hidden rounded-[1.4rem]"><Image src={category.image} alt={`دسته ${category.name}`} fill sizes="(max-width: 767px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-6"><h2 className="text-lg font-black md:text-xl">{category.name}</h2><p className="mt-1 hidden text-xs text-white/80 sm:block">{category.caption}</p></div></Link>)}</div>
    </section>

    <section className="border-y border-black/5 bg-[#f5f0ea]"><div className="section-space container-shell"><SectionHeading eyebrow="پرفروش‌های این ماه" title="انتخاب‌هایی که دوباره سفارش داده می‌شوند" description="محصولات محبوب با امتیاز بالا و تجربه مصرف رضایت‌بخش." href="/shop?sort=popular" /><div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div></div></section>

    <section className="section-space container-shell"><div className="grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow mb-3">پوستت چه می‌خواهد؟</p><h2 className="section-title text-balance font-black">از دغدغه شروع کن، نه از قفسه شلوغ.</h2><p className="mt-4 max-w-xl leading-8 text-muted">ما انتخاب‌ها را بر اساس نیاز واقعی پوست مرتب کرده‌ایم تا مسیر پیدا کردن محصول مناسب کوتاه‌تر و روشن‌تر باشد.</p><div className="mt-8 space-y-3">{needs.map((need, index) => <Link href={`/shop?skinType=${need.query}`} key={need.title} className={`${need.color} group flex items-center justify-between rounded-2xl p-5 transition hover:-translate-y-0.5`}><span className="flex items-center gap-4"><strong className="text-2xl text-brand/35">۰{index + 1}</strong><span><b className="block">{need.title}</b><small className="mt-1 block text-muted">{need.caption}</small></span></span><ArrowLeft className="transition group-hover:-translate-x-1" size={19} /></Link>)}</div></div><div className="relative aspect-square overflow-hidden rounded-[2rem] bg-ivory"><Image src="/images/category-skincare.png" alt="محصولات منتخب برای روتین مراقبت پوست" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /><div className="absolute bottom-5 right-5 left-5 rounded-2xl bg-white/90 p-5 backdrop-blur"><p className="text-xs font-bold text-brand">راهنمای ماه‌ورا</p><p className="mt-1 font-black">اگر پوست حساسی دارید، هر محصول جدید را ابتدا روی بخش کوچکی از پوست امتحان کنید.</p></div></div></div></section>

    <section className="container-shell"><div className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-14 text-white md:px-14"><div className="absolute -left-20 -top-28 h-80 w-80 rounded-full border border-white/10" /><div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]"><div><p className="text-sm font-bold text-[#e8c7d1]">پیشنهاد محدود این هفته</p><h2 className="mt-2 text-3xl font-black md:text-4xl">روتین کامل، انتخاب ساده‌تر</h2><p className="mt-3 max-w-2xl leading-8 text-white/75">با کد <b className="rounded-md bg-white/10 px-2 py-1 text-white">ROUTINE15</b> برای خرید بالای ۲ میلیون تومان، تا ۱۵٪ تخفیف بگیرید.</p></div><Link href="/shop?discounted=true" className="btn-secondary border-white/50 text-white hover:bg-white hover:text-brand">دیدن پیشنهادها <ArrowLeft size={18} /></Link></div></div></section>

    <section className="section-space container-shell"><SectionHeading eyebrow="تازه رسیده" title="جدیدهای روی میز ماه‌ورا" href="/shop?sort=newest" /><div className="product-grid">{latest.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>

    <section className="bg-sage py-9 text-white"><div className="container-shell grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">{[[ShieldCheck,"ضمانت اصالت کالا","تأمین از مسیرهای قابل بررسی"],[PackageCheck,"ارسال دقیق و امن","بسته‌بندی متناسب با محصول"],[RefreshCcw,"۷ روز فرصت بازگشت","طبق ضوابط کالاهای بهداشتی"],[Headphones,"راهنمای خرید انسانی","پاسخ‌گویی پیش و پس از خرید"]].map(([Icon,title,caption]) => { const C = Icon as typeof ShieldCheck; return <div key={String(title)} className="flex items-center gap-3 text-right"><C size={27} /><span><b className="block text-sm">{String(title)}</b><small className="text-white/70">{String(caption)}</small></span></div>; })}</div></section>

    <section className="section-space container-shell"><SectionHeading eyebrow="برندهای منتخب" title="نام‌هایی که با دقت انتخاب کرده‌ایم" /><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{brands.map((brand) => <Link href={`/shop?brand=${encodeURIComponent(brand)}`} key={brand} className="surface-card grid min-h-24 place-items-center px-3 text-center font-black transition hover:-translate-y-1 hover:border-brand/30">{brand}</Link>)}</div></section>

    <section className="border-y border-black/5 bg-ivory"><div className="section-space container-shell"><SectionHeading eyebrow="از زبان همراهان ماه‌ورا" title="تجربه‌ای آرام‌تر از انتخاب تا تحویل" /><div className="grid gap-4 md:grid-cols-3">{[
      ["توضیحات هر محصول واقعاً کمک کرد بین دو سرم انتخاب درست‌تری داشته باشم. بسته هم سالم و مرتب رسید.","سارا ر.","خریدار تأییدشده"],
      ["فیلتر نوع پوست خیلی کاربردی بود. ضدآفتابی که گرفتم دقیقاً همان بافتی بود که در توضیحات نوشته شده بود.","نگار م.","خریدار تأییدشده"],
      ["پیگیری سفارش شفاف بود و محصول با تاریخ مناسب رسید. تجربه‌ای حرفه‌ای و بی‌دردسر داشتم.","مهسا ک.","خریدار تأییدشده"]
    ].map(([quote,name,badge]) => <figure key={name} className="surface-card p-6"><div className="mb-4 flex gap-1 text-gold" aria-label="امتیاز ۵ از ۵">{Array.from({length:5}).map((_,i)=><Star key={i} size={16} fill="currentColor" />)}</div><blockquote className="leading-8">«{quote}»</blockquote><figcaption className="mt-5 text-sm"><b>{name}</b><span className="mr-2 text-xs text-muted">{badge}</span></figcaption></figure>)}</div></div></section>

    <section className="section-space container-shell"><SectionHeading eyebrow="مجله ماه‌ورا" title="دانستن، بخشی از روتین زیبایی است" href="/blog" /><div className="grid gap-5 md:grid-cols-3">{blogPosts.map((post) => <article key={post.slug} className="group"><Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden rounded-[1.35rem]"><Image src={post.image} alt={`تصویر مقاله ${post.title}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /></Link><p className="mt-4 text-xs font-bold text-brand">{post.category} · {post.readTime}</p><h3 className="mt-2 text-lg font-black leading-8"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p className="mt-2 text-sm leading-7 text-muted">{post.excerpt}</p></article>)}</div></section>

    <section className="container-shell mb-12"><div className="rounded-[2rem] bg-[#eadfd6] px-6 py-12 md:px-12"><div className="grid items-center gap-7 md:grid-cols-2"><div><p className="eyebrow">نامه‌های کوتاه ماه‌ورا</p><h2 className="mt-2 text-2xl font-black md:text-3xl">انتخاب‌های تازه، فقط وقتی ارزش خبر دادن دارند.</h2></div><NewsletterForm /></div></div></section>
  </>;
}
