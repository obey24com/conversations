"use client";

import { Textarea } from './ui/textarea';

interface HTMLCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: () => void;
}

export function HTMLCodeEditor({
  value,
  onChange,
  placeholder,
  disabled,
  onKeyDown,
}: HTMLCodeEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          onKeyDown?.();
        }
      }}
      className="min-h-[48px] max-h-[200px] font-mono text-sm px-3 py-3"
      style={{ 
        resize: 'vertical',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
      }}
    />
  );
}
