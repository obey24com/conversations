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
5. When translating between very different cultures, provide small notes or emojis (in the CONTEXT section) that help clarify sentiment or gestures.`;

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
5. When translating between very different cultures, provide small notes or emojis (in the CONTEXT section) that help clarify sentiment or gestures.`;

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
5. When translating between very different cultures, provide small notes or emojis (in the CONTEXT section) that help clarify sentiment or gestures.`;

  } else {
    // Human to Human Translation with Cultural Nuance
    systemPrompt = `You are a professional translator from ${fromLang} to ${toLang}.
Follow these rules:
1. Translate the message naturally into ${toLang} as if originally written in ${toLang}.
2. Format:
   TRANSLATION: [Your ${toLang} translation]
   CONTEXT: [If cultural nuances, idioms, or subtle points might cause misunderstanding, provide a brief explanation in ${toLang}. If you're unsure whether context is needed, provide a brief CONTEXT anyway. If truly none are needed, omit it.]
3. Keep "TRANSLATION:" and "CONTEXT:" in English, do not translate these headings.
4. Only the text after "TRANSLATION:" or "CONTEXT:" should be in ${toLang}.

Example:
If the ${fromLang} text contains an idiom, like "Il pleut des cordes" (French for "It's raining heavily"), you would do:
TRANSLATION: [A ${toLang} equivalent meaning "It's raining heavily."]
CONTEXT: [In ${toLang}, explain that this is a French idiom that literally means "It's raining ropes" but signifies heavy rain.]
If the text is straightforward, like "It is raining a lot today," you may omit CONTEXT if truly no clarification is needed.
5. When translating between very different cultures, provide small notes or emojis (in the CONTEXT section) that help clarify sentiment or gestures.`;

  }

  console.log('Starting translation request:', { 
    fromLang, 
    toLang, 
    textLength: text.length,
    systemPromptLength: systemPrompt.length 
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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
