"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { AppDownloadMenu } from "./app-download-menu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    },
    [menuOpen],
  );

  const playMeow = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default link behavior
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
      backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent white
    }}
        />

        {/* Header content */}
        <div className="relative mx-auto flex w-full max-w-5xl items-center justify-between p-2">
          {/* Logo container - now consistently left-aligned */}
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

          {/* Menu button */}
          <div className="flex items-center gap-2">
            <AppDownloadMenu />
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
          className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ${
            menuOpen ? "pointer-events-auto opacity-50" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Content */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            ref={menuRef}
            className={`mx-4 w-11/12 max-w-[600px] transform rounded-2xl bg-white/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 md:w-[600px] ${
              menuOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
            }`}
            style={{
              WebkitBackdropFilter: 'saturate(180%) blur(20px)',
              backdropFilter: 'saturate(180%) blur(20px)',
            }}
          >
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

            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100/80"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/news"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100/80"
                onClick={() => setMenuOpen(false)}
              >
                News
              </Link>
              <a
                href="https://obey24.com/agbs/"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </a>
              <a
                href="https://obey24.com/datenschutz/"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="https://obey24.com/impressum/"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                Imprint
              </a>
              <a
                href="mailto:info@ulocat.com"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100/80"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback
              </a>
              <Button
                onClick={() => setMenuOpen(false)}
                variant="outline"
                className="mt-4 w-full transition-colors hover:bg-gray-100/80"
              >
                Close Menu
              </Button>
              <div className="text-center">
                <span className="text-[10px] text-gray-500">
                  Ulocat is powered by{" "}
                  <a
                    href="https://obey24.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-800"
                  >
                    Obey24.com
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio element for meow sound */}
        <audio ref={audioRef} preload="auto">
          <source src="/sweet_meow.mp3" type="audio/mpeg" />
        </audio>
      </header>
    </>
  );
}
