"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mic,
  Square,
  Send,
  RotateCcw,
  ChevronUp,
  Camera,
  Globe,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  supportedLanguages,
  isPetLanguage,
  LanguageCode,
  isValidLanguageCode,
} from "@/lib/languages";
import { useZoomControl } from "@/hooks/use-zoom-control";
import { LanguageSelect } from "./language-select";
import { MessageBubble } from "./message-bubble";
import { STORAGE_KEYS } from "@/lib/constants";
import { useMicrophonePermission } from "@/hooks/use-microphone-permission";


interface Message {
  id: string;
  text: string;
  translation: string;
  fromLang: LanguageCode;
  toLang: LanguageCode;
  cultural?: string;
  timestamp?: number;
}

const MAX_STORED_MESSAGES = 50;

function getStoredLanguage(key: string, fallback: LanguageCode): LanguageCode {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  return stored && isValidLanguageCode(stored) ? stored : fallback;
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
    const messages = JSON.parse(stored);
    return messages.map((msg: Message) => ({
      ...msg,
      id: msg.id || Math.random().toString(36).substr(2, 9),
    }));
  } catch {
    return [];
  }
}

export function TranslationInterface() {
  useZoomControl();

  const [fromLang, setFromLang] = useState(() =>
    getStoredLanguage(STORAGE_KEYS.FROM_LANG, "en"),
  );
  const [toLang, setToLang] = useState(() =>
    getStoredLanguage(STORAGE_KEYS.TO_LANG, "es"),
  );
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>(() =>
    getStoredMessages(),
  );
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSwapActive, setIsSwapActive] = useState(() => getStoredAutoSwitch());
  const [isSwapActiveFirst, setIsSwapActiveFirst] = useState(true);
  const [swapMessage, setSwapMessage] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const { permissionState, requestPermission, AUDIO_CONSTRAINTS } =
    useMicrophonePermission();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId),
    );
  }, []); // No dependencies needed as setMessages is stable

  const handleSwapLanguages = useCallback(() => {
    const newFromLang = toLang;
    const newToLang = fromLang;
    setFromLang(newFromLang);
    setToLang(newToLang);
    localStorage.setItem(STORAGE_KEYS.FROM_LANG, newFromLang);
    localStorage.setItem(STORAGE_KEYS.TO_LANG, newToLang);
  }, [fromLang, toLang]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    setIsTranslating(true);
    try {
      setIsLoading(true);
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          toLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.translation) {
        const [translation, ...culturalNotes] =
          data.translation.split("\nCONTEXT:");

        const detectedFromLang = data.detectedLang || "en";
        
        const newMessage = {
          id: Math.random().toString(36).substr(2, 9),
          text: inputText,
          translation: translation.replace("TRANSLATION:", "").trim(),
          cultural: culturalNotes.length
            ? culturalNotes.join("\n").trim()
            : undefined,
          fromLang: detectedFromLang,
          toLang,
          timestamp: Date.now(),
        };

        setMessages((prev) => {
          const updatedMessages = [...prev, newMessage];
          localStorage.setItem(
            STORAGE_KEYS.MESSAGES,
            JSON.stringify(updatedMessages),
          );
          return updatedMessages;
        });

        setInputText("");

        if (isSwapActive) {
          handleSwapLanguages();
        }
      } else {
        throw new Error("No translation in response");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to translate text",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTranslating(false);
    }
  }, [
    inputText,
    isLoading,
    fromLang,
    toLang,
    isSwapActive,
    toast,
    handleSwapLanguages,
  ]);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

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
    // Always swap current fromLang and toLang bidirectionally
    const newFromLang = toLang;
    const newToLang = fromLang;
    setFromLang(newFromLang);
    setToLang(newToLang);
    localStorage.setItem(STORAGE_KEYS.FROM_LANG, newFromLang);
    localStorage.setItem(STORAGE_KEYS.TO_LANG, newToLang);
  };

  const playTranslation = async (
    text: string,
    index: number,
    targetLang: string,
  ) => {
    try {
      setIsPlaying(index);
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          toLang: targetLang,
        }),
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
      // Remove language parameter to let Whisper auto-detect

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.text) {
        // Let the translation API auto-detect the language
        const translationResponse = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: data.text,
            toLang,
          }),
        });

        const translationData = await translationResponse.json();

        if (translationData.translation) {
          const [translation, ...culturalNotes] =
            translationData.translation.split("\nCONTEXT:");

          const detectedFromLang = translationData.detectedLang || "en";

          // Update the fromLang with detected language
          setFromLang(detectedFromLang);
          localStorage.setItem(STORAGE_KEYS.FROM_LANG, detectedFromLang);

          const newMessage = {
            id: Math.random().toString(36).substr(2, 9),
            text: data.text,
            translation: translation.replace("TRANSLATION:", "").trim(),
            cultural: culturalNotes.length
              ? culturalNotes.join("\n").trim()
              : undefined,
            fromLang: detectedFromLang,
            toLang,
            timestamp: Date.now(),
          };

          setMessages((prev) => [...prev, newMessage]);

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
      if (permissionState.status === "denied") {
        toast({
          title: "Microphone Access Denied",
          description:
            "Please enable microphone access in your browser settings to use voice input.",
          variant: "destructive",
        });
        return;
      }

      if (permissionState.status === "prompt") {
        const granted = await requestPermission();
        if (!granted) return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: AUDIO_CONSTRAINTS,
      });

      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      setIsRecording(true);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages.length]); // Add messages.length as dependency

  useEffect(() => {
    if (mounted && messagesEndRef.current && messages.length > 0) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      });
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShowPrevious = () => {
    setShowPrevious(!showPrevious);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex grow flex-col">
      <div className="relative flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 pt-20 flex flex-col items-center">
          {reversedMessages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="mb-2 mt-1 h-8 w-8 rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white/95 backdrop-blur-sm"
              onClick={handleShowPrevious}
            >
              <ChevronUp
                className={cn(
                  "h-4 w-4 text-gray-400 transition-transform duration-200",
                  showPrevious && "rotate-180",
                )}
              />
            </Button>
          )}

          {/* Previous translation */}
          <div className="w-full">
            {showPrevious &&
              reversedMessages.length > 1 &&
              reversedMessages.slice(1).map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "w-full transition-all duration-300",
                    "opacity-0 translate-y-4",
                    showPrevious && "opacity-100 translate-y-0",
                  )}
                >
                  <MessageBubble
                    text={message.text}
                    translation={message.translation}
                    fromLang={message.fromLang}
                    toLang={message.toLang}
                    cultural={message.cultural}
                    isPlaying={isPlaying === index + 1}
                    onPlay={() =>
                      playTranslation(
                        message.translation,
                        index + 1,
                        message.toLang,
                      )
                    }
                    onDelete={() => handleDeleteMessage(message.id)}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Current translation */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8 mt-4">
          <div ref={messagesEndRef} />
          {reversedMessages.length > 0 && (
            <div className="w-full">
              {reversedMessages[0] && (
                <MessageBubble
                  text={reversedMessages[0].text}
                  translation={reversedMessages[0].translation}
                  fromLang={reversedMessages[0].fromLang}
                  toLang={reversedMessages[0].toLang}
                  cultural={reversedMessages[0].cultural}
                  isPlaying={isPlaying === 0}
                  onPlay={() =>
                    playTranslation(
                      reversedMessages[0].translation,
                      0,
                      reversedMessages[0].toLang,
                    )
                  }
                  onDelete={() => handleDeleteMessage(reversedMessages[0].id)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-background fixed inset-x-0 bottom-0 space-y-3 px-4 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <div className="mx-auto w-full max-w-5xl space-y-3">
          <div className="flex w-full justify-between gap-2">
            <Button
              variant="outline"
              className="w-32 justify-between bg-white hover:bg-accent relative text-sm opacity-75"
              disabled
            >
              <div className="flex items-center gap-1.5">
                {messages.length > 0 && messages[messages.length - 1]?.fromLang ? (
                  <>
                    <Globe className="h-3.5 w-3.5" />
                    <span className="text-xs truncate">{supportedLanguages.find(l => l.code === messages[messages.length - 1].fromLang)?.name}</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-3.5 w-3.5" />
                    <span className="text-xs">Automatic</span>
                  </>
                )}
              </div>
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                className={cn("mx-2", {
                  "bg-green-600 text-white": isSwapActive && !isSwapActiveFirst,
                  "bg-red-600 text-white": !isSwapActive && !isSwapActiveFirst,
                  "bg-transparent": isSwapActiveFirst,
                })}
                onClick={handleButtonClick}
              >
                <RotateCcw className="h-4 w-4" />
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
            <div className="relative flex-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-accent",
                  isTranslating && "opacity-50 pointer-events-none",
                )}
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setInputText(text);
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to paste text",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                </svg>
              </Button>
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type to translate..."
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                className="text-lg pl-12"
                style={{
                  fontSize: "16px",
                  background: isTranslating
                    ? "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)"
                    : "transparent",
                }}
                disabled={isLoading}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const imageUpload = document.getElementById("imageUpload");
                if (imageUpload) {
                  imageUpload.click();
                }
              }}
              className="shrink-0"
              disabled={isLoading}
            >
              <Camera className="h-4 w-4" />
              <input
                type="file"
                id="imageUpload"
                className="hidden"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    setIsLoading(true);
                    setIsImageProcessing(true);
                    toast({
                      title: "Processing Image",
                      description: "Analyzing and translating content...",
                    });
                    const reader = new FileReader();

                    reader.onloadend = async () => {
                      try {
                        const base64Image = reader.result as string;

                        // Show loading state before API call
                        setIsTranslating(true);

                        const response = await fetch("/api/analyze-image", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            image: base64Image,
                            toLang,
                          }),
                        });

                        const data = await response.json();
                        if (
                          data.text &&
                          data.translation &&
                          data.detectedLang
                        ) {
                          // Update the fromLang with detected language
                          setFromLang(data.detectedLang);
                          localStorage.setItem(
                            STORAGE_KEYS.FROM_LANG,
                            data.detectedLang,
                          );

                          const [translation, ...culturalNotes] =
                            data.translation.split("\nCONTEXT:");

                          const newMessage = {
                            id: Math.random().toString(36).substr(2, 9),
                            text: data.text,
                            translation: translation
                              .replace("TRANSLATION:", "")
                              .trim(),
                            cultural: culturalNotes.length
                              ? culturalNotes.join("\n").trim()
                              : undefined,
                            fromLang: data.detectedLang,
                            toLang,
                            timestamp: Date.now(),
                          };

                          setMessages((prev) => [...prev, newMessage]);

                          if (isSwapActive) {
                            handleSwapLanguages();
                          }
                        }
                      } catch (error) {
                        console.error("Image analysis error:", error);
                        toast({
                          title: "Error",
                          description: "Failed to analyze image",
                          variant: "destructive",
                        });
                      } finally {
                        setIsImageProcessing(false);
                        setIsTranslating(false);
                        setIsLoading(false);
                      }
                    };
                    reader.readAsDataURL(file);
                  } catch (error) {
                    console.error("Image analysis error:", error);
                    toast({
                      title: "Error",
                      description: "Failed to analyze image",
                      variant: "destructive",
                    });
                    setIsImageProcessing(false);
                    setIsTranslating(false);
                    setIsLoading(false);
                  } finally {
                    e.target.value = ""; // Reset file input
                  }
                }}
              />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              className={cn(
                "shrink-0 transition-colors duration-200",
                isRecording &&
                  "bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600",
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

      {isLoading && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] bg-white/95 px-6 py-3 rounded-full shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">
              {isImageProcessing ? "Processing image..." : "Translating..."}
            </span>
          </div>
        </div>
      )}
      {(isTranslating || isImageProcessing) && !isLoading && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] bg-white/95 px-6 py-3 rounded-full shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">
              {isImageProcessing ? "Processing image..." : "Translating..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
