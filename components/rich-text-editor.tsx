"use client";

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/core';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onEditor?: (editor: Editor | null) => void;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (event: KeyboardEvent) => void;
}

export function RichTextEditor({
  value,
  onChange,
  onEditor,
  placeholder,
  disabled,
  onKeyDown,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-3 py-3 min-h-[48px]'
      }
    },
    onCreate: ({ editor }) => {
      editor.view.dom.setAttribute('data-placeholder', 'Speak naturally and let ULOCAT translate it for you ...');
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onKeyDown: (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onKeyDown?.(event);
      }
    },
  }, []);

  useEffect(() => {
    onEditor?.(editor);
    return () => onEditor?.(null);
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContent 
      editor={editor} 
      disabled={disabled}
      className="min-h-[48px] max-h-[200px] overflow-y-auto"
    />
  );
}
