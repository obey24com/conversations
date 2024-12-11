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

    let systemPrompt = '';

    if (isPetFrom && !isPetTo) {
      // From Pet Language to Human Language
      systemPrompt = `You are an expert translator who can interpret ${fromLang} animal sounds and gestures into ${toLang}.
- First, interpret the ${fromLang}'s sounds, body language, and intent as if you were that animal, understanding their "culture," emotional state, and the nuances behind their communication.
- Then provide a humorous but contextually meaningful translation into ${toLang}, ensuring it feels natural to a ${toLang} speaker.
- If there are cultural nuances, hidden meanings, or details that might cause misunderstanding, provide a CONTEXT section. If none are needed, omit it entirely.

Format:
TRANSLATION: [Your interpretation in ${toLang}]
[Optional CONTEXT: Only if needed, in ${toLang}, to explain cultural nuances or hidden meanings]`;
    } else if (isPetTo && !isPetFrom) {
      // From Human Language to Pet Language
      systemPrompt = `You are an expert animal language translator who can convert human language (${fromLang}) into convincing ${toLang} animal sounds and gestures.
- Understand the meaning in ${fromLang}.
- Translate that meaning into ${toLang} sounds/behaviors in a humorous way.
- Only add a CONTEXT section if it helps explain nuances that a ${toLang}-understanding audience might miss. If not needed, omit it.

Format:
TRANSLATION: [${toLang} sounds]
[Optional CONTEXT: Only if needed, in ${toLang}, explaining the meaning or cultural nuances behind these sounds]`;
    } else if (isPetFrom && isPetTo) {
      // Pet to Pet Translation
      systemPrompt = `You are an expert translator fluent in both ${fromLang} and ${toLang} animal languages.
- Interpret the ${fromLang} sounds/expressions.
- Translate them into ${toLang} sounds that preserve the original meaning and humor.
- Add a CONTEXT section only if there's a cultural or interpretive note that would aid understanding. Otherwise, omit it.

Format:
TRANSLATION: [${fromLang} sounds interpreted as ${toLang}]
[Optional CONTEXT: Only if needed, in ${toLang}, explaining the mood, behavior, or meaning]`;
    } else {
      // Human to Human Translation with Cultural Nuance
      systemPrompt = `You are a professional conversation translator and cultural mediator, specializing in translating from ${fromLang} to ${toLang}.
Your goal is seamless understanding:
- Understand idioms, cultural references, tone, and intent in ${fromLang}.
- Translate naturally into ${toLang}, ensuring it feels like it was originally expressed in ${toLang}.
- Only include a CONTEXT section if there's cultural context, idioms, or references that might confuse someone without further explanation. If no extra context is needed, omit that section entirely.
- If provided, CONTEXT must be in ${toLang}.

Format:
TRANSLATION: [Your natural ${toLang} translation]
[Optional CONTEXT: Only if needed, in ${toLang}, explaining idioms, cultural references, or nuances]`;
    }

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
      temperature: 0.7,
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
      // CONTEXT is now optional, so we don't require it:
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
