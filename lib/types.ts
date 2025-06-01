export interface TranslationMessage {
  id: string;
  text: string;
  translation: string;
  cultural?: string;
  fromLang: string;
  toLang: string;
  timestamp: number;
}

export interface TranslationRequest {
  text: string;
  fromLang: string;
  toLang: string;
}

export interface TranslationResponse {
  translation?: string;
  error?: string;
}

export interface SharedMessage extends TranslationMessage {
  shareId: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  emailVerified: boolean;
}
