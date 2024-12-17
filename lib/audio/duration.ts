"use client";

export async function getAudioDuration(audioBlob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const audioContext = new AudioContext();
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          resolve(audioBuffer.duration);
        } catch (error) {
          reject(error);
        } finally {
          audioContext.close();
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(audioBlob);
    } catch (error) {
      reject(error);
    }
  });
}
