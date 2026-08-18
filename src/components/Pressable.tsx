"use client";

import { ButtonHTMLAttributes, useState } from "react";

export function Pressable({
  className = "",
  onClick,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [pulseKey, setPulseKey] = useState(0);

  return (
    <button
      {...rest}
      onClick={(e) => {
        setPulseKey((k) => k + 1);
        onClick?.(e);
      }}
      className={`relative overflow-hidden transition-colors hover:bg-foreground/5 ${className}`}
    >
      {children}
      {pulseKey > 0 && (
        <span
          key={pulseKey}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-foreground/25 animate-row-pulse"
        />
      )}
    </button>
  );
}
