import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }

  const db = createServiceClient()

  // Upsert: if already subscribed, re-subscribe
  const { data, error } = await db
    .from('email_subscribers')
    .upsert(
      { email: email.trim().toLowerCase(), name: name?.trim() || null, subscribed: true },
      { onConflict: 'email' }
    )
    .select('unsubscribe_token')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ success: true }) // already subscribed
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send welcome email via Resend
  if (resend && process.env.RESEND_FROM_EMAIL) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fortlauderdale-bahai.org'
    const unsubscribeUrl = `${appUrl}/unsubscribe?token=${data.unsubscribe_token}`

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email.trim(),
      subject: "Welcome to the Bahá'í Community of Fort Lauderdale newsletter",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a2744;">
          <div style="background: #1a2744; padding: 32px; text-align: center;">
            <p style="color: #c8942a; font-size: 28px; margin: 0;">✦</p>
            <h1 style="color: white; font-size: 22px; margin: 12px 0 4px;">Bahá'í Community</h1>
            <p style="color: #c8942a; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">Fort Lauderdale, Florida</p>
          </div>
          <div style="padding: 32px; background: #faf8f4;">
            <h2 style="color: #1a2744;">Welcome${name ? `, ${name}` : ''}!</h2>
            <p>Thank you for subscribing to our community newsletter. You'll receive updates on upcoming events, community news, and more.</p>
            <p style="font-style: italic; color: #2a7c7a; border-left: 3px solid #c8942a; padding-left: 16px; margin: 24px 0;">
              "So powerful is the light of unity that it can illuminate the whole earth."<br>
              <small>— Bahá'u'lláh</small>
            </p>
            <p style="margin-top: 32px; font-size: 12px; color: #888;">
              You can <a href="${unsubscribeUrl}" style="color: #2a7c7a;">unsubscribe at any time</a>.
            </p>
          </div>
        </div>
      `,
    })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
