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
  onValueChange = (value) => {},
}: {
  align?: "start" | "center" | "end";
  value?: string;
  setValue?: (value: string) => void;
  onValueChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between sm:w-full"
        >
          {value
            ? supportedLanguages.find((lang) => lang.code === value)?.name
            : "Select language..."}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-[250px] p-0 md:w-[500px] lg:w-[780px]"
      >
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList className="h-[calc(100dvh-180px)] max-h-[75vh] md:max-h-[80vh]">
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              <div className="grid w-[80%] grid-cols-2 gap-2 sm:grid-cols-3 md:w-full md:grid-cols-4 lg:grid-cols-5">
                {supportedLanguages.map((lang) => (
                  <CommandItem
                    key={lang.name}
                    value={lang.name}
                    onSelect={(currentValue) => {
                      const selected = supportedLanguages.find(
                        (lang) => lang.name === currentValue,
                      );
                      if (selected) {
                        setValue(selected.code);
                        onValueChange(selected.code);
                      }
                      setOpen(false);
                    }}
                  >
                    {lang.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === lang.code ? "opacity-100" : "opacity-0",
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
