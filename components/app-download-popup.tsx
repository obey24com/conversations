"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Apple, PlaySquare, X } from "lucide-react";
import { STORAGE_KEYS, STORE_URLS } from "@/lib/constants";

export function AppDownloadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem(STORAGE_KEYS.APP_POPUP_SEEN);
    
    const checkIfMobile = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    };

    setIsMobile(checkIfMobile());

    // Only show on desktop devices that haven't seen it
    if (!checkIfMobile() && !hasSeenPopup) {
      setIsOpen(true);
      localStorage.setItem(STORAGE_KEYS.APP_POPUP_SEEN, "true");
    }
  }, []);

  if (isMobile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-center text-xl font-semibold">
          Get the ULOCAT App
        </DialogTitle>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="space-y-4 py-4">
            <p className="text-center text-sm text-muted-foreground">
              Download our mobile app for a better translation experience
            </p>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                asChild
              >
                <a href={STORE_URLS.APP_STORE} target="_blank" rel="noopener noreferrer">
                  <Apple className="h-5 w-5" />
                  App Store
                </a>
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 gap-2"
                asChild
              >
                <a
                  href={STORE_URLS.PLAY_STORE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlaySquare className="h-5 w-5" />
                  Play Store
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
