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

  try {
    const isPetFrom = fromLang === 'cat' || fromLang === 'dog';
    const isPetTo = toLang === 'cat' || toLang === 'dog';

    // Common instructions for all scenarios:
    // - Keep the words "TRANSLATION:" and "CONTEXT:" in English exactly as they are.
    // - The translation itself should be in the target language (toLang).
    // - The CONTEXT section is optional. If needed, it should be in the target language (toLang).
    // - Do not translate the words "TRANSLATION:" and "CONTEXT:" into another language.

    let systemPrompt = '';

    if (isPetFrom && !isPetTo) {
      // From Pet Language to Human Language
      systemPrompt = `You are a translator that converts ${fromLang} animal language into ${toLang}. 
Follow these rules:
1. Understand the ${fromLang} sounds or body language and interpret their meaning accurately.
2. Present the final output with two sections labeled exactly as:
   TRANSLATION: [Your interpretation in ${toLang}]
   CONTEXT: [Additional explanation in ${toLang}, if culturally needed]
3. If no context is needed, omit the CONTEXT section entirely.
4. Do not translate the words "TRANSLATION:" or "CONTEXT:". Keep these headings in English.
5. Only the text after "TRANSLATION:" or "CONTEXT:" should be in ${toLang}.`;

    } else if (isPetTo && !isPetFrom) {
      // From Human Language to Pet Language
      systemPrompt = `You are a translator converting human language (${fromLang}) into ${toLang} animal sounds.
Follow these rules:
1. Translate the meaning of the provided text into ${toLang} animal sounds or gestures.
2. Format your response as:
   TRANSLATION: [${toLang} animal sounds/expressions]
   CONTEXT: [Optional, in ${toLang}, if there's a cultural or contextual note to explain. If not needed, omit.]
3. Do not translate the words "TRANSLATION:" or "CONTEXT:" themselves. They must remain in English.
4. Only the text after "TRANSLATION:" or "CONTEXT:" should be in ${toLang}.`;

    } else if (isPetFrom && isPetTo) {
      // Pet to Pet Translation
      systemPrompt = `You are an expert translator between ${fromLang} and ${toLang} animal languages.
Follow these rules:
1. Interpret the ${fromLang} sounds/expressions.
2. Translate them into ${toLang} sounds that convey the same meaning.
3. Format:
   TRANSLATION: [${toLang} version]
   CONTEXT: [Optional, in ${toLang}, only if needed]
4. Do not translate "TRANSLATION:" or "CONTEXT:" headings, keep them in English.
5. Only the text after these headings is in ${toLang}.`;

    } else {
      // Human to Human Translation with Cultural Nuance
      systemPrompt = `You are a professional translator from ${fromLang} to ${toLang}.
Follow these rules:
1. Translate the message naturally into ${toLang} as if it were originally written in ${toLang}.
2. Include a TRANSLATION section in ${toLang}.
3. Include a CONTEXT section in ${toLang} only if cultural explanation is needed. If not needed, omit the CONTEXT section.
4. Keep the headings "TRANSLATION:" and "CONTEXT:" in English, do not translate these headings.
5. Only the text after "TRANSLATION:" or "CONTEXT:" should be in ${toLang}.`;

    console.log('Starting translation request:', { 
      fromLang, 
      toLang, 
      textLength: text.length,
      systemPromptLength: systemPrompt.length 
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text.trim() }
      ],
      temperature: 0.3, // Lower temperature for more predictable output
      max_tokens: 1000,
    }).catch(error => {
      console.error('OpenAI API error:', {
        error: error.message,
        type: error.type,
        code: error.code,
        param: error.param
      });
      throw error;
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      console.error('Empty response from OpenAI');
      throw new Error('No translation generated from OpenAI');
    }

    console.log('Received OpenAI response:', { 
      responseLength: response.length,
      hasTranslationMarker: response.includes('TRANSLATION:')
      // CONTEXT is optional, so no strict check for that.
    });

    // If TRANSLATION is missing, prepend it.
    if (!response.includes('TRANSLATION:')) {
      console.log('Adding missing TRANSLATION marker to response');
      return `TRANSLATION: ${response}`;
    }

    return response;
  } catch (error: any) {
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
