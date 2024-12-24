async function testSpeechToText() {
  console.group('Speech-to-Text Diagnostic Tests');

  // 1. Test browser capabilities
  console.log('\n1. Testing Browser Capabilities:');
  console.log('MediaRecorder support:', 'MediaRecorder' in window);
  console.log('getUserMedia support:', !!(navigator.mediaDevices?.getUserMedia));
  console.log('FormData support:', 'FormData' in window);
  console.log('Blob support:', 'Blob' in window);

  // 2. Test microphone access
  try {
    console.log('\n2. Testing Microphone Access:');
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        sampleRate: 44100,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true
      }
    });
    console.log('✅ Microphone access granted');
    console.log('Active audio tracks:', stream.getAudioTracks().length);
    console.log('Track settings:', stream.getAudioTracks()[0].getSettings());
    
    // Clean up
    stream.getTracks().forEach(track => track.stop());
  } catch (error) {
    console.error('❌ Microphone access failed:', error);
    return;
  }

  // 3. Test MediaRecorder
  try {
    console.log('\n3. Testing MediaRecorder:');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    console.log('✅ MediaRecorder initialized');
    console.log('Supported MIME types:');
    ['audio/webm
