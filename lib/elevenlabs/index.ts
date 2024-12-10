export * from './types';
export * from './config';
export * from './client';

import { ELEVENLABS_CONFIG } from './config';
import { generateSound } from './client';
import type { ElevenLabsResponse, PetType } from './types';

export async function generatePetSound(
  text: string,
  petType: PetType,
  apiKey: string
): Promise<ElevenLabsResponse> {
  // Always use the predefined prompt for the pet type
  const prompt = ELEVENLABS_CONFIG.PET_PROMPTS[petType];
  return generateSound(prompt, apiKey);
}
