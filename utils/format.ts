export const formatPrice = (amount: number) =>
  `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;

export const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

export const discountPercent = (price: number, salePrice?: number) =>
  salePrice && salePrice < price ? Math.round(((price - salePrice) / price) * 100) : 0;

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");
