"use client";

import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

const AUDIO_CONSTRAINTS = {
  sampleRate: 44100,
  sampleSize: 16,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true
};

interface MicrophonePermissionState {
  status: 'prompt' | 'granted' | 'denied';
  error?: string;
}

export function useMicrophonePermission() {
  const [permissionState, setPermissionState] = useState<MicrophonePermissionState>({
    status: 'prompt'
  });

  // Check permission status on mount
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      // First check if the browser supports permissions API
      if (!navigator.permissions || !navigator.mediaDevices) {
        setPermissionState({ status: 'denied', error: 'Browser does not support required features' });
        return;
      }

      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      setPermissionState({ status: result.state as 'prompt' | 'granted' | 'denied' });

      // Listen for permission changes
      result.addEventListener('change', async () => {
        setPermissionState({ 
          status: result.state as 'prompt' | 'granted' | 'denied'
        });
      });

    } catch (error) {
      console.error('Error checking microphone permission:', error);
      setPermissionState({ 
        status: 'prompt',
        error: 'Could not determine microphone permission status'
      });
    }
  };

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          sampleSize: 16,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Store optimal audio constraints in localStorage
      localStorage.setItem(STORAGE_KEYS.MIC_SETTINGS, JSON.stringify({
        sampleRate: 44100,
        sampleSize: 16,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }));

      // Keep the stream active for future use
      setPermissionState({ status: 'granted' });
      
      // Stop the stream immediately since we only need it for permission
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      setPermissionState({ 
        status: 'denied',
        error: error instanceof Error ? error.message : 'Failed to access microphone'
      });
      return false;
    }
  };

  return {
    permissionState,
    requestPermission,
    checkPermissionStatus,
    AUDIO_CONSTRAINTS
  };
}
