import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';
import { COLLECTIONS } from '@/lib/models/schema';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message, locale } = data;

    // 1. Add to Strategic Pipeline (Firestore)
    const stakeholderRef = await addDoc(collection(db, COLLECTIONS.stakeholders), {
      name,
      email,
      phone,
      message,
      status: 'new',
      stage: 'inbound',
      investmentPotential: 'warm',
      source: 'website',
      interest: 'General Inquiry',
      capitalAllocation: 'To be determined',
      locale,
      aiProfiling: {
        interests: ['General Inquiry'],
        topMatches: [],
        lastAnalyzedAt: serverTimestamp(),
      },
      automation: {
        followupReminderEnabled: true,
        interactionFrequency: 'medium',
      },
      createdAt: serverTimestamp()
    });

    // 2. Send Telegram Notification (Strategic Pipeline Update)
    const text = `
<b>🚀 New Investment Stakeholder - Sierra Blue Intelligence OS</b>
<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Phone:</b> ${phone}
<b>Interest:</b> General Inquiry
<b>Message:</b> ${message}
<b>Locale:</b> ${locale}
    `.trim();

    await sendTelegramMessage(text);

    return NextResponse.json({ success: true, id: stakeholderRef.id });
  } catch (error) {
    console.error("Stakeholder submission error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
