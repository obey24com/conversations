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
import { Mic, Send, ArrowLeftRight, Volume2, Menu, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supportedLanguages } from "@/lib/languages";
import { ScrollArea } from "./ui/scroll-area";
import Header from "./header";

interface Message {
  text: string;
  translation: string;
  fromLang: string;
  toLang: string;
  cultural?: string;
}

export function TranslationInterface() {
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("es");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0); // Store current playback time

  const scrollRef = useRef<HTMLDivElement>(null); // Reference to the scroll area

  const [isSwapActive, setIsSwapActive] = useState(false); // State to track if swap is active
  const [swapMessage, setSwapMessage] = useState(""); // State for the swap message

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const streamRef = useRef<MediaStream | null>(null);

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
        const [translation, ...culturalNotes] =
          data.translation.split("\nCONTEXT:");

        setMessages((prev) => [
          ...prev,
          {
            text: inputText,
            translation: translation.replace("TRANSLATION:", "").trim(),
            cultural: culturalNotes.length
              ? culturalNotes.join("\n").trim()
              : undefined,
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
    // Swap languages
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const toggleSwapActive = () => {
    setIsSwapActive((prev) => !prev); // Toggle the swap state
  };

  const handleDoubleClick = () => {
    toggleSwapActive(); // Toggle auto-switcher

    setSwapMessage(isSwapActive ? "Auto Switch is OFF" : "Auto Switch is ON");

    // Hide swap message after 3 seconds
    setTimeout(() => {
      setSwapMessage("");
    }, 3000);
  };

  const handleSingleClick = () => {
    handleSwapLanguages(); // Swap languages
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      // Stop the microphone stream after stopping the recording
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    } else {
      startRecording();
    }
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

        // Resetting currentTime if the audio has ended
        audioRef.current.onended = () => {
          setIsPlaying(null);
          setCurrentTime(0);
          URL.revokeObjectURL(audioUrl);
        };

        // Set the current playback time if resuming
        audioRef.current.currentTime = currentTime;

        await audioRef.current.play();

        // Update currentTime while playing
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
      setCurrentTime(0); // Reset current time on error
    }
  };

  const pauseTranslation = () => {
    if (audioRef.current && isPlaying !== null) {
      audioRef.current.pause();
      setIsPlaying(null); // Optionally clear the playing index
    }
  };

  const resumeTranslation = () => {
    if (audioRef.current && currentTime > 0) {
      audioRef.current.play();
      setIsPlaying(isPlaying); // Restore the index when resuming
    }
  };

  const handleSpeechToText = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.mp3");

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
            },
          ]);

          handleSwapLanguages();
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Store the stream reference
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

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 2) {
      // Double click
      handleDoubleClick();
    } else if (event.detail === 1) {
      // Single click
      setTimeout(() => {
        if (event.detail === 1) {
          handleSingleClick();
        }
      }, 500); // Small delay to distinguish between single and double clicks
    }
  };

  // Auto-scroll and fade-in effect for new translations
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling
      });
    }
  }, [messages]);

  // Copy To Clipboard for a message
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

  return (
    <div className="flex flex-col h-screen bg-[#fafafa]">
      {/* ===== Header Start ===== */}
      <Header />

      {/* ===== Transalated Text Showing Box Start ===== */}
      <div className="relative flex-1 overflow-hidden">
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
          className="max-w-5xl mx-auto w-full h-full overflow-y-auto space-y-4 px-4 mb-4 "
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg max-w-[85%] mx-auto transition-opacity duration-500",
                "bg-primary/90 text-primary-foreground",
                index === 0 ? "mt-4" : "",
                "opacity-0 animate-fade-in opacity-100"
              )}
            >
              <p className="text-sm opacity-70">{message.text}</p>
              <div className="mt-2 flex items-start gap-2">
                <p className="font-medium flex-1">{message.translation}</p>
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => {
                      if (isPlaying === index) {
                        pauseTranslation();
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
                    className="shrink-0 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                    aria-label="Copy translation"
                    variant="ghost"
                    size="icon"
                  >
                    <Copy className="h-4 w-4" /> {/* Copy icon */}
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
      {/* ===== Transalated Text Showing Box End ===== */}

      {/* ===== Bottom Part Start ===== */}
      <div className="sticky bottom-0 bg-background shadow-[0_-1px_3px_rgba(0,0,0,0.1)] px-4 py-3 space-y-3">
        <div className="max-w-5xl mx-auto w-full space-y-3">
          {/* ===== Language Switcher Start ===== */}
          <div className="flex gap-2 justify-between w-full">
            <Select value={fromLang} onValueChange={setFromLang}>
              <SelectTrigger className="w-[120px] sm:w-[150px]">
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

            {/* Language Switcher Button */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapLanguages}
              className="shrink-0"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button> */}
            <div className="relative">
              <Button
                variant="outline"
                className={cn(
                  "flex items-center justify-center mx-2 relative",
                  isSwapActive
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                )}
                onClick={handleButtonClick} // Use handleButtonClick for single/double click
              >
                <ArrowLeftRight />
                {swapMessage && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-2 px-3 w-[135px]">
                    {swapMessage}
                  </div>
                )}
              </Button>
            </div>

            <Select value={toLang} onValueChange={setToLang}>
              <SelectTrigger className="w-[120px] sm:w-[150px]">
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
          {/* ===== Language Switcher End ===== */}

          {/* ===== Prompt and microphone section Start ===== */}
          <div className="flex gap-2 w-full">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              className="flex-1 text-lg"
              style={{ fontSize: "16px" }} // Ensure font size is at least 16px
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
          {/* ===== Prompt and microphone section End ===== */}
        </div>
      </div>
      {/* ===== Bottom Part End ===== */}

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
