"use client";

import { useState, useCallback, useEffect } from "react";

export function useWindowState() {
  const [isMinimized, setIsMinimized] = useState(false);

  // Reset scroll position when component mounts
  useEffect(() => {
    if (!isMinimized) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [isMinimized]);

  const handleClose = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const handleRestore = useCallback(() => {
    // First restore the window
    setIsMinimized(false);
    
    // Use requestAnimationFrame to ensure the scroll happens after state update
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }, []);

  return {
    isMinimized,
    handleClose,
    handleMinimize,
    handleRestore
  };
}
