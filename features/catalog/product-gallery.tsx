"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(images[0]);
  return <div className="grid gap-3 sm:grid-cols-[5rem_1fr]"><div className="order-2 flex gap-2 overflow-auto sm:order-1 sm:flex-col" aria-label="تصاویر محصول">{images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActive(image)} className={`relative aspect-square min-w-20 overflow-hidden rounded-xl border-2 ${active === image ? "border-brand" : "border-transparent"}`} aria-label={`نمایش تصویر ${index + 1}`} aria-pressed={active === image}><Image src={image} alt="" fill sizes="80px" className="object-cover" /></button>)}</div><div className="relative order-1 aspect-square overflow-hidden rounded-[1.6rem] bg-ivory sm:order-2" aria-live="polite"><Image src={active} alt={alt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition duration-300 hover:scale-110" /></div></div>;
}
