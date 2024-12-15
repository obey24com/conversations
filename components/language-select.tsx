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
}) {
  const [open, setOpen] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const selectedLanguage = React.useMemo(() => 
    supportedLanguages.find((lang) => lang.code === value)?.name,
    [value]
  );

  const handleLanguageChange = (currentValue: string) => {
    const selected = supportedLanguages.find(
      (lang) => lang.name === currentValue,
    );
    if (selected) {
      setIsChanging(true);
      setValue(selected.code);
      onValueChange(selected.code);
      setTimeout(() => setIsChanging(false), 300);
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
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[120px] justify-between sm:w-full transition-all duration-300 ease-in-out",
            isChanging && "scale-95 opacity-50 transform",
          )}
        >
          <span className={cn(
            "transition-all duration-300 ease-in-out",
            isChanging && "blur-sm"
          )}>
            {selectedLanguage || "Select language..."}
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 opacity-50 transition-transform duration-200",
            open && "rotate-180"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-[250px] p-0 md:w-[500px] lg:w-[780px]"
      >
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:w-full md:grid-cols-4 lg:grid-cols-5">
                {supportedLanguages.map((lang) => (
                  <CommandItem
                    key={lang.name}
                    value={lang.name}
                    onSelect={handleLanguageChange}
                    className="transition-all duration-200 hover:scale-[1.02]"
                  >
                    {lang.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 transition-all duration-200",
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
