"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KeyboardShortcutTooltip } from "./keyboard-shortcut-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6
} from "lucide-react";
import { Editor } from '@tiptap/core';

const headingOptions = [
  { level: 1, icon: Heading1, label: 'Heading 1' },
  { level: 2, icon: Heading2, label: 'Heading 2' },
  { level: 3, icon: Heading3, label: 'Heading 3' },
  { level: 4, icon: Heading4, label: 'Heading 4' },
  { level: 5, icon: Heading5, label: 'Heading 5' },
  { level: 6, icon: Heading6, label: 'Heading 6' },
];

interface HeadingDropdownProps {
  editor: Editor | null;
  disabled?: boolean;
}

export function HeadingDropdown({ editor, disabled }: HeadingDropdownProps) {
  const setHeading = (level: number) => {
    if (!editor) return;
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const isActive = (level: number) => {
    if (!editor) return false;
    return editor.isActive('heading', { level });
  };

  return (
    <DropdownMenu>
      <KeyboardShortcutTooltip
        shortcutWin="Ctrl+Alt+[1-6]"
        shortcutMac="⌘+⌥+[1-6]"
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="hover:bg-muted"
          >
            <Heading2 className="h-4 w-4" aria-label="Heading options" />
          </Button>
        </DropdownMenuTrigger>
      </KeyboardShortcutTooltip>
      <DropdownMenuContent align="start" className="w-32">
        {headingOptions.map(({ level, icon: Icon, label }) => (
          <DropdownMenuItem
            key={level}
            onClick={() => setHeading(level)}
            className={cn(
              "flex items-center gap-2",
              isActive(level) && "bg-accent"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs">
              {label}
              <span className="ml-1 text-muted-foreground">
                (H{level})
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
