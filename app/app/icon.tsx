import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

const PRIMARY_COLOR = '#8B1A1A';
const PRIMARY_COLOR_ENV = process.env.NEXT_PUBLIC_PRIMARY_COLOR || process.env.PRIMARY_COLOR;

function resolvePrimaryColor() {
  if (!PRIMARY_COLOR_ENV) return PRIMARY_COLOR;
  const value = PRIMARY_COLOR_ENV.trim();
  // Accept #RGB or #RRGGBB only to keep icon rendering predictable.
  if (/^#[0-9a-fA-F]{3}$/.test(value) || /^#[0-9a-fA-F]{6}$/.test(value)) {
    return value;
  }
  return PRIMARY_COLOR;
}

export default function Icon() {
  const iconColor = resolvePrimaryColor();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            fontSize: 20,
            fontWeight: 800,
            lineHeight: 1,
            fontFamily: 'Georgia, serif',
          }}
        >
        PAV
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

