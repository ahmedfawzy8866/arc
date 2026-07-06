import { PropertyType } from '../models/schema';

const OPENCLAW_BASE = process.env.NEXT_PUBLIC_OPENCLAW_BASE_URL || 'http://127.0.0.1:18789/v1';
const OPENCLAW_TOKEN = process.env.NEXT_PUBLIC_OPENCLAW_TOKEN || '';

export interface ParsedProperty {
  compound?: string;
  propertyType?: PropertyType;
  bedrooms?: number;
  price?: number;
  area?: number;
  finishingType?: string;
  phoneNumber?: string;
  isListing: boolean;
}

export const WhatsAppParserService = {
  async parseMessage(rawText: string): Promise<ParsedProperty | null> {
    if (!OPENCLAW_TOKEN) {
      console.warn('[WhatsAppParser] Missing OPENCLAW_TOKEN');
      return null;
    }

    const systemPrompt = `You are an expert real estate data extractor for Sierra Blu Realty in Egypt.
Your task is to analyze a raw message from a WhatsApp/Telegram group and extract property details.
If the message is NOT a property listing (e.g., greetings, general chat, or a specific request for a unit), set "isListing" to false.
Otherwise, set "isListing" to true and extract the following:
- "compound": The name of the project/compound (e.g., Mivida, Mountain View, Hyde Park, etc.)
- "propertyType": One of "apartment", "villa", "townhouse", "duplex", "penthouse", "studio", "chalet", "commercial", "land".
- "bedrooms": Number of bedrooms.
- "price": Total price in EGP (numeric only).
- "area": Size in sqm (numeric only).
- "finishingType": Describe the finish (e.g., Core & Shell, Fully Finished).
- "phoneNumber": Any phone number mentioned for the owner/broker.

Output ONLY a valid JSON object.`;

    try {
      const response = await fetch(`${OPENCLAW_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENCLAW_TOKEN}`,
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash-lite',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: rawText },
          ],
          temperature: 0.1,
          max_tokens: 256,
        }),
      });

      if (!response.ok) {
          console.error('[WhatsAppParser] API response error:', response.status);
          return null;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '{}';
      
      // Basic JSON cleanup
      const cleanJson = content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('[WhatsAppParser] Extraction error:', error);
      return null;
    }
  }
};
