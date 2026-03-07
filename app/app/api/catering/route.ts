import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      siteId,
      contactName,
      contactEmail,
      contactPhone,
      companyName,
      location,
      eventType,
      eventDate,
      guestCount,
      budgetRange,
      cuisinePreferences,
      additionalNotes,
    } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!contactName?.trim()) missingFields.push('contactName');
    if (!contactEmail?.includes('@')) missingFields.push('contactEmail');
    if (!eventType) missingFields.push('eventType');
    if (!guestCount || parseInt(guestCount) < 1) missingFields.push('guestCount');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'validation_failed', fields: missingFields },
        { status: 400 }
      );
    }

    const inquiry = {
      site_id: siteId || process.env.NEXT_PUBLIC_DEFAULT_SITE || 'grand-pavilion',
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone || null,
      company_name: companyName || null,
      location: location || null,
      event_type: eventType,
      event_date: eventDate || null,
      guest_count: parseInt(guestCount),
      budget_range: budgetRange || null,
      cuisine_preferences: cuisinePreferences || null,
      additional_notes: additionalNotes || null,
      status: 'new',
    };

    // Insert into DB if configured
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from('catering_inquiries').insert(inquiry);
      if (error) console.error('Catering inquiry DB error:', error);
    } else {
      console.log('[DEV] Catering inquiry (no DB):', inquiry);
    }

    // Send email notification (if Resend configured)
    if (process.env.RESEND_API_KEY && process.env.ALERT_TO) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || 'noreply@grandpavilionny.com',
          to: process.env.ALERT_TO,
          subject: `New Catering Inquiry — ${contactName} (${guestCount} guests)`,
          text: `
New catering inquiry received:

Name: ${contactName}
Email: ${contactEmail}
Phone: ${contactPhone || 'N/A'}
Company: ${companyName || 'N/A'}
Event Type: ${eventType}
Event Date: ${eventDate || 'TBD'}
Guest Count: ${guestCount}
Location: ${location || 'TBD'}
Budget: ${budgetRange || 'N/A'}
Cuisine Preferences: ${cuisinePreferences || 'N/A'}
Notes: ${additionalNotes || 'None'}
          `.trim(),
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Catering API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
