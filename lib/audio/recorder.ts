"use client";

export interface AudioRecorder {
  start: () => Promise<void>;
  stop: () => Promise<Blob>;
  isRecording: boolean;
  cleanup(): void;
}

export function createAudioRecorder(): AudioRecorder {
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let stream: MediaStream | null = null;
  let isRecordingState = false;

  return {
    get isRecording() {
      return isRecordingState;
    },

    set isRecording(value: boolean) {
      isRecordingState = value;
    },

    async start() {
      try {
        if (this.isRecording) {
          console.log('Recording already in progress');
          return;
        }

        // Clean up any existing streams first
        this.cleanup();

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
        isRecordingState = true;
      } catch (error) {
        this.isRecording = false;
        this.cleanup();
        console.error("Error starting recording:", error);
        throw error;
      }
    },

    async stop(): Promise<Blob> {
      return new Promise((resolve, reject) => {
        if (!mediaRecorder || !this.isRecording) {
          reject(new Error("No active recording"));
          return;
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
          isRecordingState = false;
          this.cleanup();
          resolve(audioBlob);
        };

        mediaRecorder.stop();
      });
    },

    cleanup() {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          stream?.removeTrack(track);
        });
        stream = null;
      }
      mediaRecorder = null;
      audioChunks = [];
      isRecordingState = false;
    }
  };
}