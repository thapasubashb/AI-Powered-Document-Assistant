"use client";

import { useInView } from "@/hooks/useInView";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

interface RevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const directionStyles: Record<Direction, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  scale: "scale-95",
  fade: "",
};

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  className = "",
  threshold = 0.15,
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold });

  return (
    <div
      ref={ref}
      className={`transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${className} ${
        inView
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : `opacity-0 ${directionStyles[direction]}`
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}