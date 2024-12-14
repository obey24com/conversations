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
      className="fixed inset-0 bg-black/5 backdrop-blur-sm"
      onClick={onClick}
      style={{ display: isVisible ? "block" : "none" }}
    />
  );
}
