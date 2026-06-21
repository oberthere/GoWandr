import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
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

/**
 * Fetches all trips saved by a given user, newest first.
 */
export async function getUserTrips(email: string): Promise<TripDoc[]> {
  const q = query(collection(db, 'AITrips'), where('userEmail', '==', email));
  const snap = await getDocs(q);
  const trips = snap.docs.map((d) => d.data() as TripDoc);
  // id is a timestamp string, so sorting desc gives newest first.
  return trips.sort((a, b) => Number(b.id) - Number(a.id));
}
