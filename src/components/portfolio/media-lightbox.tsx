"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/lib/types";
import { imageBlurDataUrl } from "@/lib/data";

export function MediaLightbox({ photos }: { photos: Photo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = useMemo(() => photos.findIndex((photo) => photo.id === activeId), [activeId, photos]);
  const activePhoto = activeIndex >= 0 ? photos[activeIndex] : null;

  const goTo = useCallback(
    (nextIndex: number) => {
      const total = photos.length;
      const wrapped = (nextIndex + total) % total;
      setActiveId(photos[wrapped].id);
    },
    [photos]
  );

  useEffect(() => {
    if (!activePhoto) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
      if (event.key === "ArrowRight") goTo(activeIndex + 1);
      if (event.key === "ArrowLeft") goTo(activeIndex - 1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, activePhoto, goTo]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveId(photo.id)}
            className="group overflow-hidden rounded-2xl border border-border/60 text-left"
          >
            <Image
              src={photo.image}
              alt={photo.title}
              width={700}
              height={520}
              placeholder="blur"
              blurDataURL={imageBlurDataUrl}
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <div className="bg-card/80 p-3 text-sm">
              <p className="font-medium">{photo.title}</p>
              <p className="text-xs text-muted-foreground">{photo.caption}</p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activePhoto ? (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border/60 bg-background"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2"
                aria-label="Close lightbox"
              >
                <X className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2"
                aria-label="Next photo"
              >
                <ChevronRight className="size-4" />
              </button>

              <Image
                src={activePhoto.image}
                alt={activePhoto.title}
                width={1400}
                height={980}
                className="max-h-[75vh] w-full object-cover"
              />
              <div className="p-4">
                <p className="font-semibold">{activePhoto.title}</p>
                <p className="text-sm text-muted-foreground">{activePhoto.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
