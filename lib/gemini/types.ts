export interface GeminiRequest {
  contents: {
    role: string;
    parts: {
      text: string;
    }[];
  };
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason?: string;
    safetyRatings?: {
      category: string;
      probability: string;
    }[];
  }[];
}

export interface TranslationResult {
  translation: string;
  context?: string;
  error?: string;
}

export interface GeminiTranslationOptions {
  text: string;
  fromLang: string;
  toLang: string;
}
