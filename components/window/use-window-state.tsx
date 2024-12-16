"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export function useWindowState() {
  const [isMinimized, setIsMinimized] = useState(false);
  const benefitsRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    benefitsRef.current = document.getElementById('benefits');
  }, []);

  const scrollToBenefits = useCallback(() => {
    if (benefitsRef.current) {
      const yOffset = -100; // Adjust this value to account for fixed header
      const y = benefitsRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [benefitsRef]);

  const handleClose = useCallback(() => {
    setIsMinimized(true);
    scrollToBenefits();
  }, [scrollToBenefits]);

  const handleMinimize = useCallback(() => {
    setIsMinimized(true);
    scrollToBenefits();
  }, [scrollToBenefits]);

  const handleRestore = useCallback(() => {
    setIsMinimized(false);
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
