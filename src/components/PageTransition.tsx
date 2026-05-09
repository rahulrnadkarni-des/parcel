"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useNavDirection } from "@/lib/navigation";

type Direction = "forward" | "backward";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

const variants = {
  initial: (dir: Direction) => ({
    x: dir === "forward" ? "100%" : "0%",
    zIndex: dir === "forward" ? 1 : 0,
  }),
  animate: (dir: Direction) => ({
    x: "0%",
    zIndex: dir === "forward" ? 1 : 0,
    transition: {
      x: dir === "forward" ? { duration: 0.28, ease: EASE } : { duration: 0 },
      zIndex: { duration: 0 },
    },
  }),
  exit: (dir: Direction) => ({
    x: dir === "forward" ? "0%" : "100%",
    zIndex: dir === "forward" ? 0 : 1,
    transition: {
      x: dir === "forward" ? { duration: 0.28 } : { duration: 0.28, ease: EASE },
      zIndex: { duration: 0 },
    },
  }),
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const direction = useNavDirection();

  return (
    <div className="relative overflow-x-hidden min-h-screen">
      <AnimatePresence mode="sync" custom={direction} initial={false}>
        <motion.div
          key={pathname}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute top-0 left-0 right-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
