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
  if (!text?.trim() || !fromLang || !toLang) {
    throw new Error('Missing required parameters for translation');
  }

  try {
    const isPetFrom = fromLang === "cat" || fromLang === "dog";
    const isPetTo = toLang === "cat" || toLang === "dog";

    let systemPrompt = "";

    if (isPetFrom) {
      systemPrompt = `You are an expert ${fromLang} translator with a great sense of humor. 
      First, interpret the following ${fromLang} sounds or expressions as if you were the ${fromLang}.
      Then, if the target language is not English, translate that interpretation into ${toLang}.
      
      Format your response exactly as:
      TRANSLATION: [Your interpretation translated to ${toLang}]
      CONTEXT: [Explain the ${fromLang}'s mood, behavior, or hidden meaning in ${toLang}]`;
    } else if (isPetTo) {
      systemPrompt = `You are an expert ${toLang} language translator with a great sense of humor. 
      Translate the following text into ${toLang} sounds, but make it fun and creative.
      
      Format your response exactly as:
      TRANSLATION: [The ${toLang} sounds]
      CONTEXT: [A humorous explanation of what these sounds mean in ${toLang} culture]`;
    } else {
      systemPrompt = `Translate the following text from ${fromLang} to ${toLang}. 
      Ensure that the translation conveys the intended meaning clearly in ${toLang}.

      Format your response exactly as:
      TRANSLATION: [Your translation here]
      CONTEXT: [Any cultural context, idioms, or additional notes if applicable]`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    
    if (!response) {
      throw new Error('No translation generated');
    }

    // Ensure the response follows the expected format
    if (!response.includes('TRANSLATION:')) {
      return `TRANSLATION: ${response}\nCONTEXT: Translation provided without additional context.`;
    }

    return response;
  } catch (error) {
    console.error('OpenAI translation error:', error);
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
