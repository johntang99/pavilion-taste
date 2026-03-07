'use client';

import { type CSSProperties } from 'react';

interface InkWashOverlayProps {
  className?: string;
  /** Override opacity (0–1). Defaults to CSS var(--ink-overlay-opacity) */
  opacity?: number;
  /** Override color. Defaults to CSS var(--ink-overlay-color) */
  color?: string;
}

/**
 * InkWashOverlay — semi-transparent ink wash texture over hero images.
 * Creates a traditional Chinese watercolor aesthetic.
 * Sits absolutely positioned, must be inside a relative-positioned parent.
 */
export default function InkWashOverlay({
  className = '',
  opacity,
  color,
}: InkWashOverlayProps) {
  const style: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 1,
    background: color
      ? `radial-gradient(ellipse at 30% 60%, ${color} 0%, transparent 65%), radial-gradient(ellipse at 70% 20%, ${color} 0%, transparent 55%)`
      : 'radial-gradient(ellipse at 30% 60%, var(--ink-overlay-color, rgba(26,26,26,0.25)) 0%, transparent 65%), radial-gradient(ellipse at 70% 20%, var(--ink-overlay-color, rgba(26,26,26,0.15)) 0%, transparent 55%)',
    opacity: opacity ?? 1,
    mixBlendMode: 'multiply',
  };

  return <div aria-hidden="true" className={className} style={style} />;
}
