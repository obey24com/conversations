import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: apiKey,
});

export async function translateText(
  text: string,
  fromLang: string,
  toLang: string
) {
  try {
    const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content: `Translate the following text from ${fromLang} to ${toLang}. Ensure that the translation conveys the intended meaning clearly in ${toLang}, so that it is understandable to the reader. If there are connections or references to previous translations, please incorporate them appropriately to maintain coherence.

Format your response as follows:

TRANSLATION: [Your translation here]

CONTEXT: [Any cultural context, idioms, or additional notes - if applicable]. Write the context in ${toLang}.

Only include the CONTEXT section if there are important cultural nuances to explain.

As a professional translator, focus on delivering a meaningful and contextually appropriate translation.`,
    },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('OpenAI translation error:', error);
    throw error;
  }
}

export async function textToSpeech(text: string) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text,
    });

    // Convert the response to a base64 string
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return `data:audio/mp3;base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error('Text to speech error:', error);
    throw error;
  }
}
