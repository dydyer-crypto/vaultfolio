"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpOptions {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export function useCountUp({ end, start = 0, duration = 1200, decimals = 0, prefix = "", suffix = "", delay = 0 }: CountUpOptions) {
  const [value, setValue] = useState(start);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !active) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let startTime = 0;
    const startDelay = delay;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp + startDelay;
      const elapsed = timestamp - startTime;

      if (elapsed < 0) {
        raf = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = start + (end - start) * eased;

      setValue(current);

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, start, end, duration, delay]);

  const formatted = formatNumber(value, decimals, prefix, suffix);

  return { ref, value: formatted, raw: value };
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function formatNumber(num: number, decimals: number, prefix: string, suffix: string): string {
  const fixed = num.toFixed(decimals);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${prefix}${parts.join(".")}${suffix}`;
}

interface CountUpTextProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}

export function CountUp({ end, start = 0, duration = 1200, decimals = 0, prefix = "", suffix = "", delay = 0, className }: CountUpTextProps) {
  const { ref, value } = useCountUp({ end, start, duration, decimals, prefix, suffix, delay });
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}