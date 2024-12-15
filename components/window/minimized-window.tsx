"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface MinimizedWindowProps {
  isMinimized: boolean;
  onRestore: () => void;
}

export function MinimizedWindow({ isMinimized, onRestore }: MinimizedWindowProps) {
  return (
    <AnimatePresence>
      {isMinimized && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="fixed right-0 top-1/2 z-50 -translate-y-1/2"
        >
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestore}
            className="flex items-center gap-3 rounded-l-xl bg-white/80 px-4 py-6 shadow-lg backdrop-blur-md border border-r-0 border-gray-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">ULOCAT</p>
              <p className="text-xs text-gray-500">Click to restore</p>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
