"use client";

import { useRef, useEffect } from "react";
import type { Message } from "@/lib/types";

export function useScrollHandling(messages: Message[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, [messages]);

  return { messagesEndRef };
}
