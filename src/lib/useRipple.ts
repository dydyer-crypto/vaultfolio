"use client";

import { useCallback } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function useRipple() {
  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.className = "ripple-ink";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return { createRipple };
}