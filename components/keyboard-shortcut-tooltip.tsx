"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface KeyboardShortcutTooltipProps {
  children: React.ReactNode;
  shortcutWin: string;
  shortcutMac: string;
  side?: "top" | "right" | "bottom" | "left";
}

export function KeyboardShortcutTooltip({
  children,
  shortcutWin,
  shortcutMac,
  side = "top"
}: KeyboardShortcutTooltipProps) {
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align="start"
        className="flex flex-col gap-1 text-xs z-[9999]"
        sideOffset={8}
        alignOffset={-20}
      >
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Win:</span>
          {shortcutWin.split("+").map((key, i) => (
            <span key={i} className="flex items-center">
              {i > 0 && <span className="mx-1">+</span>}
              <kbd className={cn(
                "rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px]",
                "shadow-[inset_0_-1px_0_0_rgb(0_0_0_/_0.1)]"
              )}>
                {key}
              </kbd>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Mac:</span>
          {shortcutMac.split("+").map((key, i) => (
            <span key={i} className="flex items-center">
              {i > 0 && <span className="mx-1">+</span>}
              <kbd className={cn(
                "rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px]",
                "shadow-[inset_0_-1px_0_0_rgb(0_0_0_/_0.1)]"
              )}>
                {key}
              </kbd>
            </span>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
