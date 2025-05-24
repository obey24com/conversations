"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supportedLanguages, LanguageCode, LanguageName, isValidLanguageCode, isValidLanguageName } from "@/lib/languages";

// Pre-calculate language maps for better performance
const languageNameMap = new Map<LanguageCode, LanguageName>(
  supportedLanguages.map(lang => [lang.code, lang.name])
);

const languageCodeMap = new Map<LanguageName, LanguageCode>(
  supportedLanguages.map(lang => [lang.name, lang.code])
);

interface LanguageSelectProps {
  align?: "start" | "center" | "end";
  value?: LanguageCode;
  setValue?: (value: LanguageCode) => void;
  onValueChange?: (value: LanguageCode) => void;
  className?: string;
}

export function LanguageSelect({
  align = "start",
  value = "en",
  setValue = () => {},
  onValueChange = (value: string) => {},
}: LanguageSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [recentLanguages, setRecentLanguages] = React.useState<LanguageCode[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem('recentLanguages');
    if (stored) {
      setRecentLanguages(JSON.parse(stored));
    }
  }, []);

  const updateRecentLanguages = React.useCallback((code: LanguageCode) => {
    setRecentLanguages(prev => {
      const filtered = prev.filter(lang => lang !== code);
      const updated = [code, ...filtered].slice(0, 4);
      localStorage.setItem('recentLanguages', JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  const selectedLanguage = React.useMemo(() => {
    if (!isValidLanguageCode(value)) return null;
    return languageNameMap.get(value);
  }, [value]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = React.useCallback((currentValue: string) => {
    if (!isValidLanguageName(currentValue)) return;
    
    const selectedCode = languageCodeMap.get(currentValue);
    if (selectedCode) {
      setIsChanging(true);
      setValue(selectedCode);
      onValueChange(selectedCode);
      updateRecentLanguages(selectedCode);
      setTimeout(() => setIsChanging(false), 150); // Animation duration
    }
    setOpen(false);
  }, [setValue, onValueChange, updateRecentLanguages]);

  if (!mounted) {
    return (
      <Button variant="outline" className="w-[120px] justify-between sm:w-full">
        Loading...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          variant="outline"
          className={cn("w-full justify-between bg-white hover:bg-accent", {
            "opacity-50": isChanging
          })}
        >
          <span>
            {selectedLanguage || "Select language..."}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 opacity-50",
            open && "rotate-180"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align} 
        className="w-[90vw] p-0 md:w-[500px] lg:w-[780px] max-h-[min(420px,_calc(100vh-280px))] mt-2"
      >
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList className="max-h-[min(360px,_calc(100vh-320px))] overflow-y-auto">
            <CommandEmpty>No language found.</CommandEmpty>
            {recentLanguages.length > 0 && (
              <CommandGroup heading="Recent">
                <div className="grid grid-cols-2 gap-1.5 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {recentLanguages.map((code) => {
                    const name = languageNameMap.get(code);
                    if (!name) return null;
                    return (
                      <CommandItem
                        key={code}
                        value={name}
                        onSelect={handleLanguageChange}
                        className="flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer hover:bg-accent/50"
                      >
                        <span className="truncate">{name}</span>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === code ? "opacity-100 scale-100" : "opacity-0 scale-75",
                            "transition-all duration-150"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </div>
              </CommandGroup>
            )}
            <CommandGroup heading="All Languages">
              <div className="grid grid-cols-2 gap-1.5 p-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {supportedLanguages.map((lang) => (
                  <CommandItem
                    key={lang.name}
                    value={lang.name}
                    onSelect={handleLanguageChange}
                    className="flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer hover:bg-accent/50"
                  >
                    <span className="truncate">{lang.name}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === lang.code ? "opacity-100 scale-100" : "opacity-0 scale-75",
                        "transition-all duration-150"
                      )}
                    />
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
