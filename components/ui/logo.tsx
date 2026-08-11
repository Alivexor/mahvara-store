import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="ماه‌ورا، صفحه اصلی">
      <Image src={compact ? "/brand/mahvara-mark.svg" : "/brand/mahvara-wordmark.svg"} alt="ماه‌ورا" width={compact ? 44 : 174} height={compact ? 44 : 48} priority />
    </Link>
  );
}
