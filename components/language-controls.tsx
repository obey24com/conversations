"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeftRight } from "lucide-react";
import { supportedLanguages } from "@/lib/languages";
import { LanguageGrid } from "./language-grid";

interface LanguageControlsProps {
  fromLang: string;
  toLang: string;
  onFromLangChange: (value: string) => void;
  onToLangChange: (value: string) => void;
  onSwap: () => void;
}

export function LanguageControls({
  fromLang,
  toLang,
  onFromLangChange,
  onToLangChange,
  onSwap,
}: LanguageControlsProps) {
  const [fromDialogOpen, setFromDialogOpen] = useState(false);
  const [toDialogOpen, setToDialogOpen] = useState(false);

  const getLanguageName = (code: string) => {
    return supportedLanguages.find((lang) => lang.code === code)?.name || code;
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <Dialog open={fromDialogOpen} onOpenChange={setFromDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 h-12 text-lg justify-between font-normal hover:bg-accent min-w-[180px] sm:min-w-[200px]"
          >
            {getLanguageName(fromLang)} Testing
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-[800px]">
          {/* <ScrollArea className="h-[60vh] max-h-[400px]"> */}
          {/* <div className="p-4"> */}
          <LanguageGrid
            selectedLang={fromLang}
            onSelect={(code) => {
              onFromLangChange(code);
              setFromDialogOpen(false);
            }}
          />
          {/* </div> */}
          {/* </ScrollArea> */}
        </DialogContent>
      </Dialog>

      <Button variant="ghost" size="icon" className="shrink-0">
        <ArrowLeftRight className="h-4 w-4" />
      </Button>

      <Dialog open={toDialogOpen} onOpenChange={setToDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 h-12 text-lg justify-between font-normal hover:bg-accent min-w-[180px] sm:min-w-[200px]"
          >
            {getLanguageName(toLang)}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-[800px]">
          <ScrollArea className="h-[60vh] max-h-[400px]">
            <div className="p-4">
              <LanguageGrid
                selectedLang={toLang}
                onSelect={(code) => {
                  onToLangChange(code);
                  setToDialogOpen(false);
                }}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
