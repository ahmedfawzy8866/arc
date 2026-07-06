import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { COLLECTIONS, BrokerListing } from "../models/schema";

/**
 * SIERRA BLU WHATSAPP INTELLIGENCE SERVICE
 * Uses Gemini 1.5 Flash for high-speed, low-cost architectural parsing of real estate messages.
 */

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

/**
 * SIERRA BLU WHATSAPP INTELLIGENCE SERVICE
 * Core orchestrator for Stage 1 & 2 (Acquisition/Parsing).
 */
export class WhatsAppParserService {
  /**
   * Processes a raw message (text or image) and persists it.
   */
  static async processIncomingMessage(content: string, sender: string, groupName: string, media?: { data: string, mimeType: string }) {
    console.log(`📡 Ingesting strategic intel from ${groupName}... (Multimodal: ${!!media})`);
    
    // Choose model based on content type
    const modelName = media ? "gemini-1.5-pro" : "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemInstruction = `You are the Sierra Blu Strategic Intelligence Parser. 
    Analyze the provided real estate listing (Arabic/English/Fringlish).
    Return ONLY a raw JSON object with these fields:
    - compound: (string) Normalized name of the project
    - price: (number) Total price in EGP
    - bedrooms: (number) Number of rooms
    - area: (number) Area in sqm
    - phoneNumber: (string) Extracted phone
    - type: (string) 'apartment', 'villa', 'land', etc.
    - finishing: (string) 'core_and_shell', 'semi_finished', 'fully_finished', 'ultra_super_lux'
    - urgencyScore: (number) 0-100 indicating seller desperation/urgency
    - sentiment: (string) 'positive', 'neutral', 'aggressive', 'desperate'
    - matchingKeywords: (array) Strategic tags (e.g., 'waterfront', 'over-market', 'distressed-sale')
    
    Rules:
    1. If an image is provided, OCR the text accurately.
    2. Respond ONLY with the JSON object. No markdown.`;

    try {
      let result;
      if (media) {
        result = await model.generateContent([
          systemInstruction,
          { inlineData: media },
          content
        ]);
      } else {
        result = await model.generateContent([systemInstruction, content]);
      }

      const response = await result.response;
      const text = response.text();
      
      // Clean and Parse JSON
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const extractedData = JSON.parse(jsonStr);

      const listing: Omit<BrokerListing, 'id'> = {
        rawMessage: content,
        status: 'parsed',
        sourceGroup: groupName,
        sourcePlatform: 'whatsapp',
        senderInfo: sender,
        isVerified: false,
        createdAt: serverTimestamp() as any,
        extractedData: extractedData,
        coordinates: this.simulateGeocoding(extractedData.compound)
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.brokerListings), listing);
      console.log(`✅ AI Orchestration Complete: Listing ${docRef.id} persisted.`);
      
      return { id: docRef.id, data: extractedData };
    } catch (error) {
      console.error("❌ Neural Parsing Engine Failure:", error);
      
      // Fallback: Save as 'raw' for human review
      await addDoc(collection(db, COLLECTIONS.brokerListings), {
        rawMessage: content,
        status: 'raw',
        sourceGroup: groupName,
        sourcePlatform: 'whatsapp',
        senderInfo: sender,
        isVerified: false,
        createdAt: serverTimestamp()
      });
      
      throw error;
    }
  }

  /**
   * Simulates geospatial mapping based on compound name for the 'Live Map' feature.
   */
  private static simulateGeocoding(compound: string | null) {
    const coordsMap: Record<string, {lat: number, lng: number}> = {
      'Mivida': { lat: 30.015, lng: 31.490 },
      'Mountain View': { lat: 30.035, lng: 31.470 },
      'Hyde Park': { lat: 30.005, lng: 31.480 },
      'CFC': { lat: 30.010, lng: 31.510 },
      'Palm Hills': { lat: 30.025, lng: 31.460 }
    };
    
    if (compound && coordsMap[compound]) return coordsMap[compound];
    
    // Default New Cairo center with slight jittering for visualization
    return { 
      lat: 30.044 + (Math.random() - 0.5) * 0.1, 
      lng: 31.235 + (Math.random() - 0.5) * 0.1 
    };
  }
}
