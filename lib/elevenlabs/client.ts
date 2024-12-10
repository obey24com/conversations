import { ELEVENLABS_CONFIG } from './config';
import type { SoundGenerationRequest, ElevenLabsResponse } from './types';

export async function generateSound(
  text: string,
  apiKey: string
): Promise<ElevenLabsResponse> {
  try {
    const request: SoundGenerationRequest = {
      text,
      model_id: ELEVENLABS_CONFIG.DEFAULT_MODEL,
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.7,
        style: 0.5,
        use_speaker_boost: true,
      },
      duration_seconds: ELEVENLABS_CONFIG.DURATION_SECONDS
    };

    const response = await fetch(
      `${ELEVENLABS_CONFIG.API_URL}/sound-generation`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify(request)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    if (!audioBuffer || audioBuffer.byteLength === 0) {
      throw new Error('Received empty audio buffer from ElevenLabs API');
    }

    return { audio: audioBuffer };
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    return {
      audio: new ArrayBuffer(0),
      error: error instanceof Error ? error.message : 'Failed to generate sound'
    };
  }
}
