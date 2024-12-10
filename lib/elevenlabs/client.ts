import { ELEVENLABS_CONFIG } from './config';
import type { SoundGenerationRequest, ElevenLabsResponse, SoundConfig } from './types';

export async function generateSound(
  config: SoundConfig,
  apiKey: string
): Promise<ElevenLabsResponse> {
  try {
    const request: SoundGenerationRequest = {
      text: config.text,
      model_id: config.model || ELEVENLABS_CONFIG.DEFAULT_MODEL,
      voice_settings: {
        stability: config.stability || 0.7,
        similarity_boost: config.similarity || 0.7,
        style: config.style || 0.5,
        use_speaker_boost: config.speakerBoost ?? true,
      },
      generation_config: {
        chunk_length_schedule: [120, 160, 200, 240]
      }
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
