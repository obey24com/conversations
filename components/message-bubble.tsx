"use client";

import { Button } from '@/components/ui/button';
import { Volume2, Copy, X, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useState, useRef, useEffect } from 'react';
import { createSharedMessage } from '@/lib/firebase/messages';
import type { TranslationMessage } from '@/lib/types';
import { ShareDialog } from './share-dialog';
import { Loader2 } from 'lucide-react';

export interface MessageBubbleProps {
  text: string;
  translation: string;
  fromLang: string;
  toLang: string;
  cultural?: string;
  isPlaying: boolean;
  onPlay: () => void;
  onDelete: () => void;
  hideDelete?: boolean;
  hideShare?: boolean;
}

export function MessageBubble({ 
  text, 
  translation,
  fromLang,
  toLang, 
  cultural, 
  isPlaying, 
  onPlay,
  onDelete,
  hideDelete = false,
  hideShare = false,
}: MessageBubbleProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const heightRef = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (bubbleRef.current) {
        heightRef.current = bubbleRef.current.offsetHeight;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      setShareLoading(true);
      let success = false;

      const message: TranslationMessage = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        translation,
        fromLang,
        toLang,
        cultural,
        timestamp: Date.now(),
      };

      const shareId = await createSharedMessage(message);

      if (shareId) {
        const shareUrl = `${window.location.origin}/share/${shareId}`;
        setShareUrl(shareUrl);
        success = true;
        setShowShareDialog(true);
        
        try {
          await navigator.clipboard.writeText(shareUrl);
          if (success) {
            toast({
              title: "Link copied!",
              description: "Share this link with others to show them your translation",
            });
          }
        } catch (clipboardError) {
          console.error('Clipboard error:', clipboardError);
          // Still show dialog even if copy fails
          if (success) {
            setShowShareDialog(true);
          }
        }
      } else {
        throw new Error('Could not generate share link');
      }
    } catch (error) {
      console.error('Share error:', error);
      // Only show error toast if we actually failed to generate the link
      if (!shareUrl) {
        toast({
          title: "Error",
          description: "Please try sharing again",
          variant: "destructive",
        });
      }
    } finally {
      setShareLoading(false);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    
    // Set the height CSS variable for the animation
    if (bubbleRef.current && heightRef.current) {
      bubbleRef.current.style.setProperty('--message-height', `${heightRef.current}px`);
    }

    // Wait for animation to complete before removing
    setTimeout(() => {
      onDelete();
    }, 500);
  };

  return (
    <div 
      ref={bubbleRef}
      className={cn(
        "mb-4",
        "opacity-0 translate-y-4",
        isVisible && "opacity-100 translate-y-0",
        isDeleting && "message-delete pointer-events-none"
      )}
    >
      <div 
        className={cn(
          "group relative p-8 rounded-2xl w-full max-w-[90%] mx-auto",
          "pr-20 md:pr-24", // Add right padding for icons
          "bg-white border border-gray-100 shadow-sm",
          "hover:shadow-lg transition-shadow duration-200"
        )}
      >
        {/* Mobile buttons - always visible at top */}
        <div className="md:hidden absolute -top-2 left-4 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/95 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
            onClick={onPlay}
          >
            <Volume2 className={cn(
              "h-4 w-4 transition-transform duration-500",
              isPlaying && "text-blue-500 animate-[wave_2s_ease-in-out_infinite]"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/95 shadow-sm hover:shadow-md backdrop-blur-sm"
            onClick={() => copyToClipboard(translation)}
          >
            <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </Button>
          
          {!hideShare && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/95 shadow-sm hover:shadow-md backdrop-blur-sm"
              onClick={handleShare}
              disabled={shareLoading}
            >
              <Share2 className={cn(
                "h-4 w-4 transition-all duration-300",
                shareLoading ? "animate-spin text-blue-500" : "text-gray-400 hover:text-gray-600"
              )} />
            </Button>
          )}
        </div>

        {/* Desktop buttons - right side, always visible */}
        <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-white/95 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
            onClick={onPlay}
          >
            <Volume2 className={cn(
              "h-4 w-4 transition-transform duration-500",
              isPlaying && "text-blue-500 animate-[wave_2s_ease-in-out_infinite]",
              "hover:scale-110"
            )} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-white/95 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
            onClick={() => copyToClipboard(translation)}
          >
            <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600 hover:scale-110" />
          </Button>
          
          {!hideShare && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 bg-white/95 shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm"
              onClick={handleShare}
              disabled={shareLoading}
            >
              <Share2 className={cn(
                "h-4 w-4 transition-all duration-300",
                shareLoading ? "animate-spin text-blue-500" : "text-gray-400 hover:text-gray-600 hover:scale-110"
              )} />
            </Button>
          )}
        </div>

        {/* Close button - top right, visible on hover for desktop */}
        {!hideDelete && (
        <div className={cn(
          "absolute -top-2 right-4",
          "md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
        )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white/95 shadow-sm hover:shadow-md backdrop-blur-sm"
            onClick={handleDelete}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </Button>
        </div>
        )}

        <p className="text-sm text-gray-500 mb-4">{text}</p>
        <div className="mt-3 pr-2">
          <p className="text-lg font-medium text-gray-900 leading-relaxed">{translation}</p>

          {cultural && (
            <p className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 italic leading-relaxed">
              {cultural}
            </p>
          )}
        </div>
      </div>
      
      {shareUrl && (
        <ShareDialog
          isOpen={showShareDialog}
          onOpenChange={setShowShareDialog}
          shareUrl={shareUrl}
        />
      )}
    </div>
  );
}
