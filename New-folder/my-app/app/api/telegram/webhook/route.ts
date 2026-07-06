import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || !message.text) return NextResponse.json({ ok: true });

    const chatId = message.chat.id;
    const text = message.text.toLowerCase();

    const token = process.env.TELEGRAM_BOT_TOKEN;

    const sendMessage = async (msg: string) => {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: msg,
          parse_mode: 'HTML'
        }),
      });
    };

    if (text === '/start') {
      await sendMessage(`
<b>Welcome to Sierra Blu Realty Bot</b>

Your Chat ID is: <code>${chatId}</code>
Please add this to your <code>.env.local</code> as <code>TELEGRAM_CHAT_ID</code> to enable operational notifications.

Commands:
/stats - View executive performance
/leads - View latest 5 leads
/listings - View market inventory
/ag [order] - Give orders to Antigravity Intelligence
      `);
    } else if (text === '/stats') {
      const q = query(collection(db, 'listings'), limit(100));
      const snap = await getDocs(q);
      const activeCount = snap.size;
      
      const leadsSnap = await getDocs(collection(db, 'leads'));
      const leadCount = leadsSnap.size;

      await sendMessage(`
<b>📊 Sierra Blu - Portfolio Stats</b>
<b>Total Inventory:</b> ${activeCount} units
<b>Total Leads:</b> ${leadCount} profiles
<b>Operational Status:</b> OPTIMUM
      `);
    } else if (text === '/leads') {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(5));
        const snap = await getDocs(q);
        let leadText = "<b>Latest 5 Leads:</b>\n\n";
        snap.forEach(doc => {
            const d = doc.data();
            leadText += `👤 ${d.name} (${d.phone})\n📅 ${d.createdAt?.toDate().toLocaleDateString()}\n---\n`;
        });
        await sendMessage(leadText);
    } else if (text === '/listings') {
        const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'), limit(5));
        const snap = await getDocs(q);
        let listingText = "<b>Latest 5 Listings:</b>\n\n";
        snap.forEach(doc => {
            const d = doc.data();
            listingText += `🏢 ${d.title} - EGP ${d.price}\n📍 ${d.location}\n---\n`;
        });
        await sendMessage(listingText);
    } else if (text.startsWith('/ag') || text.includes('antigravity')) {
        // Antigravity Intelligence Bridge
        const queryText = text.replace('/ag', '').trim();
        
        // Indicate typing
        await fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
        });

        const { processAgentCommand } = await import('@/lib/services/antigravity-agent');
        const response = await processAgentCommand(chatId, queryText || "Hello! I am Antigravity. How can I assist your operations today?");
        await sendMessage(response.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
