"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type PhotoItem = {
  id: string;
  title: string;
  imageUrl: string;
};

export function PhotoLightbox({ photos }: { photos: PhotoItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            className="group relative overflow-hidden rounded-lg border border-border"
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              width={640}
              height={480}
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 text-left text-xs text-white">
              {photo.title}
            </span>
          </button>
        ))}
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-opacity",
          activeIndex === null ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        {activeIndex !== null ? (
          <div className="relative max-h-[90vh] w-full max-w-5xl">
            <button
              className="absolute right-2 top-2 z-10 rounded-full bg-black/70 p-2 text-white"
              onClick={() => setActiveIndex(null)}
            >
              <X className="size-5" />
            </button>
            <Image
              src={photos[activeIndex].imageUrl}
              alt={photos[activeIndex].title}
              width={1400}
              height={1000}
              className="max-h-[90vh] w-full rounded-lg object-contain"
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
