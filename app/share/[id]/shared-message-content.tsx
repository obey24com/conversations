"use client";

import { useEffect, useState } from "react";
import { MessageBubble } from "@/components/message-bubble";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getSharedMessage } from "@/lib/firebase/messages";
import type { SharedMessage } from "@/lib/types";

interface SharedMessageContentProps {
  params: {
    id: string;
  };
}

export function SharedMessageContent({ params }: SharedMessageContentProps) {
  const [message, setMessage] = useState<SharedMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMessage() {
      try {
        const data = await getSharedMessage(params.id);
        if (data) {
          setMessage(data);
        } else {
          setError("Message not found");
        }
      } catch (err) {
        setError("Failed to load message");
      } finally {
        setIsLoading(false);
      }
    }

    loadMessage();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Message Not Found</h1>
        <p className="text-gray-600">This shared message may have expired or been removed.</p>
        <Link href="/">
          <Button size="lg" className="gap-2">
            Try ULOCAT Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="w-full max-w-2xl">
        <MessageBubble
          text={message.text}
          translation={message.translation}
          phonetic={message.phonetic}
          fromLang={message.fromLang}
          toLang={message.toLang}
          cultural={message.cultural}
          isPlaying={false}
          onPlay={() => {}}
          onDelete={() => {}}
          hideDelete
          hideShare
        />

        <div className="mt-8 text-center">
          <Link href="/" className="inline-block">
            <Button size="lg" className="gap-2">
              Translate with ULOCAT
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Experience seamless translation powered by advanced AI
          </p>
        </div>
      </div>
    </div>
  );
}
