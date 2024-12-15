"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Square, Mic, Send, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSelect } from "./language-select";
import type { TranslationControlsProps } from '@/lib/types';

export function TranslationControls({
  fromLang,
  toLang,
  inputText,
  isLoading,
  isRecording,
  isSwapping,
  isSwapActive,
  isSwapActiveFirst,
  swapMessage,
  onFromLangChange,
  onToLangChange,
  onInputChange,
  onSend,
  onRecord,
  onSwap,
}: TranslationControlsProps) {
  return (
    <div className="border-t bg-white px-4 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
      <div className="mx-auto w-full max-w-5xl space-y-3">
        <div className="flex w-full justify-between gap-2">
          <LanguageSelect
            value={fromLang}
            setValue={onFromLangChange}
            onValueChange={onFromLangChange}
          />

          <div className="relative">
            <Button
              variant="outline"
              className={cn(
                "relative mx-2 flex items-center justify-center transition-all duration-300",
                isSwapping && "scale-90 opacity-50",
                isSwapActiveFirst
                  ? "bg-transparent"
                  : isSwapActive
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white",
              )}
              onClick={onSwap}
            >
              <ArrowLeftRight className={cn(
                "transition-transform duration-300",
                isSwapping && "rotate-180"
              )} />
              {swapMessage && (
                <div className="absolute -top-10 left-1/2 w-[135px] -translate-x-1/2 transform rounded bg-black px-3 py-2 text-xs text-white">
                  {swapMessage}
                </div>
              )}
            </Button>
          </div>

          <LanguageSelect
            value={toLang}
            setValue={onToLangChange}
            onValueChange={onToLangChange}
            align="end"
          />
        </div>

        <div className="flex w-full gap-2">
          <Input
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
            className="flex-1 text-lg"
            style={{ fontSize: "16px" }}
            disabled={isLoading}
          />

          <Button
            variant="outline"
            size="icon"
            onClick={onRecord}
            className={cn(
              "shrink-0 transition-colors duration-200",
              isRecording && "border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600"
            )}
            disabled={isLoading}
          >
            {isRecording ? (
              <Square className="h-4 w-4 fill-white text-white" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          <Button
            onClick={onSend}
            disabled={!inputText.trim() || isLoading}
            className={cn(
              "shrink-0 transition-all duration-200",
              isLoading && "opacity-70"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
