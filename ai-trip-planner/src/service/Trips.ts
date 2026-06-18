import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { TripDoc } from '@/types/itinerary';

/**
 * Fetches a single saved trip by its Firestore document id.
 * Returns null if no trip exists for that id.
 */
export async function getTripById(id: string): Promise<TripDoc | null> {
  const snap = await getDoc(doc(db, 'AITrips', id));
  return snap.exists() ? (snap.data() as TripDoc) : null;
}
