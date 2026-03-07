'use client';

import { useEffect, useState } from 'react';
import { type Locale } from '@/lib/i18n';

interface DimSumHours {
  open: string;  // "10:00"
  close: string; // "15:00"
}

interface DimSumStatusBadgeProps {
  dimSumHours?: DimSumHours;
  weekendBrunchHours?: DimSumHours | null;
  locale?: Locale;
  availableText?: string;
  availableTextZh?: string;
  closedText?: string;
  closedTextZh?: string;
  weekendText?: string;
  weekendTextZh?: string;
  className?: string;
  tone?: 'surface' | 'on-dark';
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(':').map(Number);
  return { hours: h, minutes: m };
}

function isTimeInRange(now: Date, openStr: string, closeStr: string): boolean {
  const open = parseTime(openStr);
  const close = parseTime(closeStr);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = open.hours * 60 + open.minutes;
  const closeMinutes = close.hours * 60 + close.minutes;
  return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}

/**
 * DimSumStatusBadge — live indicator showing whether dim sum is currently available.
 * Client-only (uses useEffect to avoid SSR time mismatch).
 */
export default function DimSumStatusBadge({
  dimSumHours = { open: '10:00', close: '15:00' },
  weekendBrunchHours = { open: '09:30', close: '15:30' },
  locale = 'en',
  availableText = 'Dim Sum Available Now',
  availableTextZh = '现在供应点心',
  closedText = 'Dim Sum from 10am',
  closedTextZh = '点心从上午10时供应',
  weekendText = 'Weekend Brunch from 9:30am',
  weekendTextZh = '周末早午餐从早9时30分供应',
  className = '',
  tone = 'surface',
}: DimSumStatusBadgeProps) {
  const [status, setStatus] = useState<'available' | 'closed' | 'weekend' | null>(null);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (isWeekend && weekendBrunchHours) {
        if (isTimeInRange(now, weekendBrunchHours.open, weekendBrunchHours.close)) {
          setStatus('available');
          return;
        }
      }

      if (isTimeInRange(now, dimSumHours.open, dimSumHours.close)) {
        setStatus('available');
      } else if (isWeekend && weekendBrunchHours) {
        setStatus('weekend');
      } else {
        setStatus('closed');
      }
    };

    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [dimSumHours, weekendBrunchHours]);

  if (status === null) return null;

  const isAvailable = status === 'available';
  const isOnDark = tone === 'on-dark';

  const getText = () => {
    if (locale === 'zh') {
      if (isAvailable) return availableTextZh;
      if (status === 'weekend') return weekendTextZh;
      return closedTextZh;
    }
    if (isAvailable) return availableText;
    if (status === 'weekend') return weekendText;
    return closedText;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${className}`}
      style={{
        background: isOnDark
          ? isAvailable
            ? 'var(--primary-dark, #0D0D0D)'
            : 'var(--primary, #1A1A1A)'
          : isAvailable
            ? 'rgba(34, 197, 94, 0.12)'
            : 'rgba(107, 114, 128, 0.12)',
        color: isOnDark
          ? isAvailable
            ? 'var(--text-on-dark-primary, #F5F0E8)'
            : 'var(--text-on-dark-secondary, rgba(245, 240, 232, 0.88))'
          : isAvailable
            ? '#16a34a'
            : 'var(--muted-on-light, #6B7280)',
        border: `1px solid ${
          isOnDark
            ? isAvailable
              ? 'var(--color-success, #22C55E)'
              : 'var(--border-emphasis, rgba(255,255,255,0.35))'
            : isAvailable
              ? 'rgba(34, 197, 94, 0.3)'
              : 'rgba(107, 114, 128, 0.2)'
        }`,
        backdropFilter: isOnDark ? 'blur(2px)' : undefined,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isAvailable
            ? isOnDark
              ? 'var(--color-success, #22C55E)'
              : '#22c55e'
            : isOnDark
              ? 'var(--text-on-dark-secondary, rgba(245, 240, 232, 0.85))'
              : '#9ca3af',
          flexShrink: 0,
          ...(isAvailable && {
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }),
        }}
      />
      {getText()}
    </span>
  );
}
