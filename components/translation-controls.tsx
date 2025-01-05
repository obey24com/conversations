"use client";
import { useState, useCallback, useRef } from 'react';
import { Editor } from '@tiptap/core';
import { Button } from "@/components/ui/button";
import { Square, Mic, Send, ArrowLeftRight, FileCode, Type, Bold, Italic, List, ListOrdered, Quote, Link, Undo, Redo, Strikethrough } from "lucide-react";
import { KeyboardShortcutTooltip } from "./keyboard-shortcut-tooltip";
import { cn } from "@/lib/utils";
import { LanguageSelect } from "./language-select";
import { RichTextEditor } from "./rich-text-editor";
import { HTMLCodeEditor } from "./html-code-editor";
import { HeadingDropdown } from "./heading-dropdown";
import type { TranslationControlsProps } from '@/lib/types';

export function TranslationControls({
  fromLang,
  toLang,
  inputText,
  editorMode,
  isLoading,
  isRecording,
  isSwapping,
  isSwapActive,
  isSwapActiveFirst,
  swapMessage,
  onEditorModeChange,
  onFromLangChange,
  onToLangChange,
  onInputChange,
  onSend,
  onRecord,
  onSwap,
}: TranslationControlsProps) {
  const editorRef = useRef<Editor | null>(null);

  const handleEditor = useCallback((editor: Editor | null) => {
    editorRef.current = editor;
  }, []);

  const handleFormat = useCallback((command: string) => {
    if (!editorRef.current) return;
    
    switch (command) {
      case 'bold':
        editorRef.current.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editorRef.current.chain().focus().toggleItalic().run();
        break;
      case 'bulletList':
        editorRef.current.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editorRef.current.chain().focus().toggleOrderedList().run();
        break;
      case 'heading':
        editorRef.current.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'blockquote':
        editorRef.current.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editorRef.current.chain().focus().toggleCodeBlock().run();
        break;
      case 'strike':
        editorRef.current.chain().focus().toggleStrike().run();
        break;
      case 'undo':
        editorRef.current.chain().focus().undo().run();
        break;
      case 'redo':
        editorRef.current.chain().focus().redo().run();
        break;
    }
  }, []);

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

        <div className="flex w-full gap-2 items-start">
          <div className="flex-1">
            <div className="border rounded-md overflow-hidden bg-background">
              <div className="border-b p-2 flex items-center justify-between gap-2 bg-gray-50">
                <div className="flex items-center gap-2">
                  {editorMode === 'rich-text' && (
                  <>
                    <div className="flex gap-1 border-r pr-2">
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+B"
                        shortcutMac="⌘+B"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('bold')}
                          disabled={isLoading || editorMode !== 'rich-text'}
                          className="hover:bg-muted"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+I"
                        shortcutMac="⌘+I"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('italic')}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+Shift+8"
                        shortcutMac="⌘+⇧+8"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('bulletList')}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+Shift+7"
                        shortcutMac="⌘+⇧+7"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('orderedList')}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                    </div>
                    <div className="flex gap-1 border-r pr-2">
                      <HeadingDropdown editor={editorRef.current} disabled={isLoading} />
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+Shift+>"
                        shortcutMac="⌘+⇧+>"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('blockquote')}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <Quote className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+Alt+C"
                        shortcutMac="⌘+⌥+C"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('code')}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <FileCode className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                    </div>
                    <div className="flex gap-1 border-r pr-2">
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+K"
                        shortcutMac="⌘+K"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {/* TODO: Implement link */}}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+Shift+X"
                        shortcutMac="⌘+⇧+X"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('strike')}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <Strikethrough className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                    </div>
                    <div className="flex gap-1">
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+Z"
                        shortcutMac="⌘+Z"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('undo')}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <Undo className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                      <KeyboardShortcutTooltip
                        shortcutWin="Ctrl+Y"
                        shortcutMac="⌘+⇧+Z"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFormat('redo')}
                          disabled={isLoading}
                          className="hover:bg-muted"
                        >
                          <Redo className="h-4 w-4" />
                        </Button>
                      </KeyboardShortcutTooltip>
                    </div>
                  </>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditorModeChange('rich-text')}
                    className={cn(
                      "h-7 text-xs",
                      editorMode === 'rich-text' && "bg-muted"
                    )}
                  >
                    <Type className="h-3 w-3 mr-1" />
                    Text
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditorModeChange('html')}
                    className={cn(
                      "h-7 text-xs",
                      editorMode === 'html' && "bg-muted"
                    )}
                  >
                    <FileCode className="h-3 w-3 mr-1" />
                    HTML
                  </Button>
                </div>
              </div>
              {editorMode === 'rich-text' ? (
                <RichTextEditor
                  value={inputText}
                  onEditor={handleEditor}
                  onChange={onInputChange}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  onKeyDown={() => onSend()}
                />
              ) : (
                <HTMLCodeEditor
                  value={inputText}
                  onChange={onInputChange}
                  placeholder="Paste your HTML code here..."
                  disabled={isLoading}
                  onKeyDown={() => onSend()}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className={cn( 
                "h-12 w-[48px] shrink-0 transition-colors duration-200",
                isRecording && "border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600"
              )}
              onClick={onRecord}
              disabled={isLoading}
            >
              {isRecording ? (
                <Square className="h-10 w-10 fill-white text-white" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>

            <Button
              onClick={onSend}
              className={cn(
                "h-12 w-[48px] shrink-0 transition-all duration-200",
                isLoading && "opacity-70"
              )}
              disabled={!inputText.trim() || isLoading}
            >
              <Send className="h-10 w-10" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
