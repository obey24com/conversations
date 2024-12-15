"use client";

import Image from "next/image";
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
          <Image
            src="/img/logo.png"
            alt="ULOCAT Logo"
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
          />
          <h2 className="text-sm font-medium text-gray-600">ULOCAT</h2>
        </div>
        <div className="w-16" /> {/* Spacer for visual balance */}
      </div>
    </div>
  );
}
