"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, Instagram, X, LogIn } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { AuthDialog } from "./auth/auth-dialog";
import { UserDropdown } from "./auth/user-dropdown";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user, loading } = useAuth();

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    },
    [menuOpen],
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
