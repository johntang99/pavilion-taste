import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      siteId,
      festivalId,
      festivalName,
      festivalSlug,
      tierName,
      contactName,
      contactEmail,
      contactPhone,
      guestCount,
      preferredDate,
      dietaryNotes,
      specialRequests,
    } = body;

    // Validate
    const missingFields: string[] = [];
    if (!contactName?.trim()) missingFields.push('contactName');
    if (!contactEmail?.includes('@')) missingFields.push('contactEmail');
    if (!guestCount || parseInt(guestCount) < 1) missingFields.push('guestCount');
    if (!preferredDate) missingFields.push('preferredDate');

    if (missingFields.length > 0) {
      return NextResponse.json({ error: 'validation_failed', fields: missingFields }, { status: 400 });
    }

    const reservation = {
      site_id: siteId || process.env.NEXT_PUBLIC_DEFAULT_SITE || 'grand-pavilion',
      name: contactName,
      email: contactEmail,
      phone: contactPhone || null,
      party_size: parseInt(guestCount),
      reservation_date: preferredDate,
      reservation_time: '18:00',
      occasion: `${festivalName} - ${tierName || 'Standard'}`,
      special_requests: [dietaryNotes, specialRequests].filter(Boolean).join('\n') || null,
      status: 'pending',
    };

    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from('reservations').insert(reservation);
      if (error) console.error('Festival reservation DB error:', error);
    } else {
      console.log('[DEV] Festival reservation (no DB):', reservation);
    }

    // Email notification
    if (process.env.RESEND_API_KEY && process.env.ALERT_TO) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || 'noreply@grandpavilionny.com',
          to: process.env.ALERT_TO,
          subject: `New Festival Reservation — ${festivalName} — ${contactName} (${guestCount} guests)`,
          text: `Festival: ${festivalName}\nDate: ${preferredDate}\nGuests: ${guestCount}\nName: ${contactName}\nEmail: ${contactEmail}\nPhone: ${contactPhone || 'N/A'}\nTier: ${tierName || 'N/A'}`,
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Festival reservation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
