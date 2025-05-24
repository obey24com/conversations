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
import { supportedLanguages } from "@/lib/languages";

// Pre-calculate language maps for better performance
const languageNameMap = new Map(
  supportedLanguages.map(lang => [lang.code, lang.name])
);

const languageCodeMap = new Map(
  supportedLanguages.map(lang => [lang.name, lang.code])
);

export function LanguageSelect({
  align = "start",
  value = "en",
  setValue = () => {},
  onValueChange = (value: string) => {},
}: {
  align?: "start" | "center" | "end";
  value?: string;
  setValue?: (value: string) => void;
  onValueChange?: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  // Get selected language name from pre-calculated map
  const selectedLanguage = languageNameMap.get(value);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (currentValue: string) => {
    const selectedCode = languageCodeMap.get(currentValue);
    if (selectedCode) {
      setIsChanging(true);
      setValue(selectedCode);
      onValueChange(selectedCode);
      // Reduce animation duration
      setTimeout(() => setIsChanging(false), 150);
    }
    setOpen(false);
  };

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
        className="w-[90vw] p-0 md:w-[500px] lg:w-[780px] max-h-[calc(100vh-180px)] mt-28"
      >
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList className="max-h-[calc(100vh-240px)]">
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:w-full md:grid-cols-4 lg:grid-cols-5">
                {supportedLanguages.map((lang) => (
                  <CommandItem
                    key={lang.name}
                    value={lang.name}
                    onSelect={handleLanguageChange}
                    className="hover:bg-accent"
                  >
                    {lang.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === lang.code ? "opacity-100 scale-100" : "opacity-0 scale-75",
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
