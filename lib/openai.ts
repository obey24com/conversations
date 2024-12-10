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
    // Special handling for pet languages
    const isPetFrom = fromLang === "cat" || fromLang === "dog";
    const isPetTo = toLang === "cat" || toLang === "dog";

    let systemPrompt = "";

    if (isPetFrom) {
      systemPrompt = `You are an expert ${fromLang} translator with a great sense of humor. 
      First, interpret the following ${fromLang} sounds or expressions as if you were the ${fromLang}.
      Then, if the target language is not English, translate that interpretation into ${toLang}.
      
      Be creative, witty, and sometimes sarcastic - think about what a ${fromLang} might actually mean.
      Include typical ${fromLang} behaviors and attitudes in your interpretation.
      
      For cats: Include references to typical cat behaviors like knocking things off tables, demanding food,
      judging humans, sleeping in sunbeams, etc. Be somewhat entitled and aristocratic in tone.
      
      For dogs: Include references to walks, treats, playing fetch, being a good boy/girl,
      protecting the house, etc. Be enthusiastic and loving in tone.
      
      Format your response as:
      TRANSLATION: [Your interpretation translated to ${toLang}]
      CONTEXT: [Explain the ${fromLang}'s mood, behavior, or hidden meaning in ${toLang}]`;
    } else if (isPetTo) {
      systemPrompt = `You are an expert ${toLang} language translator with a great sense of humor. 
      Translate the following text into ${toLang} sounds, but make it fun and creative.
      
      For cats: Use variations of "meow", "purr", "hiss", etc. Include some attitude!
      For dogs: Use variations of "woof", "bark", "ruff", etc. Make it enthusiastic!
      
      Format your response as:
      TRANSLATION: [The ${toLang} sounds]
      CONTEXT: [A humorous explanation of what these sounds mean in ${toLang} culture]`;
    } else {
      systemPrompt = `Translate the following text from ${fromLang} to ${toLang}. 
      Ensure that the translation conveys the intended meaning clearly in ${toLang}, 
      so that it is understandable to the reader.

      Format your response as follows:
      TRANSLATION: [Your translation here]
      CONTEXT: [Any cultural context, idioms, or additional notes - only if applicable]. Write the context in ${toLang}.
      
      Only include the CONTEXT section if there are important cultural nuances to explain.`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No translation generated');
    }

    return response;
  } catch (error) {
    console.error('OpenAI translation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Translation failed');
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
