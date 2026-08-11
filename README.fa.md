# فروشگاه ماه‌ورا

[![Quality gates](https://github.com/Alivexor/mahvara-store/actions/workflows/quality.yml/badge.svg)](https://github.com/Alivexor/mahvara-store/actions/workflows/quality.yml)
[![Release](https://img.shields.io/github/v/release/Alivexor/mahvara-store?display_name=tag)](https://github.com/Alivexor/mahvara-store/releases)
[![License](https://img.shields.io/badge/license-انتخاب%20نشده-lightgrey)](#مجوز)

**زبان‌ها:** [فارسی](README.fa.md) · [English](README.md)

ماه‌ورا یک فروشگاه اینترنتی تمام‌پشته برای محصولات آرایشی و مراقبت پوست است. رابط کاربری آن از ابتدا برای زبان فارسی و راست‌به‌چپ طراحی شده و در کنار تجربهٔ خرید، منطق قابل اتکای سفارش، موجودی، حساب کاربری و مدیریت فروشگاه را ارائه می‌دهد.

> این پروژه نسخهٔ 1.0 خود را منتشر کرده است. درگاه پرداخت موجود، شبیه‌ساز امن برای توسعه است و تا زمان اتصال credentialهای مالک، هیچ پرداخت واقعی انجام نمی‌شود.

| نمایش دسکتاپ | نمایش موبایل |
| --- | --- |
| ![صفحهٔ اصلی ماه‌ورا در دسکتاپ](docs/screenshots/home-desktop.png) | ![صفحهٔ اصلی ماه‌ورا در موبایل](docs/screenshots/home-mobile.png) |

## قابلیت‌ها

- رابط فارسی، RTL-first و واکنش‌گرا برای دسکتاپ و موبایل
- کاتالوگ محصولات با جست‌وجو، فیلتر، مرتب‌سازی و نگهداری وضعیت در URL
- صفحهٔ محصول با گالری تصاویر، موجودی، قیمت، تخفیف، محصولات مرتبط، علاقه‌مندی و محصولات بازدیدشده
- سبد خرید محلی، فرم checkout اعتبارسنجی‌شده و محاسبهٔ دوبارهٔ قیمت‌ها در سمت سرور
- کوپن تخفیف، رزرو تراکنشی موجودی و جلوگیری از فروش بیش از موجودی
- abstraction درگاه پرداخت، درگاه آزمایشی، تأیید پرداخت، محافظت از callback تکراری و آزادسازی رزرو در پرداخت ناموفق
- ثبت‌نام، ورود، خروج، هش رمز عبور، session دیتابیسی، معماری بازیابی رمز و کنترل دسترسی مبتنی بر نقش
- حساب کاربری برای سفارش‌ها، نشانی‌ها، پروفایل و علاقه‌مندی‌ها
- پنل مدیریت محافظت‌شده برای محصولات، سفارش‌ها و داده‌های عملیاتی
- وبلاگ، تماس با ما، خبرنامه، صفحات اطلاعاتی، SEO، JSON-LD، sitemap، robots و PWA manifest
- Prisma schema، migration، seed data، Docker، GitHub Actions، Dependabot و تست مرورگر

## فناوری‌ها

| بخش | انتخاب پروژه |
| --- | --- |
| فریم‌ورک | Next.js 16 با App Router و React 19 |
| زبان | TypeScript با بررسی strict |
| ظاهر | Tailwind CSS 4 و فونت Vazirmatn |
| داده | PostgreSQL و Prisma ORM |
| اعتبارسنجی | Zod |
| امنیت رمز | bcryptjs |
| تست | Vitest و Playwright Core |

## ساختار پروژه

```text
app/           مسیرها، صفحه‌ها، metadata و API routeها
components/    کامپوننت‌های مشترک رابط، layout و مدیریت
features/      تعامل‌های client-side برای سبد، کاتالوگ و احراز هویت
lib/           دیتابیس، امنیت، session، پرداخت و منطق دامنه
services/      use caseهای برنامه، از جمله ایجاد سفارش
schemas/       schemaهای Zod برای ورودی‌ها
prisma/        مدل داده، migration و seed
public/        دارایی‌های برند و تصاویر محصول
tests/         تست‌های واحد commerce، موجودی، احراز هویت و پرداخت
docs/          پژوهش، راهنمای برند و اسکرین‌شات‌های QA
```

## اجرای محلی

### پیش‌نیازها

- Node.js نسخهٔ 20.9 یا جدیدتر
- npm
- PostgreSQL 17، یا Docker Desktop برای استفاده از Compose

### مراحل راه‌اندازی

1. وابستگی‌ها را نصب کن:

   ```bash
   npm ci
   ```

2. فایل محیط محلی را بساز:

   ```powershell
   Copy-Item .env.example .env
   ```

3. PostgreSQL را اجرا کن. با Docker:

   ```bash
   docker compose up -d postgres
   ```

4. در `.env`، مقدار `DATABASE_URL` را بررسی کن و برای `AUTH_SECRET` یک مقدار تصادفی و طولانی قرار بده:

   ```bash
   openssl rand -base64 32
   ```

5. Prisma Client، migration و داده‌های نمایشی را آماده کن:

   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

6. برنامه را اجرا کن و به `http://localhost:3000` برو:

   ```bash
   npm run dev
   ```

در ویندوز، قبل از اجرای `npm run db:generate` سرور `next dev` را متوقف کن؛ ممکن است فایل engine پریزما توسط سرور درحال اجرا قفل شده باشد.

## متغیرهای محیطی

از `.env.example` شروع کن و هرگز فایل `.env` را commit نکن.

| متغیر | کاربرد |
| --- | --- |
| `DATABASE_URL` | آدرس اتصال PostgreSQL |
| `AUTH_SECRET` | secret طولانی و یکتا برای بخش‌های امنیتی |
| `SESSION_COOKIE_NAME` | نام cookie نشست کاربر |
| `NEXT_PUBLIC_APP_URL` | آدرس اصلی و public برنامه |
| `PAYMENT_PROVIDER` | در توسعه `mock`؛ برای پرداخت واقعی نیازمند adapter است |
| `PAYMENT_CALLBACK_URL` | آدرس کامل callback درگاه |
| `DEMO_ADMIN_*` و `DEMO_CUSTOMER_*` | اعتبارهای seed؛ در production باید تغییر کنند |
| `RATE_LIMIT_WINDOW_MS` و `RATE_LIMIT_MAX` | کنترل اولیهٔ abuse |

## بررسی کیفیت

پیش از انتشار یا pull request، دستورهای زیر را اجرا کن:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

برای QA مرورگر، برنامه را در یک ترمینال روی پورت 3010 اجرا کن و در ترمینال دیگر تست را بزن:

```bash
npm run dev -- --port 3010
npm run qa:browser
```

این تست 11 مسیر کلیدی را در دو اندازهٔ صفحه بررسی می‌کند، خطای console و horizontal overflow را گزارش می‌دهد و اسکرین‌شات‌های صفحهٔ اصلی را تازه می‌کند.

## Docker

برای اجرای هم‌زمان برنامه و دیتابیس:

```bash
docker compose up --build
```

پیش از هر استفادهٔ غیرمحلی، حتماً `AUTH_SECRET`، رمز PostgreSQL و `NEXT_PUBLIC_APP_URL` را با مقادیر واقعی و امن جایگزین کن.

## وضعیت نسخهٔ 1.0

نسخهٔ منتشرشده شامل کد، مستندات، migration، دادهٔ نمایشی، تست‌ها و pipeline کیفیت است. جزئیات تحویل در [PROJECT_STATUS.md](PROJECT_STATUS.md) آمده است.

موارد زیر عمداً به credential یا قرارداد مالک وابسته‌اند و بخشی از کد نمایشی نیستند:

- اتصال درگاه پرداخت واقعی و آزمایش sandbox آن
- سرویس واقعی ایمیل یا پیامک
- دامنه، DNS، TLS، analytics و شبکه‌های اجتماعی نهایی
- دیتابیس مدیریت‌شده، object storage، backup، monitoring و alerting
- تست مستقل امنیت، بار، دسترس‌پذیری و دستگاه واقعی پیش از go-live

## مشارکت و امنیت

- [راهنمای مشارکت](CONTRIBUTING.md)
- [سیاست امنیتی](SECURITY.md)
- [وضعیت نهایی پروژه](PROJECT_STATUS.md)
- [یادداشت‌های برند](docs/BRAND.md)
- [پژوهش UX](docs/RESEARCH.md)

## مجوز

برای این ریپو هنوز مجوز متن‌باز انتخاب نشده است. تا زمانی که مالک مجوزی اضافه نکند، کد و دارایی‌ها برای استفادهٔ مجدد مجوز ندارند.
