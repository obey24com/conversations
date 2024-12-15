"use client";

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useTranslationUI() {
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [isSwapActive, setIsSwapActive] = useState(false);
  const [isSwapActiveFirst, setIsSwapActiveFirst] = useState(true);
  const { toast } = useToast();

  const showSwapMessage = useCallback((message: string) => {
    setSwapMessage(message);
    setTimeout(() => setSwapMessage(''), 3000);
  }, []);

  const handleSwapToggle = useCallback(() => {
    setIsSwapActive(prev => !prev);
    setIsSwapActiveFirst(false);
    showSwapMessage(isSwapActive ? 'Auto Switch is OFF' : 'Auto Switch is ON');
  }, [isSwapActive, showSwapMessage]);

  const startSwapAnimation = useCallback(() => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);
  }, []);

  return {
    isSwapping,
    swapMessage,
    isSwapActive,
    isSwapActiveFirst,
    showSwapMessage,
    handleSwapToggle,
    startSwapAnimation,
    toast
  };
}
