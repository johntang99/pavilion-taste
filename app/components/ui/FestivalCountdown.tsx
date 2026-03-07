'use client';

import { useEffect, useState } from 'react';

interface FestivalCountdownProps {
  targetDate: string;  // ISO date string e.g. "2027-01-29"
  label?: string;
  labelZh?: string;
  locale?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft | null {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * FestivalCountdown — countdown timer to a festival date.
 * Auto-calculates from targetDate, updates every second.
 * Used on festival pages for urgency.
 */
export default function FestivalCountdown({
  targetDate,
  label = 'Reserve before sold out',
  labelZh = '尽早预约，席位有限',
  locale = 'en',
  className = '',
}: FestivalCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setTimeLeft(calculateTimeLeft(targetDate));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted || !timeLeft) return null;

  const displayLabel = locale === 'zh' ? labelZh : label;
  const units = locale === 'zh'
    ? [{ value: timeLeft.days, label: '天' }, { value: timeLeft.hours, label: '时' }, { value: timeLeft.minutes, label: '分' }, { value: timeLeft.seconds, label: '秒' }]
    : [{ value: timeLeft.days, label: 'Days' }, { value: timeLeft.hours, label: 'Hours' }, { value: timeLeft.minutes, label: 'Min' }, { value: timeLeft.seconds, label: 'Sec' }];

  return (
    <div className={`festival-countdown ${className}`}>
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          opacity: 0.7,
          marginBottom: '0.75rem',
        }}
      >
        {displayLabel}
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {units.map(({ value, label: unitLabel }) => (
          <div key={unitLabel} style={{ textAlign: 'center', minWidth: '3.5rem' }}>
            <div
              style={{
                fontFamily: 'var(--font-display, Georgia, serif)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 700,
                lineHeight: 1,
                color: 'var(--festival-accent, #C9A84C)',
                marginBottom: '0.25rem',
              }}
            >
              {String(value).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>
              {unitLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
