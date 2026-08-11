# خلاصه تحقیق تجربه فروشگاه Beauty

تحقیق در ۱۰ اوت ۲۰۲۶ روی ساختار زنده Sephora، Glossier، Cult Beauty و Lookfantastic و راهنماهای رسمی Next.js/web.dev انجام شد. هدف استخراج الگو بود، نه بازسازی ظاهر هیچ برند.

## الگوهای مشترک

- Homepage از Hero کمپینی به دسته‌ها، Bestseller، انتخاب بر اساس دغدغه، Proof/Trust، Editorial و Newsletter می‌رسد.
- Navigation فقط دسته‌محور نیست؛ «نیاز پوست»، «نوع محصول»، «ترکیب» و «برند» مسیرهای کشف موازی‌اند.
- Product Card تصویر بزرگ، برند، نام کوتاه، امتیاز، قیمت/قیمت قبلی، تخفیف واضح و اقدام سریع دارد.
- PDP اطلاعات تصمیم‌ساز را پیش از Fold نگه می‌دارد و جزئیات، ترکیبات، روش مصرف، هشدار، ارسال و Review را لایه‌لایه نمایش می‌دهد.
- Cart باید آستانه ارسال رایگان، قیمت شفاف، حذف/تعداد، کوپن و CTA واحد داشته باشد.
- Checkout موبایل باید کوتاه، مرحله‌بندی‌شده و با Summary همیشگی باشد؛ اطلاعات نشانی و پرداخت کم‌اصطکاک بماند.
- تصاویر هم‌سبک، Whitespace کافی و Typography محدود، حس Premium را بهتر از تزئینات زیاد می‌سازند.
- Blog وقتی ارزش دارد که به دغدغه واقعی و مسیر محصول متصل باشد، بدون ادعای پزشکی قطعی.
- Metadata یکتا، Structured Data، Breadcrumb، Sitemap و عملکرد تصویر پایه‌های SEO فروشگاه‌اند.

## منابع بررسی‌شده

- https://www.sephora.com/
- https://www.glossier.com/
- https://www.cultbeauty.com/
- https://www.lookfantastic.com/
- https://nextjs.org/docs/architecture/accessibility
- https://web.dev/

برای ترب، منبع رسمی عمومی با Contract دقیق و پایدار پیدا نشد؛ بنابراین فقط Feed عمومی نسخه‌دار در `/api/feeds/products` ساخته شد و از اختراع XML اختصاصی خودداری شد.
