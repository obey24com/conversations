"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Image from 'next/image';
import Script from 'next/script';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  }, [menuOpen]);

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
      
      <div className="sticky top-0 flex items-center justify-between bg-white/30 border-b border-white/10 z-50 p-2 max-w-5xl mx-auto w-full">
        <div className="text-left flex-1 md:flex hidden">
          <span className="text-[10px] text-muted-foreground/70">
            Speak Naturally. Connect Globally.
          </span>
        </div>
        <div className="flex-1 text-center">
          <div className="relative h-12 w-auto">
            <Image
              src="/img/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="md:mx-auto"
              priority
            />
          </div>
        </div>
        <div className="flex-1 text-end">
          <Button onClick={() => setMenuOpen(!menuOpen)} variant="outline">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center transition-opacity duration-300 ease-in-out">
            <div
              ref={menuRef}
              className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-[600px] max-w-[600px] transform transition-transform duration-300 ease-in-out mx-4"
            >
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Tips</h3>
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-600">
                      <span className="font-medium block mb-1">Voice Input</span>
                      Tap microphone → Speak → Tap again
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-gray-600">
                      <span className="font-medium block mb-1">Auto Switch</span>
                      Double-click switch icon to toggle
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <a
                  href="/"
                  className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Home
                </a>
                <a
                  href="https://obey24.com/agbs/"
                  className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>
                <a
                  href="https://obey24.com/datenschutz/"
                  className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://obey24.com/impressum/"
                  className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Imprint
                </a>
                <a
                  href="mailto:info@ulocat.com"
                  className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Feedback
                </a>
                <Button
                  onClick={() => setMenuOpen(false)}
                  variant="outline"
                  className="mt-4 w-full"
                >
                  Close Menu
                </Button>
                <div className="text-center">
                  <span className="text-[10px] text-muted-foreground/70">
                    Ulocat is powered by{" "}
                    <a
                      href="https://obey24.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Obey24.com
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
