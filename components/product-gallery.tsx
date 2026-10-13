"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useState } from "react";

type ProductImage = { src: string; alt: string };

export function ProductGallery({ images }: { images: readonly ProductImage[] }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setZoomed(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [zoomed]);

  const move = (direction: number) => setActive((current) => (current + direction + images.length) % images.length);

  return <div>
    <div className="gallery-main group">
      <Image src={images[active].src} alt={images[active].alt} fill sizes="(max-width: 900px) 100vw, 52vw" className="object-cover transition duration-700 group-hover:scale-[1.02]" />
      <button className="gallery-arrow left-4" onClick={() => move(-1)} aria-label="Previous image"><ChevronLeft size={20} /></button>
      <button className="gallery-arrow right-4" onClick={() => move(1)} aria-label="Next image"><ChevronRight size={20} /></button>
      <button className="zoom-button" onClick={() => setZoomed(true)} aria-label="Zoom product image"><Expand size={18} /><span>Zoom</span></button>
    </div>
    <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
      {images.map((image, index) => <button key={image.src} className={`thumb ${active === index ? "thumb-active" : ""}`} onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`}>
        <Image src={image.src} alt="" fill sizes="120px" className="object-cover" />
      </button>)}
    </div>
    {zoomed && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Zoomed product image">
      <button className="lightbox-close" onClick={() => setZoomed(false)} aria-label="Close image zoom"><X /></button>
      <div className="relative h-[88vh] w-[min(760px,90vw)]"><Image src={images[active].src} alt={images[active].alt} fill sizes="90vw" className="object-contain" priority /></div>
    </div>}
  </div>;
}

