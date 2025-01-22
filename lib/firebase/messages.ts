import { db } from './config';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import type { SharedMessage, TranslationMessage } from '../types';
import { toPng } from 'html-to-image';

const MESSAGES_COLLECTION = 'shared_messages';

export async function createSharedMessage(
  message: TranslationMessage,
  previewElement?: HTMLElement | null
): Promise<string> {
  try {
    if (!db) {
      throw new Error('Sharing functionality is not available');
    }
    
    const shareId = nanoid(10); // Generate a short, unique ID
    let previewImage: string | undefined;

    // Generate preview image if element is provided
    if (previewElement instanceof HTMLElement) {
      try {
        previewImage = await toPng(previewElement, {
          quality: 0.95,
          backgroundColor: '#ffffff',
          style: {
            transform: 'scale(1)',
            transformOrigin: 'top left'
          }
        });
      } catch (imageError) {
        console.error('Failed to generate preview image:', imageError);
      }
    }

    const sharedMessage: SharedMessage = {
      ...message,
      shareId,
      previewImage
    };

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
    throw error;
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
