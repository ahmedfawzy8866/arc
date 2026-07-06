import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get('limit') || '12', 10);

    // Query available listings from Firestore
    const listingsRef = collection(db, 'listings');
    const q = query(
      listingsRef,
      where('status', '==', 'available'),
      limit(limitParam)
    );

    const snapshot = await getDocs(q);
    const listings = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled Property',
        price: data.price || 0,
        compound: data.compound || 'Unknown Location',
        beds: data.bedrooms || 0,
        baths: data.bathrooms || 0,
        area: data.area ? `${data.area} sqm` : 'N/A',
        image: data.featuredImage || data.images?.[0] || undefined,
        description: data.description || undefined,
        lat: data.coordinates?.lat,
        lng: data.coordinates?.lng,
      };
    });

    return NextResponse.json({ listings, count: listings.length });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings', listings: [] },
      { status: 500 }
    );
  }
}
