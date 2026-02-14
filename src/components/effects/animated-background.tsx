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
      size: random(1, 2.3, 8.1),
      delay: random(0, 4, 10.5),
      duration: random(2.2, 6.4, 13.8)
    };
  });
}

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();
  const stars = useMemo(() => buildStars(64), []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <motion.div
        className="absolute -left-[18%] top-[-24%] h-[58vh] w-[58vh] rounded-full bg-cyan-300/20 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 40, 0], y: [0, 14, 0] }}
        transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[16%] top-[6%] h-[52vh] w-[52vh] rounded-full bg-blue-300/18 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -36, 0], y: [0, -20, 0] }}
        transition={reduceMotion ? undefined : { duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-24%] left-[38%] h-[50vh] w-[50vh] rounded-full bg-emerald-300/18 blur-3xl"
        animate={reduceMotion ? undefined : { y: [0, -26, 0], x: [0, 12, 0] }}
        transition={reduceMotion ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_22%,rgba(255,255,255,0.92),transparent_56%),radial-gradient(circle_at_88%_14%,rgba(234,246,255,0.78),transparent_52%),linear-gradient(180deg,rgba(252,254,255,0.94),rgba(242,249,255,0.86))]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(20,90,210,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,90,210,0.18)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_50%_22%,black,transparent_72%)]" />
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-cyan-500/70"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: 0.34
          }}
          animate={
            reduceMotion
              ? { opacity: 0.34 }
              : {
                  opacity: [0.12, 0.52, 0.12],
                  scale: [1, 1.34, 1]
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
