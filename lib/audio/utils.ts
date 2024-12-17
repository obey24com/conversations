/**
 * Get the duration of an audio blob in seconds
 */
export async function getAudioDuration(audioBlob: Blob): Promise<number> {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.duration;
}

/**
 * Create a File object from a Blob for OpenAI API compatibility
 */
export function createAudioFile(blob: Blob): File {
  return new File([blob], "audio.mp3", {
    type: "audio/mp3",
    lastModified: Date.now(),
  });
}
