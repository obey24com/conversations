"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, Download } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

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
          <div className="flex items-center">
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-black/5">
                  <Download className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Download ULOCAT Mobile App</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.ulocatbyobey24com.ulocat&pcampaignid=web_share"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-transform hover:scale-105"
                  >
                    <Button className="w-full h-14 bg-black hover:bg-black/90">
                      <div className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                          <path d="M3.609 1.814L13.792 12 3.61 22.186a2.016 2.016 0 0 1-.02-2.629L8.82 12 3.592 4.445a2.016 2.016 0 0 1 .017-2.63zm13.444 2.814l2.032 3.006c.62.918.62 2.148 0 3.066l-2.032 3.006-3.354-3.944L17.053 4.63zM3.825.333a1.995 1.995 0 0 0-1.152.373A2.016 2.016 0 0 0 2 2.234v19.532c0 .62.283 1.204.673 1.528.39.324.894.473 1.152.373l7.931-4.12L3.825.334zm9.968 5.29l-2.839 3.384 2.839 3.384 3.119-1.62a2.016 2.016 0 0 0 0-3.528l-3.119-1.62z" />
                        </svg>
                        <div className="flex flex-col items-start">
                          <span className="text-xs">GET IT ON</span>
                          <span className="text-lg font-semibold">Google Play</span>
                        </div>
                      </div>
                    </Button>
                  </a>
                  <Button 
                    className="w-full h-14 bg-black hover:bg-black/90 opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <div className="flex items-center gap-3">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                        <path d="M11.624 7.222c-.876 0-2.232-.996-3.66-.96-1.884.024-3.612 1.092-4.584 2.784-1.956 3.396-.504 8.412 1.404 11.172.936 1.344 2.04 2.856 3.504 2.808 1.404-.06 1.932-.912 3.636-.912 1.692 0 2.172.912 3.66.876 1.512-.024 2.472-1.368 3.396-2.724 1.068-1.56 1.512-3.072 1.536-3.156-.036-.012-2.94-1.128-2.976-4.488-.024-2.808 2.292-4.152 2.4-4.212-1.32-1.932-3.348-2.148-4.056-2.196-1.848-.144-3.396 1.008-4.26 1.008zm3.12-2.832c.78-.936 1.296-2.244 1.152-3.54-1.116.048-2.46.744-3.264 1.68-.72.828-1.344 2.16-1.176 3.432 1.236.096 2.508-.636 3.288-1.572z" />
                      </svg>
                      <div className="flex flex-col items-start">
                        <span className="text-xs">Download on the</span>
                        <span className="text-lg font-semibold">App Store</span>
                      </div>
                    </div>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    iOS app coming soon!
                  </p>
                </div>
              </SheetContent>
            </Sheet>
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
