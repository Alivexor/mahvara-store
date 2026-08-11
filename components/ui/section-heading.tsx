import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SectionHeading({ eyebrow, title, description, href }: { eyebrow?: string; title: string; description?: string; href?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-5 md:mb-10">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="section-title font-black">{title}</h2>
        {description && <p className="mt-3 leading-8 text-muted">{description}</p>}
      </div>
      {href && <Link href={href} className="hidden items-center gap-2 text-sm font-bold text-brand md:flex">مشاهده همه <ArrowLeft size={17} /></Link>}
    </div>
  );
}
