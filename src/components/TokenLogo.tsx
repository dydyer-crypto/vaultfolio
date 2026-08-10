"use client";

import { useState } from "react";

interface TokenLogoProps {
  symbol: string;
  logo?: string;
  chainColor?: string;
  size?: number;
}

/**
 * Token logo with multi-source fallback.
 * Tries: original URL -> CoinIcons GitHub CDN -> initials circle.
 * Avoids the CoinGecko 403 hotlink block entirely.
 */
export function TokenLogo({ symbol, logo, chainColor, size = 36 }: TokenLogoProps) {
  const [failed, setFailed] = useState(false);
  const [sourceIdx, setSourceIdx] = useState(0);

  const color = chainColor ?? "#3366ff";
  const initials = symbol.slice(0, 2).toUpperCase();
  const px = `${size / 3}px`;

  const sources: string[] = [];
  if (logo && !failed) sources.push(logo);
  sources.push(`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${symbol.toLowerCase()}.svg`);

  const currentSrc = sources[sourceIdx];

  if (!currentSrc || sourceIdx >= sources.length) {
    return (
      <div
        className="flex items-center justify-center rounded-full text-white"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          fontSize: px,
          fontWeight: 700,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={symbol}
      width={size}
      height={size}
      className="rounded-full object-cover"
      onError={() => setSourceIdx((i) => i + 1)}
      onLoad={() => setFailed(false)}
      loading="lazy"
    />
  );
}