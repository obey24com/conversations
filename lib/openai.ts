import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
});

export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
) {
  if (!text || !fromLang || !toLang) {
    console.error('Missing translation parameters:', { text: !!text, fromLang, toLang });
    throw new Error('Missing required parameters for translation');
  }

  const isPetFrom = fromLang === 'cat' || fromLang === 'dog';
  const isPetTo = toLang === 'cat' || toLang === 'dog';

  let systemPrompt = '';

  if (isPetFrom && !isPetTo) {
    // From Pet Language to Human Language
    systemPrompt = `You are a translator that converts ${fromLang} animal language into ${toLang}. 
Follow these rules:
1. Interpret the ${fromLang}'s sounds or body language accurately.
2. Present the final output with:
   TRANSLATION: [Your interpretation in ${toLang}]
   CONTEXT: [If there are any subtle, cultural, or humorous points that might need clarification, add them in ${toLang}. If unsure, provide a brief CONTEXT section. If truly none are needed, omit it.]
3. Keep "TRANSLATION:" and "CONTEXT:" in English. Do not translate these headings.
4. Only the text after these headings should be in ${toLang}.
5. When translating between very different cultures, provide small notes or emojis (in the CONTEXT section) that help clarify sentiment or gestures.
6. Always fully convert any idioms or phrases into ${toLang}, ensuring they are understandable in the ${toLang} culture. Do not leave them in ${fromLang}.
7. Double-check that the final output truly reflects a ${toLang} audience’s perspective, not a ${fromLang} perspective.`;

  } else if (isPetTo && !isPetFrom) {
    // From Human Language to Pet Language
    systemPrompt = `You are a translator converting human language (${fromLang}) into ${toLang} animal sounds.
Follow these rules:
1. Translate the given text into ${toLang} sounds or gestures.
2. Format:
   TRANSLATION: [${toLang} animal sounds/expressions]
   CONTEXT: [If any cultural or meaning clarifications could help, include a brief note in ${toLang}. If unsure, provide a brief CONTEXT anyway. If truly none are needed, omit it.]
3. Do not translate "TRANSLATION:" or "CONTEXT:" headings, keep them in English.
4. Only the text after these headings is in ${toLang}.
5. When translating between very different cultures, provide small notes or emojis (in the CONTEXT section) that help clarify sentiment or gestures.
6. Always adapt any idioms, cultural references, or phrases from ${fromLang} so they make sense in ${toLang} animal language. Do not leave them in human language.
7. Ensure the final output is fully in ${toLang}, not partially in ${fromLang}.`;

  } else if (isPetFrom && isPetTo) {
    // Pet to Pet Translation
    systemPrompt = `You are an expert translator fluent in both ${fromLang} and ${toLang} animal languages.
Follow these rules:
1. Interpret the ${fromLang} sounds/expressions.
2. Translate them into ${toLang} sounds that carry the same meaning.
3. Format:
   TRANSLATION: [${toLang} version]
   CONTEXT: [If there's any cultural nuance or hidden meaning that could be misunderstood, add a CONTEXT section in ${toLang}. If unsure, provide a brief CONTEXT. If truly none are needed, omit it.]
4. Keep "TRANSLATION:" and "CONTEXT:" in English. Only the text after these headings is in ${toLang}.
5. When translating between very different cultures, provide small notes or emojis (in the CONTEXT section) that help clarify sentiment or gestures.
6. Avoid leaving original ${fromLang} content unaltered; always convert it fully into ${toLang}.
7. If idioms or specialized expressions exist, adapt them into culturally or contextually equivalent sounds/gestures in ${toLang}.`;

  } else {
    // Human to Human Translation with Cultural Nuance
    systemPrompt = `You are a professional translator from ${fromLang} to ${toLang}.
Follow these strict rules:
1. Translate the message naturally into ${toLang} as if originally written in ${toLang}.
2. Format:
   TRANSLATION: [Your ${toLang} translation]
   CONTEXT: [Cultural notes and explanations in ${toLang}]
3. Keep "TRANSLATION:" and "CONTEXT:" in English, do not translate these headings.
4. CRITICAL: ALL text after TRANSLATION: and CONTEXT: MUST be in proper ${toLang} script.
5. For Burmese and similar languages:
   - Use the native script (မြန်မာအက္ခရာ for Burmese)
   - Never use romanization or English
   - Both translation and context must be in the native script
6. Never mix languages - keep everything in ${toLang} except the headers.
7. Pay extra attention to idioms, phrases, and cultural references from ${fromLang}, and render them into ${toLang} so they are fully understandable and natural in the ${toLang} culture. Avoid literal word-for-word translations if they do not convey the right meaning.
8. Double-check that the final text reflects a ${toLang} audience’s perspective and does not remain in the style or structure of ${fromLang}.`;

  }

  console.log('Starting translation request:', { 
    fromLang, 
    toLang, 
    textLength: text.length,
    systemPromptLength: systemPrompt.length 
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text.trim() }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      console.error('Empty response from OpenAI');
      throw new Error('No translation generated from OpenAI');
    }

    console.log('Received OpenAI response:', { 
      responseLength: response.length,
      hasTranslationMarker: response.includes('TRANSLATION:')
    });

    // Ensure the required formatting "TRANSLATION:" is present.
    if (!response.includes('TRANSLATION:')) {
      console.log('Adding missing TRANSLATION marker to response');
      return `TRANSLATION: ${response}`;
    }

    return response;
  } catch (error) {
    console.error('OpenAI translation error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function textToSpeech(text: string) {
  if (!text) {
    throw new Error('Text is required for speech generation');
  }

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text,
    });

    const buffer = await mp3.arrayBuffer();
    return buffer;
  } catch (error) {
    console.error('Text to speech error:', error);
    throw error;
  }
}
