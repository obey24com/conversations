export interface SoundGenerationRequest {
  text: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  duration_seconds?: number;
}

export interface ElevenLabsResponse {
  audio: ArrayBuffer;
  error?: string;
}
