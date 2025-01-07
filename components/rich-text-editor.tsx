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
  onKeyDown?: () => void;
}

export function RichTextEditor({
  value,
  onChange,
  onEditor,
  placeholder = "Speak naturally and let ULOCAT translate it for you ...",
  disabled,
  onKeyDown,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-3 py-3 min-h-[48px]',
      },
      handleKeyDown: (view, event) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modKey = isMac ? event.metaKey : event.ctrlKey;
        
        if (event.key === 'Enter' && modKey) {
          event.preventDefault();
          onKeyDown?.();
          return true;
        }
        return false;
      }
    },
    onCreate: ({ editor }) => {
      onEditor?.(editor);
      if (placeholder) {
        const element = editor.view.dom as HTMLElement;
        element.dataset.placeholder = placeholder;
      }
    },
    onDestroy: () => {
      onEditor?.(null);
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.isEditable !== !disabled) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return null;
  }

  return (
    <EditorContent 
      editor={editor}
      className="min-h-[48px] max-h-[200px] overflow-y-auto"
    />
  );
}
