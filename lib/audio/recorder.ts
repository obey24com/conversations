"use client";

export interface AudioRecorder {
  start: () => Promise<void>;
  stop: () => Promise<Blob>;
  isRecording: boolean;
}

export function createAudioRecorder(): AudioRecorder {
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let stream: MediaStream | null = null;

  return {
    isRecording: false,

    async start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 44100,
            sampleSize: 16,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.start();
        this.isRecording = true;
      } catch (error) {
        console.error("Error starting recording:", error);
        throw error;
      }
    },

    async stop(): Promise<Blob> {
      return new Promise((resolve, reject) => {
        if (!mediaRecorder) {
          reject(new Error("No active recording"));
          return;
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
          stream?.getTracks().forEach(track => track.stop());
          this.isRecording = false;
          resolve(audioBlob);
        };

        mediaRecorder.stop();
      });
    }
  };
}
