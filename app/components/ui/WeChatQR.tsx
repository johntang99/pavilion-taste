import Image from 'next/image';

interface WeChatQRProps {
  qrUrl?: string | null;
  accountName?: string | null;
  heading?: string;
  headingZh?: string;
  locale?: string;
  className?: string;
}

/**
 * WeChatQR — displays WeChat public account QR code with EN/ZH prompt.
 * Shows placeholder if qrUrl is empty.
 */
export default function WeChatQR({
  qrUrl,
  accountName,
  heading = 'Follow us on WeChat',
  headingZh = '微信关注我们',
  locale = 'en',
  className = '',
}: WeChatQRProps) {
  const displayHeading = locale === 'zh' ? headingZh : heading;

  return (
    <div className={`wechat-qr ${className}`}>
      <p
        style={{
          fontSize: 'var(--text-small, 0.875rem)',
          color: 'var(--text-color-secondary, #4B5563)',
          marginBottom: '0.75rem',
          fontWeight: 500,
        }}
      >
        {displayHeading}
      </p>

      {qrUrl ? (
        <div
          style={{
            width: 120,
            height: 120,
            border: '2px solid var(--border-default, rgba(0,0,0,0.1))',
            borderRadius: 'var(--card-radius, 4px)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            src={qrUrl}
            alt={`WeChat QR code for ${accountName || 'our restaurant'}`}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      ) : (
        /* Placeholder QR square */
        <div
          style={{
            width: 120,
            height: 120,
            border: '2px solid var(--border-default, rgba(0,0,0,0.1))',
            borderRadius: 'var(--card-radius, 4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'var(--backdrop-secondary, #f9f6f0)',
          }}
        >
          {/* WeChat icon placeholder */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="11" cy="13" r="8" fill="none" stroke="var(--seal-color, #8B0000)" strokeWidth="1.5" />
            <circle cx="22" cy="17" r="7" fill="none" stroke="var(--seal-color, #8B0000)" strokeWidth="1.5" />
            <circle cx="9" cy="12" r="1.5" fill="var(--seal-color, #8B0000)" />
            <circle cx="13" cy="12" r="1.5" fill="var(--seal-color, #8B0000)" />
            <circle cx="20" cy="16" r="1.5" fill="var(--seal-color, #8B0000)" />
            <circle cx="24" cy="16" r="1.5" fill="var(--seal-color, #8B0000)" />
          </svg>
          <span
            style={{
              fontSize: '10px',
              color: 'var(--text-color-muted)',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            {locale === 'zh' ? '微信' : 'WeChat'}
            {accountName && (
              <>
                <br />
                <strong>{accountName}</strong>
              </>
            )}
          </span>
        </div>
      )}

      {accountName && (
        <p
          style={{
            fontSize: '11px',
            color: 'var(--text-color-muted)',
            marginTop: '0.5rem',
          }}
        >
          {accountName}
        </p>
      )}
    </div>
  );
}
