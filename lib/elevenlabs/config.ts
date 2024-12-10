export const ELEVENLABS_CONFIG = {
  API_URL: 'https://api.elevenlabs.io/v1',
  DEFAULT_MODEL: 'eleven_monolingual_v1',
  PET_SOUNDS: {
    cat: {
      text: 'meow',
      style: 0.7,
      stability: 0.7,
      similarity: 0.7,
    },
    dog: {
      text: 'woof',
      style: 0.5,
      stability: 0.8,
      similarity: 0.6,
    }
  }
} as const;
