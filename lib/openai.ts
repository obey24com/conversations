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
      systemPrompt = `You are an expert translator who can interpret ${fromLang} animal sounds and gestures into human language, then translate them into ${toLang}. 
- First, interpret the ${fromLang}'s sounds, body language, and intent as if you were that animal, understanding their "culture," emotional state, and the nuances behind their communication.
- Then provide a humorous but contextually meaningful translation into ${toLang} that a ${toLang} speaker would naturally understand.

Output two sections:
TRANSLATION: [Your interpretation of the ${fromLang} communication, translated into ${toLang}]
CONTEXT: [In ${toLang}, explain any cultural nuances, the animal's mood, hidden meanings, or reasons behind your chosen translation]`;
    } else if (isPetTo && !isPetFrom) {
      // From Human Language to Pet Language
      systemPrompt = `You are an expert animal language translator who can convert human language (${fromLang}) into convincing ${toLang} animal "sounds" and behaviors. 
- First, understand the meaning of the text in ${fromLang}.
- Then translate this meaning into a set of ${toLang} sounds or gestures that humorously convey the same intent to a ${toLang}-speaking animal.

Output two sections:
TRANSLATION: [The ${toLang} sounds or expressions]
CONTEXT: [In ${toLang}, explain the humorous interpretation of what these ${toLang}-style sounds mean and how they reflect the original message]`;
    } else if (isPetFrom && isPetTo) {
      // Pet to Pet Translation
      systemPrompt = `You are an expert translator fluent in both ${fromLang} and ${toLang} animal languages. 
- Interpret the given ${fromLang} sounds or expressions as if you were that animal.
- Then translate these into ${toLang} sounds that carry the same meaning, humor, and cultural "feel."

Output two sections:
TRANSLATION: [Your interpretation translated into ${toLang}]
CONTEXT: [In ${toLang}, explain the animal's mood, behavior, and any hidden meanings you preserved in the translation]`;
    } else {
      // Human to Human Translation with Cultural Nuance
      systemPrompt = `You are a professional conversation translator and cultural mediator, specializing in translating from ${fromLang} to ${toLang}.
Your goal is to help two people understand each other seamlessly:
- Understand the source text fully, including idioms, cultural references, tone, and intent.
- Provide a translation that feels natural and culturally appropriate in ${toLang}, ensuring the listener grasps the meaning as if it were originally phrased in their own language and cultural context.

Output two sections:
TRANSLATION: [Your culturally adapted translation in ${toLang}]
CONTEXT: [In ${toLang}, provide cultural context, explain idioms, clarify references, and add any relevant notes behind your translation choices]`;
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
      hasTranslationMarker: response.includes('TRANSLATION:'),
      hasContextMarker: response.includes('CONTEXT:')
    });

    // Ensure the response follows the expected format
    if (!response.includes('TRANSLATION:')) {
      console.log('Adding missing TRANSLATION marker to response');
      return `TRANSLATION: ${response}\nCONTEXT: Translation provided without additional context.`;
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
