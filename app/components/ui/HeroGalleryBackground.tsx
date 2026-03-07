'use client';

import { useEffect, useState } from 'react';

interface HeroGalleryBackgroundProps {
  images: string[];
  interval?: number;  // ms between transitions, default 5000
  fallback?: string;  // single image fallback
}

/**
 * HeroGalleryBackground — cycles through multiple images with smooth crossfade.
 * Sits absolutely positioned inside the hero section (parent must be relative + overflow:hidden).
 * Overlay darkness is controlled by the parent (--hero-overlay CSS var from theme).
 *
 * Theme control: hao-zhan.json → effects.heroOverlay
 */
export default function HeroGalleryBackground({
  images,
  interval = 5000,
  fallback,
}: HeroGalleryBackgroundProps) {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  const imgs = images.length > 0 ? images : fallback ? [fallback] : [];

  useEffect(() => {
    setMounted(true);
    if (imgs.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imgs.length);
    }, interval);
    return () => clearInterval(timer);
  }, [imgs.length, interval]);

  if (!imgs.length) return null;

  // SSR: render first image statically; client picks up cycling
  const activeIndex = mounted ? current : 0;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {imgs.map((src, i) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: i === activeIndex ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
            willChange: 'opacity',
          }}
        />
      ))}

      {/* Progress dots — subtle gallery indicator */}
      {imgs.length > 1 && mounted && (
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.4rem',
            zIndex: 3,
          }}
        >
          {imgs.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              style={{
                width: i === activeIndex ? '1.5rem' : '0.4rem',
                height: '0.4rem',
                borderRadius: '999px',
                background: i === activeIndex
                  ? 'var(--secondary, #C9A84C)'
                  : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.4s ease',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
