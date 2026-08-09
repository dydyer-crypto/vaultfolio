"use client";

import { useEffect, useRef, useState } from "react";

type AnimationType = "spring-up" | "spring-in" | "spring-left" | "spring-right" | "fade-scale" | "material-in";

interface RevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export function Reveal({
  children,
  animation = "spring-up",
  delay = 0,
  threshold = 0.15,
  className = "",
  once = true,
}: RevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const animationClass = getAnimationClass(animation, visible);

  return (
    <div
      ref={ref}
      className={`${className} ${animationClass}`}
      style={{ animationDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

function getAnimationClass(type: AnimationType, visible: boolean): string {
  if (!visible) return "opacity-0";

  switch (type) {
    case "spring-up":
      return "animate-spring-up";
    case "spring-in":
      return "animate-spring-in";
    case "material-in":
      return "animate-material-in";
    case "spring-left":
      return "reveal-left";
    case "spring-right":
      return "reveal-right";
    case "fade-scale":
      return "reveal-fade-scale";
    default:
      return "animate-spring-up";
  }
}