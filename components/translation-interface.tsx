"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/header";
import { MessageBubble } from "@/components/message-bubble";
import { InputControls } from "@/components/input-controls";
import { LanguageControls } from "@/components/language-controls";
import { cn } from "@/lib/utils";

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
  const [currentTime, setCurrentTime] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

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
        handleSwapLanguages();
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
    setFromLang(toLang);
    setToLang(fromLang);
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

        audioRef.current.ontimeupdate = () => {
          setCurrentTime(audioRef.current?.currentTime || 0);
        };
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
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
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

        <div ref={scrollRef} className="max-w-5xl mx-auto w-full h-full overflow-y-auto space-y-4 px-4 mb-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              text={message.text}
              translation={message.translation}
              cultural={message.cultural}
              isPlaying={isPlaying === index}
              onPlay={() => playTranslation(message.translation, index)}
            />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-background shadow-[0_-1px_3px_rgba(0,0,0,0.1)] px-4 py-3 space-y-3">
        <div className="max-w-5xl mx-auto w-full space-y-3">
          <LanguageControls
            fromLang={fromLang}
            toLang={toLang}
            onFromLangChange={setFromLang}
            onToLangChange={setToLang}
            onSwap={handleSwapLanguages}
          />

          <InputControls
            inputText={inputText}
            isLoading={isLoading}
            isRecording={isRecording}
            onInputChange={setInputText}
            onSend={handleSend}
            onRecord={toggleRecording}
          />
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
