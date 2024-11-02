"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, Send, ArrowLeftRight, Volume2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supportedLanguages } from "@/lib/languages";
import { ScrollArea } from "./ui/scroll-area";
import Header from "./header";
import { useZoomControl } from "@/hooks/use-zoom-control";

interface Message {
  text: string;
  translation: string;
  fromLang: string;
  toLang: string;
  cultural?: string;
}

const STORAGE_KEYS = {
  FROM_LANG: 'ulocat-from-lang',
  TO_LANG: 'ulocat-to-lang',
  AUTO_SWITCH: 'ulocat-auto-switch'
} as const;

function getStoredLanguage(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  return supportedLanguages.some(lang => lang.code === stored) ? stored : fallback;
}

function getStoredAutoSwitch(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.AUTO_SWITCH) === 'true';
}

export function TranslationInterface() {
  useZoomControl();

  const [fromLang, setFromLang] = useState(() => getStoredLanguage(STORAGE_KEYS.FROM_LANG, "en"));
  const [toLang, setToLang] = useState(() => getStoredLanguage(STORAGE_KEYS.TO_LANG, "es"));
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSwapActive, setIsSwapActive] = useState(() => getStoredAutoSwitch());
  const [isSwapActiveFirst, setIsSwapActiveFirst] = useState(true);
  const [swapMessage, setSwapMessage] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const handleFromLangChange = (lang: string) => {
    setFromLang(lang);
    localStorage.setItem(STORAGE_KEYS.FROM_LANG, lang);
  };

  const handleToLangChange = (lang: string) => {
    setToLang(lang);
    localStorage.setItem(STORAGE_KEYS.TO_LANG, lang);
  };

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
    const newFromLang = toLang;
    const newToLang = fromLang;
    setFromLang(newFromLang);
    setToLang(newToLang);
    localStorage.setItem(STORAGE_KEYS.FROM_LANG, newFromLang);
    localStorage.setItem(STORAGE_KEYS.TO_LANG, newToLang);
  };

  const toggleSwapActive = () => {
    setIsSwapActive(prev => {
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

  const playTranslation = async (text: string, index: number) => {
    try {
      setIsPlaying(index);
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
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
          const [translation, ...culturalNotes] = translationData.translation.split("\nCONTEXT:");

          setMessages((prev) => [
            ...prev,
            {
              text: data.text,
              translation: translation.replace("TRANSLATION:", "").trim(),
              cultural: culturalNotes.length ? culturalNotes.join("\n").trim() : undefined,
              fromLang,
              toLang,
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
          type: "audio/wav",
        });
        handleSpeechToText(audioBlob);
      };

      mediaRecorder.start();
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "The translated text has been copied to your clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy text.",
          variant: "destructive",
        });
      });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#fafafa]">
      <Header />

      <div
        className="relative flex-1 overflow-hidden"
        style={{
          background: "linear-gradient(to top, #efefef, #ffffff)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div
          ref={scrollRef}
          className="max-w-5xl mx-auto w-full h-full overflow-y-auto space-y-4 px-4 mb-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg max-w-[85%] mx-auto transition-opacity duration-500",
                "bg-white text-slate-900 border border-[#AAAAAA]",
                index === 0 ? "mt-4" : "",
                "opacity-0 animate-fade-in opacity-100"
              )}
            >
              <p className="text-sm opacity-70">{message.text}</p>
              <div className="mt-2 flex flex-col items-start gap-2 relative">
                <p className="font-medium flex-1">{message.translation}</p>
                <div className="flex justify-end w-full border-y border-[#AAAAAA]">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-[#AAAAAA] hover:text-black hover:bg-[#AAAAAA]"
                    onClick={() => {
                      if (isPlaying === index) {
                        audioRef.current?.pause();
                        setIsPlaying(null);
                      } else {
                        playTranslation(message.translation, index);
                      }
                    }}
                  >
                    <Volume2
                      className={cn(
                        "h-4 w-4",
                        isPlaying === index && "animate-pulse"
                      )}
                    />
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(message.translation)}
                    className="shrink-0 text-[#AAAAAA] hover:text-black hover:bg-[#AAAAAA]"
                    aria-label="Copy translation"
                    variant="ghost"
                    size="icon"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {message.cultural && (
                <p className="mt-2 text-sm opacity-70 border-t border-primary-foreground/20 pt-2">
                  {message.cultural}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background shadow-[0_-1px_3px_rgba(0,0,0,0.1)] px-4 py-3 space-y-3">
        <div className="max-w-5xl mx-auto w-full space-y-3">
          <div className="flex gap-2 justify-between w-full">
            <Select value={fromLang} onValueChange={handleFromLangChange}>
              <SelectTrigger className="w-[120px] sm:w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[85vh] max-h-[75vh] md:max-h-[80vh] md:w-full max-w-[90vw]">
                  <div className="p-4 w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 bg-red md:w-full w-[80%]">
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </SelectContent>
            </Select>

            <div className="relative">
              <Button
                variant="outline"
                className={cn(
                  "flex items-center justify-center mx-2 relative",
                  isSwapActiveFirst
                    ? "bg-transparent"
                    : isSwapActive
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                )}
                onClick={handleButtonClick}
              >
                <ArrowLeftRight />
                {swapMessage && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-2 px-3 w-[135px]">
                    {swapMessage}
                  </div>
                )}
              </Button>
            </div>

            <Select value={toLang} onValueChange={handleToLangChange}>
              <SelectTrigger className="w-[120px] sm:w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[85vh] max-h-[75vh] md:max-h-[80vh] md:w-full max-w-[90vw]">
                  <div className="p-4 w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 bg-red md:w-full w-[80%]">
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
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
                isRecording &&
                  "bg-red-500 text-white border-red-500 hover:bg-red-600 hover:text-white"
              )}
              disabled={isLoading}
            >
              <Mic className={cn("h-4 w-4", isRecording && "animate-pulse")} />
            </Button>

            <Button
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className={cn(
                "shrink-0 transition-all duration-200",
                isLoading && "opacity-70"
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
