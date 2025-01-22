import { db } from './config';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import type { SharedMessage, TranslationMessage } from '../types';

const MESSAGES_COLLECTION = 'shared_messages';

export async function createSharedMessage(message: TranslationMessage): Promise<string> {
  try {
    if (!db) {
      throw new Error('Firebase not initialized - check your environment variables');
    }
    
    const shareId = nanoid(10); // Generate a short, unique ID
    
    const sharedMessage: SharedMessage = {
      ...message,
      shareId,
    };

    // Create the document with the generated ID
    await setDoc(doc(db, MESSAGES_COLLECTION, shareId), sharedMessage);
    
    // Track share event with your existing GA setup
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share_message', {
        message_id: message.id,
        share_id: shareId,
        from_lang: message.fromLang,
        to_lang: message.toLang,
      });
    }

    return shareId;
  } catch (error) {
    console.error('Error creating shared message:', error);
    throw new Error('Failed to create shared message');
  }
}

export async function getSharedMessage(shareId: string): Promise<SharedMessage | null> {
  try {
    if (!db) {
      console.warn('Firebase not initialized, sharing functionality unavailable');
      return null;
    }

    const docRef = doc(db, MESSAGES_COLLECTION, shareId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Track view event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'view_shared_message', {
          share_id: shareId,
        });
      }

      return docSnap.data() as SharedMessage;
    }

    return null;
  } catch (error) {
    console.error('Error fetching shared message:', error);
    return null;
  }
}
