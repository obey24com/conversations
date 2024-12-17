export async function handleSpeechToText( 
  audioBlob: Blob,
  fromLang: string,
  toLang: string,
  signal?: AbortSignal
): Promise<string | undefined> {
  try {
    if (!audioBlob || !(audioBlob instanceof Blob)) {
      throw new Error('Invalid audio data');
    }

    const formData = new FormData();
    formData.append("audio", audioBlob);
    formData.append("language", fromLang);

    const response = await fetch("/api/speech-to-text", {
      method: "POST",
      body: formData,
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Speech to text failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    
    if (!data.text) {
      throw new Error('No transcription received from server');
    }
    
    return data.text.trim();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('Speech to text request was cancelled');
        return undefined;
      }
      console.error("Speech to text error:", error.message);
    } else {
      console.error("Speech to text error:", error);
    }
    throw error;
  }
}
