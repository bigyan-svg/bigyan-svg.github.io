"use client";

import type { ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function TiltCard({
  children,
  className,
  glare = true
}: {
  children: ReactNode;
  className?: string;
  glare?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-40, 40], [10, -10]);
  const rotateY = useTransform(x, [-40, 40], [-10, 10]);

  const springRotateX = useSpring(rotateX, { stiffness: 160, damping: 14 });
  const springRotateY = useSpring(rotateY, { stiffness: 160, damping: 14 });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("relative", className)}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        x.set(event.clientX - (rect.left + rect.width / 2));
        y.set(event.clientY - (rect.top + rect.height / 2));
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {glare ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "radial-gradient(420px circle at var(--x,50%) var(--y,50%), rgba(120,230,255,0.18), transparent 45%)"
          }}
          onUpdate={() => {
            // noop: keeps layer as motion element for cheaper repaints
          }}
        />
      ) : null}
      <div style={{ transform: "translateZ(14px)" }}>{children}</div>
    </motion.div>
  );
}