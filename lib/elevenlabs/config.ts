export const ELEVENLABS_CONFIG = {
  API_URL: 'https://api.elevenlabs.io/v1',
  DEFAULT_MODEL: 'eleven_monolingual_v1',
  PET_PROMPTS: {
    cat: 'cat meow',
    dog: 'dog bark'
  },
  DURATION_SECONDS: 2.0,
  VOICE_SETTINGS: {
    stability: 0.7,
    similarity_boost: 0.7,
    style: 0.5,
    use_speaker_boost: true
  }
} as const;
