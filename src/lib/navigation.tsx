"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Direction = "forward" | "backward";

interface NavContextValue {
  direction: Direction;
  markBackward: () => void;
}

const DirectionContext = createContext<NavContextValue>({
  direction: "forward",
  markBackward: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<Direction>("forward");
  const isPop = useRef(false);
  const isBack = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    const onPopState = () => { isPop.current = true; };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    setDirection(isPop.current || isBack.current ? "backward" : "forward");
    isPop.current = false;
    isBack.current = false;
  }, [pathname]);

  const markBackward = () => { isBack.current = true; };

  return (
    <DirectionContext.Provider value={{ direction, markBackward }}>
      {children}
    </DirectionContext.Provider>
  );
}

export const useNavDirection = () => useContext(DirectionContext).direction;
export const useMarkBackward = () => useContext(DirectionContext).markBackward;
