"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

function buildStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = Math.sin(i * 9301 + 49297) * 233280;
    const random = (min: number, max: number, shift: number) => {
      const value = Math.abs(Math.sin(seed + shift));
      return min + value * (max - min);
    };

    return {
      id: i,
      x: random(0, 100, 1.2),
      y: random(0, 100, 4.4),
      size: random(1, 2.6, 8.1),
      delay: random(0, 4, 10.5),
      duration: random(2.2, 6.4, 13.8)
    };
  });
}

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  const stars = useMemo(() => buildStars(78), []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(86,197,255,0.22),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(151,71,255,0.14),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(93,255,182,0.16),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] opacity-60" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:3px_3px]" />
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: 0.7
          }}
          animate={
            reduceMotion
              ? { opacity: 0.65 }
              : {
                  opacity: [0.2, 0.95, 0.2],
                  scale: [1, 1.5, 1]
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  delay: star.delay,
                  duration: star.duration,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
          }
        />
      ))}
    </div>
  );
}