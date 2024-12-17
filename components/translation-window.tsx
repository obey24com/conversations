"use client";

import { TranslationInterface } from "./translation-interface";
import { WindowHeader } from "./window/window-header";
import { WindowBackdrop } from "./window/window-backdrop";
import { MinimizedWindow } from "./window/minimized-window";
import { useWindowState } from "./window/use-window-state";
import { motion, AnimatePresence } from "framer-motion";

export function TranslationWindow() {
  const { isMinimized, handleClose, handleMinimize, handleRestore } = useWindowState();

  return (
    <>
      <AnimatePresence>
        {!isMinimized && (
          <WindowBackdrop isVisible={!isMinimized} onClick={() => {}} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative mx-auto max-w-5xl w-full z-10 overflow-hidden rounded-2xl"
          >
            <WindowHeader onClose={handleClose} onMinimize={handleMinimize} />

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              className="bg-white/80 backdrop-blur-md border-x border-b border-gray-200 shadow-lg"
            >
              <div className="h-[calc(100vh-250px)] min-h-[600px]">
                <TranslationInterface />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MinimizedWindow isMinimized={isMinimized} onRestore={handleRestore} />
    </>
  );
}
