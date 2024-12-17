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
export async function createAudioFile(blob: Blob): Promise<File> {
  // Convert blob to array buffer
  const buffer = await blob.arrayBuffer();
  
  // Create a new File object with the required properties
  const file = new File([buffer], "audio.mp3", {
    type: blob.type || "audio/mp3",
    lastModified: Date.now()
  });

  return file;
}
