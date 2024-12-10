export * from './types';
export * from './config';
export * from './client';

import { ELEVENLABS_CONFIG } from './config';
import { generateSound } from './client';
import type { ElevenLabsResponse } from './types';

export async function generatePetSound(
  text: string,
  petType: 'cat' | 'dog',
  apiKey: string
): Promise<ElevenLabsResponse> {
  const config = ELEVENLABS_CONFIG.PET_SOUNDS[petType];
  
  // Use provided text or fallback to default pet sound
  const soundText = text.toLowerCase().trim();
  const finalText = petType === 'cat' 
    ? (soundText.includes('meow') ? soundText : config.text)
    : (soundText.includes('woof') || soundText.includes('bark') ? soundText : config.text);

  return generateSound({
    text: finalText,
    style: config.style,
    stability: config.stability,
    similarity: config.similarity,
    speakerBoost: true
  }, apiKey);
}
