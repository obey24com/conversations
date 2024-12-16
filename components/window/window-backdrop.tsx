"use client";

import { motion } from "framer-motion";

interface WindowBackdropProps {
  isVisible: boolean;
  onClick: () => void;
}

export function WindowBackdrop({ isVisible, onClick }: WindowBackdropProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#2253be24] backdrop-blur-sm pointer-events-none"
      style={{ display: isVisible ? "block" : "none" }}
    />
  );
}
