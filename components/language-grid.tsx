"use client";

import { Button } from '@/components/ui/button';
import { supportedLanguages } from '@/lib/languages';
import { cn } from '@/lib/utils';

interface LanguageGridProps {
  selectedLang: string;
  onSelect: (code: string) => void;
}

export function LanguageGrid({ selectedLang, onSelect }: LanguageGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {supportedLanguages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          className={cn(
            "h-16 flex flex-col items-center justify-center gap-1 hover:bg-accent",
            selectedLang === lang.code && "bg-accent"
          )}
          onClick={() => onSelect(lang.code)}
        >
          <span className="text-base text-center">{lang.name}</span>
          <span className="text-xs text-muted-foreground">{lang.code.toUpperCase()}</span>
        </Button>
      ))}
    </div>
  );
}