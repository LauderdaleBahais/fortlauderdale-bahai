import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const db = createServiceClient()
  await db.from('contact_messages').insert({
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  })

  // Forward to admin via email
  if (resend && process.env.CONTACT_RECIPIENT_EMAIL && process.env.RESEND_FROM_EMAIL) {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      replyTo: email.trim(),
      subject: `[Contact Form] ${subject.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2744;">
          <h2 style="border-bottom: 2px solid #c8942a; padding-bottom: 8px;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <p style="background: #f5f2ed; padding: 16px; border-radius: 4px;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ success: true })
}
