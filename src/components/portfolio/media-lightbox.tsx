"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Photo } from "@/lib/types";
import { imageBlurDataUrl } from "@/lib/data";

export function MediaLightbox({ photos }: { photos: Photo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activePhoto = photos.find((photo) => photo.id === activeId);

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
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4"
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