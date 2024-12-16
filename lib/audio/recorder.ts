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
  let isActive = false;

  return {
    isRecording: isActive,

    async start() {
      try {
        if (isActive) {
          console.log('Recording already in progress');
          return;
        }

        // Request permissions explicitly
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'denied') {
          throw new Error('Microphone permission denied');
        }

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
        isActive = true;
      } catch (error) {
        isActive = false;
        stream?.getTracks().forEach(track => track.stop());
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
          isActive = false;
          resolve(audioBlob);
        };

        mediaRecorder.stop();
      });
    }
  };
}
