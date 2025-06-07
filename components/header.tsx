"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, Instagram, X, LogIn, History, Trash2, Volume2 } from "lucide-react";
import { getStoredMessages, storeMessages } from "@/lib/storage";
import type { TranslationMessage } from "@/lib/types";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "./auth/auth-dialog";
import { UserDropdown } from "./auth/user-dropdown";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "./ui/use-toast";

interface HistoryItemProps {
  message: TranslationMessage;
  onDelete: (id: string) => void;
  onSelect: (message: TranslationMessage) => void;
}

function HistoryItem({ message, onDelete, onSelect }: HistoryItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const { toast } = useToast();

  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(message.id);
      toast({
        title: "Translation deleted",
        description: "The translation has been removed from history",
      });
    }, 200);
  }, [onDelete, message.id, toast]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    const clampedX = Math.max(-120, Math.min(0, deltaX));
    setSwipeX(clampedX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (swipeX < -60) {
      // Swipe threshold reached - delete
      handleDelete();
    } else {
      // Snap back
      setSwipeX(0);
    }
  }, [isDragging, swipeX, handleDelete]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startXRef.current;
    const clampedX = Math.max(-120, Math.min(0, deltaX));
    setSwipeX(clampedX);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (swipeX < -60) {
      handleDelete();
    } else {
      setSwipeX(0);
    }
  }, [isDragging, swipeX, handleDelete]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div 
      ref={itemRef}
      className={cn(
        "relative overflow-hidden rounded-lg transition-all duration-200",
        isDeleting && "opacity-0 scale-95 translate-x-[-100%]"
      )}
    >
      {/* Delete background */}
      <div className="absolute inset-y-0 right-0 w-24 bg-red-500 flex items-center justify-center">
        <Trash2 className="h-5 w-5 text-white" />
      </div>

      {/* Main content */}
      <div
        className={cn(
          "relative bg-white/50 border border-gray-100/50 p-3 cursor-pointer transition-all duration-200",
          "hover:bg-white/80 hover:shadow-sm",
          isDragging && "shadow-md"
        )}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={() => !isDragging && Math.abs(swipeX) < 5 && onSelect(message)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate mb-1">
              {message.text}
            </p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {message.translation}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">
                {message.fromLang.toUpperCase()} → {message.toLang.toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="h-3 w-3 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyMessages, setHistoryMessages] = useState<TranslationMessage[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (historyOpen && historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setHistoryOpen(false);
      }
    },
    [menuOpen, historyOpen],
  );

  const playMeow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = historyMessages.filter(msg => msg.id !== messageId);
    setHistoryMessages(updatedMessages);
    storeMessages(updatedMessages);
  };

  const handleSelectMessage = (message: TranslationMessage) => {
    // Close history sidebar
    setHistoryOpen(false);
    
    // You could emit an event or use a callback to populate the main interface
    // For now, we'll just show a toast
    toast({
      title: "Translation selected",
      description: "Translation loaded in main interface",
    });
    
    // Trigger custom event to notify the main interface
    window.dispatchEvent(new CustomEvent('selectHistoryMessage', {
      detail: message
    }));
  };

  useEffect(() => {
    if (historyOpen) {
      setHistoryMessages(getStoredMessages());
    }
  }, [historyOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7026535539086017"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      <header className="fixed inset-x-0 top-0 z-50">
        {/* Backdrop blur container */}
        <div 
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            WebkitBackdropFilter: 'saturate(180%) blur(10px)',
            backdropFilter: 'saturate(180%) blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
          }}
        />

        {/* Header content */}
        <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between p-2">
          {/* Logo container */}
          <div className="flex items-center gap-2">
            <Link 
              href="#" 
              className="inline-block"
              onClick={playMeow}
            >
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-12 w-auto transition-transform duration-200 hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Tagline - hidden on mobile */}
          <div className="hidden flex-1 justify-center md:flex">
            <span className="text-[10px] text-black/60">
              Speak Naturally. Connect Globally.
            </span>
          </div>

          {/* Auth and Menu buttons */}
          <div className="flex items-center gap-2">
            {!loading && (
              <>
                {user ? (
                  <UserDropdown />
                ) : (
                  <Button 
                    onClick={() => setAuthDialogOpen(true)} 
                    variant="outline" 
                    size="sm"
                    className="hidden sm:flex"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                )}
              </>
            )}
            <Button
              onClick={() => setHistoryOpen(!historyOpen)}
              variant="ghost"
              className="hover:bg-black/5 relative"
            >
              <History className="h-6 w-6" />
              {historyMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {Math.min(historyMessages.length, 99)}
                </span>
              )}
            </Button>
            <Button
              onClick={() => setMenuOpen(!menuOpen)}
              variant="ghost"
              className="hover:bg-black/5"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Menu Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* History Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
            historyOpen ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setHistoryOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform transition-all duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ zIndex: 100 }}
        >
          <div
            ref={menuRef}
            className="h-full w-full bg-white/95 p-6 shadow-2xl backdrop-blur-xl"
            style={{
              WebkitBackdropFilter: 'saturate(180%) blur(20px)',
              backdropFilter: 'saturate(180%) blur(20px)',
              position: 'relative'
            }}
          >
            <Button
              onClick={() => setMenuOpen(false)}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/95 shadow-lg transition-colors hover:bg-gray-100/80"
              style={{ zIndex: 110 }}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="mb-8 mt-2">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            </div>

            {!user && !loading && (
              <div className="mb-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    setAuthDialogOpen(true);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In / Create Account
                </Button>
              </div>
            )}

            <div className="mb-6 rounded-xl border border-gray-200/50 bg-gray-50/50 p-4 text-center backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Quick Tips
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">
                    <span className="mb-1 block font-medium">Voice Input</span>
                    Tap microphone → Speak → Tap again
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">
                    <span className="mb-1 block font-medium">Auto Switch</span>
                    Double-click switch icon to toggle
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="mb-2 px-2 text-xs font-medium uppercase text-gray-500">
                Navigation
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-100/80"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/news"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-100/80"
                onClick={() => setMenuOpen(false)}
              >
                News
              </Link>
              
              <div className="mt-4 mb-2 px-2 text-xs font-medium uppercase text-gray-500">
                Social & Support
              </div>
              <a
                href="mailto:info@ulocat.com"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-100/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback
              </a>
              <a
                href="https://www.instagram.com/ulocatcom/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-100/80"
              >
                <Instagram className="h-5 w-5" />
                Instagram
              </a>

              <div className="mt-auto pt-8">
                <div className="flex flex-wrap justify-center gap-4 border-t border-gray-100 pt-4 text-[11px] text-gray-500">
                  <a
                    href="https://obey24.com/agbs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700"
                  >
                    Terms
                  </a>
                  <a
                    href="https://obey24.com/datenschutz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700"
                  >
                    Privacy
                  </a>
                  <a
                    href="https://obey24.com/impressum/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700"
                  >
                    Imprint
                  </a>
                </div>
                <div className="mt-2 text-center text-[11px] text-gray-500">
                  Ulocat is powered by{" "}
                  <a
                    href="https://obey24.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700"
                  >
                    Obey24.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Content - Improved */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-full max-w-sm transform transition-all duration-300 ease-in-out ${
            historyOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ zIndex: 100 }}
        >
          <div
            ref={historyRef}
            className="h-full w-full bg-white/95 shadow-2xl backdrop-blur-xl"
            style={{
              WebkitBackdropFilter: 'saturate(180%) blur(20px)',
              backdropFilter: 'saturate(180%) blur(20px)',
              position: 'relative'
            }}
          >
            <div className="p-4 border-b border-gray-100/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Translation History</h2>
                <Button
                  onClick={() => setHistoryOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/95 shadow-sm transition-colors hover:bg-gray-100/80"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {historyMessages.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {historyMessages.length} translation{historyMessages.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-4 space-y-3">
                {historyMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">No history yet</h3>
                    <p className="text-sm text-gray-400">
                      Your translations will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 mb-3 px-1">
                      Tap to view • Swipe left to delete
                    </p>
                    {historyMessages.map((msg) => (
                      <HistoryItem
                        key={msg.id}
                        message={msg}
                        onDelete={handleDeleteMessage}
                        onSelect={handleSelectMessage}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Auth Dialog */}
        <AuthDialog 
          isOpen={authDialogOpen} 
          onClose={() => setAuthDialogOpen(false)} 
        />

        {/* Audio element for meow sound */}
        <audio ref={audioRef} preload="auto">
          <source src="/sweet_meow.mp3" type="audio/mpeg" />
        </audio>
      </header>
    </>
  );
}
