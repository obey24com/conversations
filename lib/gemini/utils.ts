export function formatTranslationResponse(translation: string, context?: string): string {
  if (!context) {
    return `TRANSLATION: ${translation}`;
  }
  return `TRANSLATION: ${translation}\nCONTEXT: ${context}`;
}

export function parseTranslationResponse(text: string): { translation: string; context?: string } {
  const translationMatch = text.match(/TRANSLATION:\s*([\s\S]*?)(?=\s*CONTEXT:|$)/i);
  const contextMatch = text.match(/CONTEXT:\s*([\s\S]*?)$/i);

  if (!translationMatch) {
    return { translation: text.trim() };
  }

  return {
    translation: translationMatch[1].trim(),
    context: contextMatch?.[1]?.trim()
  };
}
