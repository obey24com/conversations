"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WindowControlsProps {
  onClose: () => void;
  onMinimize: () => void;
}

export function WindowControls({ onClose, onMinimize }: WindowControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onMinimize}
        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
      />
      <div className="w-3 h-3 rounded-full bg-green-500" />
    </div>
  );
}
