"use client";

import { MessageSquare } from "lucide-react";
import { WindowControls } from "./window-controls";

interface WindowHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
}

export function WindowHeader({ onClose, onMinimize }: WindowHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-t-xl px-6 py-4">
      <div className="flex items-center space-x-4">
        <WindowControls onClose={onClose} onMinimize={onMinimize} />
        <div className="flex-1 flex items-center justify-center gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-medium text-gray-600">Universal Translator</h2>
        </div>
        <div className="w-16" /> {/* Spacer for visual balance */}
      </div>
    </div>
  );
}
