export interface SoundGenerationRequest {
  text: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  generation_config?: {
    chunk_length_schedule: number[];
  };
}

export interface ElevenLabsResponse {
  audio: ArrayBuffer;
  error?: string;
}

export interface SoundConfig {
  text: string;
  model?: string;
  voice?: string;
  style?: number;
  stability?: number;
  similarity?: number;
  speakerBoost?: boolean;
}
