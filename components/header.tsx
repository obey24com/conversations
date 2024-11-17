"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    },
    [menuOpen],
  );

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

      <div className="sticky top-0 z-50 mx-auto flex w-full max-w-5xl items-center justify-between border-b border-white/10 p-2">
        <div className="hidden flex-1 text-left md:flex">
          <span className="text-muted-foreground/70 text-[10px]">
            Speak Naturally. Connect Globally.
          </span>
        </div>
        <div className="flex-1 text-center">
          <div className="relative h-12 w-auto">
            <Link href="https://ulocat.com">
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="md:mx-auto"
                priority
              />
            </Link>
          </div>
        </div>
        <div className="flex-1 text-end">
          <Button onClick={() => setMenuOpen(!menuOpen)} variant="outline">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Menu Overlay with Animation */}
        <div
          className={`fixed inset-0 z-50 bg-black transition-opacity duration-300 ${
            menuOpen
              ? "pointer-events-auto opacity-70"
              : "pointer-events-none opacity-0"
          }`}
        />

        {/* Menu Content */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            ref={menuRef}
            className={`mx-4 w-11/12 max-w-[600px] transform rounded-lg bg-white p-6 shadow-lg transition-all duration-300 md:w-[600px] ${
              menuOpen
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-4 scale-95 opacity-0"
            }`}
          >
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
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
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/news"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                News
              </Link>
              <a
                href="https://obey24.com/agbs/"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </a>
              <a
                href="https://obey24.com/datenschutz/"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="https://obey24.com/impressum/"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                Imprint
              </a>
              <a
                href="mailto:info@ulocat.com"
                className="rounded-lg py-2 text-center text-gray-700 transition-colors hover:bg-gray-100"
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
                <span className="text-muted-foreground/70 text-[10px]">
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
      </div>
    </>
  );
}
