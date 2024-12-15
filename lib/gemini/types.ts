export interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export interface TranslationResult {
  translation: string;
  context?: string;
  error?: string;
}

export interface GeminiTranslationOptions {
  fromLang: string;
  toLang: string;
  text: string;
  includeContext?: boolean;
}
