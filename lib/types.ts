export interface Message {
  id: string;
  text: string;
  translation: string;
  context?: string;
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
  translation: string;
  context?: string;
  error?: string;
}
