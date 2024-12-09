"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Square, Send, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supportedLanguages, isPetLanguage } from "@/lib/languages";
import { useZoomControl } from "@/hooks/use-zoom-control";
import { LanguageSelect } from "./language-select";
import { MessageBubble } from "./message-bubble";

interface Message {
  text: string;
  translation: string;
  fromLang: string;
  toLang: string;
  cultural?: string;
  timestamp?: number;
}

const STORAGE_KEYS = {
  FROM_LANG: "ulocat-from-lang",
  TO_LANG: "ulocat-to-lang",
  AUTO_SWITCH: "ulocat-auto-switch",
  MESSAGES: "ulocat-messages",
} as const;

const MAX_STORED_MESSAGES = 50;

function getStoredLanguage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  return supportedLanguages.some((lang) => lang.code === stored)
    ? stored
    : fallback;
}

function getStoredAutoSwitch(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEYS.AUTO_SWITCH) === "true";
}

function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function TranslationInterface() {
  useZoomControl();

  const [fromLang, setFromLang] = useState(() =>
    getStoredLanguage(STORAGE_KEYS.FROM_LANG, "en")
  );
  const [toLang, setToLang] = useState(() =>
    getStoredLanguage(STORAGE_KEYS.TO_LANG, "es")
  );
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => getStoredMessages());
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSwapActive, setIsSwapActive] = useState(() => getStoredAutoSwitch());
  const [isSwapActiveFirst, setIsSwapActiveFirst] = useState(true);
  const [swapMessage, setSwapMessage] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length > 0) {
      const recentMessages = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(recentMessages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          fromLang,
          toLang,
        }),
      });

      const data = await response.json();

      if (data.translation) {
        const [translation, ...culturalNotes] = data.translation.split("\nCONTEXT:");

        setMessages((prev) => [
          ...prev,
          {
            text: inputText,
            translation: translation.replace("TRANSLATION:", "").trim(),
            cultural: culturalNotes.length ? culturalNotes.join("\n").trim() : undefined,
            fromLang,
            toLang,
            timestamp: Date.now(),
          },
        ]);

        setInputText("");
        if (isSwapActive) {
          handleSwapLanguages();
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to translate text",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setIsSwapping(true);
    const newFromLang = toLang;
    const newToLang = fromLang;
    
    setTimeout(() => {
      setFromLang(newFromLang);
      setToLang(newToLang);
      localStorage.setItem(STORAGE_KEYS.FROM_LANG, newFromLang);
      localStorage.setItem(STORAGE_KEYS.TO_LANG, newToLang);
      setIsSwapping(false);
    }, 300);
  };

  const toggleSwapActive = () => {
    setIsSwapActive((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEYS.AUTO_SWITCH, String(newValue));
      return newValue;
    });
  };

  const handleDoubleClick = () => {
    toggleSwapActive();
    setIsSwapActiveFirst(false);
    setSwapMessage(isSwapActive ? "Auto Switch is OFF" : "Auto Switch is ON");
    setTimeout(() => {
      setSwapMessage("");
    }, 3000);
  };

  const handleSingleClick = () => {
    handleSwapLanguages();
  };

  const playTranslation = async (text: string, index: number, toLang: string) => {
    try {
      setIsPlaying(index);
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, toLang }),
      });

      if (!response.ok) throw new Error("Failed to generate speech");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsPlaying(null);
          setCurrentTime(0);
          URL.revokeObjectURL(audioUrl);
        };
        audioRef.current.currentTime = currentTime;
        await audioRef.current.play();

        const updateTime = () => {
          setCurrentTime(audioRef.current?.currentTime || 0);
        };
        audioRef.current.ontimeupdate = updateTime;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to play audio",
        variant: "destructive",
      });
      setIsPlaying(null);
      setCurrentTime(0);
    }
  };

  const handleSpeechToText = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("language", fromLang);

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.text) {
        const translationResponse = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: data.text,
            fromLang,
            toLang,
          }),
        });

        const translationData = await translationResponse.json();

        if (translationData.translation) {
          const [translation, ...culturalNotes] =
            translationData.translation.split("\nCONTEXT:");

          setMessages((prev) => [
            ...prev,
            {
              text: data.text,
              translation: translation.replace("TRANSLATION:", "").trim(),
              cultural: culturalNotes.length
                ? culturalNotes.join("\n").trim()
                : undefined,
              fromLang,
              toLang,
              timestamp: Date.now(),
            },
          ]);

          if (isSwapActive) {
            handleSwapLanguages();
          }
        }
      }
    } catch (error) {
      console.error("Speech to text error:", error);
      toast({
        title: "Error",
        description: "Failed to process speech",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          sampleSize: 16,
          noiseSuppression: true,
          echoCancellation: true,
        },
      });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        handleSpeechToText(audioBlob);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    } else {
      startRecording();
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 2) {
      handleDoubleClick();
    } else if (event.detail === 1) {
      setTimeout(() => {
        if (event.detail === 1) {
          handleSingleClick();
        }
      }, 500);
    }
  };

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex grow flex-col">
      <div className="relative flex-1 overflow-hidden bg-transparent backdrop-blur-[10px]">
        {isLoading && (
          <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="bg-primary h-3 w-3 animate-bounce rounded-full" />
              <div className="bg-primary h-3 w-3 animate-bounce rounded-full [animation-delay:0.2s]" />
              <div className="bg-primary h-3 w-3 animate-bounce rounded-full [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div className="mx-auto mb-4 flex h-full w-full max-w-5xl flex-col-reverse space-y-4 overflow-y-auto px-4">
          <div ref={messagesEndRef} />
          {[...messages].reverse().map((message, index) => (
            <MessageBubble
              key={index}
              text={message.text}
              translation={message.translation}
              fromLang={message.fromLang}
              toLang={message.toLang}
              cultural={message.cultural}
              isPlaying={isPlaying === index}
              onPlay={() => playTranslation(message.translation, index, message.toLang)}
              onDelete={() => {
                const newMessages = [...messages];
                newMessages.splice(messages.length - 1 - index, 1);
                setMessages(newMessages);
              }}
            />
          ))}
        </div>
      </div>

      <div className="bg-background fixed inset-x-0 bottom-0 space-y-3 px-4 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <div className="mx-auto w-full max-w-5xl space-y-3">
          <div className="flex w-full justify-between gap-2">
            <LanguageSelect
              value={fromLang}
              setValue={setFromLang}
              onValueChange={(value) =>
                localStorage.setItem(STORAGE_KEYS.FROM_LANG, value)
              }
            />
            <div className="relative">
              <Button
                variant="outline"
                className={cn(
                  "relative mx-2 flex items-center justify-center transition-all duration-300",
                  isSwapping && "scale-90 opacity-50",
                  isSwapActiveFirst
                    ? "bg-transparent"
                    : isSwapActive
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white",
                )}
                onClick={handleButtonClick}
              >
                <ArrowLeftRight className={cn(
                  "transition-transform duration-300",
                  isSwapping && "rotate-180"
                )} />
                {swapMessage && (
                  <div className="absolute -top-10 left-1/2 w-[135px] -translate-x-1/2 transform rounded bg-black px-3 py-2 text-xs text-white">
                    {swapMessage}
                  </div>
                )}
              </Button>
            </div>
            <LanguageSelect
              value={toLang}
              setValue={setToLang}
              onValueChange={(value) =>
                localStorage.setItem(STORAGE_KEYS.TO_LANG, value)
              }
              align="end"
            />
          </div>

          <div className="flex w-full gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              className="flex-1 text-lg"
              style={{ fontSize: "16px" }}
              disabled={isLoading}
            />

            <Button
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              className={cn(
                "shrink-0 transition-colors duration-200",
                isRecording && "bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
              )}
              disabled={isLoading}
            >
              {isRecording ? (
                <Square className="h-4 w-4 fill-white text-white" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>

            <Button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={cn(
                "shrink-0 transition-all duration-200",
                isLoading && "opacity-70",
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
