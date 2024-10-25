export interface TranslationMessage {
  id: string;
  text: string;
  translation: string;
  context?: string | null;
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