export async function getAudioDuration(audioBlob: Blob): Promise<number> {
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer.duration;
}
