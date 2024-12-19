export interface Message {
  id: string;
  text: string;
  translation: string;
  fromLang: string;
  toLang: string;
  context?: string;  // Cultural context or additional information
  timestamp: number;
}

export interface MessageBubbleProps {
  text: string;
  translation: string;
  fromLang: string;
  toLang: string;
  context?: string;  // Cultural context or additional information
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
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


export interface TranslationControlsProps {
  fromLang: string;
  toLang: string;
  inputText: string;
  isLoading: boolean;
  isRecording: boolean;
  isSwapping: boolean;
  isSwapActive: boolean;
  isSwapActiveFirst: boolean;
  swapMessage: string;
  onFromLangChange: (value: string) => void;
  onToLangChange: (value: string) => void;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onRecord: () => void;
  onSwap: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
