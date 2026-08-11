# وضعیت پروژه ماه‌ورا

آخرین به‌روزرسانی: ۲۰ مرداد ۱۴۰۵ / 10 Aug 2026

## کامل‌شده

- تحقیق UX و انتخاب هویت مستقل ماه‌ورا
- Design System، SVG logo/wordmark و ۵ تصویر Original تولیدشده
- Next.js 16 App Router، TypeScript strict، Tailwind 4 و RTL واقعی
- Homepage، Catalog URL filters، Search، Product Page، Cart، Checkout
- Register/Login/Logout، Session DB، Forgot-password token architecture و RBAC
- Order، Server pricing، Coupon، Inventory reservation، Mock payment و idempotent verify
- Account، order details، addresses، database Wishlist
- Admin dashboard، products create/edit/archive، orders status، data sections و Audit Log
- Blog، صفحات ثابت، Contact/Newsletter، SEO و generic product feed
- PostgreSQL Prisma schema، migration اولیه و seed ۲۴ محصوله
- Secure headers، rate limits، validation و error states
- Dockerfile/Compose، `.env.example`، مستندات و README
- ۱۱ Unit test، Lint، Type Check، Production Build و Browser QA

## تصمیم‌های معماری

- قیمت‌ها در DB به «تومان صحیح» نگه‌داری می‌شوند؛ Adapter درگاه هنگام نیاز تبدیل رسمی Provider را انجام می‌دهد.
- Cart مهمان Local Storage است؛ Order فقط از ID/Quantity ورودی استفاده و قیمت را از DB محاسبه می‌کند.
- Stock در ساخت Order رزرو و فقط در Verify کم می‌شود.
- Admin route و API هر دو Authorization مستقل دارند.
- Feed ترب عمداً Generic است تا Contract رسمی Merchant دریافت شود.
- Integrationهای بدون Credential به Adapter/Env/Mock محدود مانده‌اند.

## محدودیت‌های محیط ساخت

- Git و Docker روی ماشین فعلی نصب نبودند؛ Compose واقعاً اجرا نشد.
- PostgreSQL محلی در دسترس نبود؛ Prisma schema/generate/migration و Build تأیید شدند، اما Seed/DB integration runtime به PostgreSQL نیاز دارد.
- Email، SMS، درگاه واقعی، Domain، Analytics و اطلاعات شبکه اجتماعی نیازمند مالک و Credential واقعی‌اند.

## دستورات اجرا

```powershell
npm install
Copy-Item .env.example .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Quality:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run qa:browser
```

## مرحله بعد Production

1. فراهم‌کردن PostgreSQL و اجرای Migration/Seed.
2. ورود با Admin Demo و Smoke test عملیاتی Create Product → Checkout → Mock Verify.
3. دریافت Credential و مستندات رسمی درگاه/Email/Analytics از مالک.
4. جایگزینی Upload محلی با Object Storage و افزودن ویرایش تصویری کامل Admin.
5. تست امنیت، Accessibility و Performance مستقل پیش از Go-live.
