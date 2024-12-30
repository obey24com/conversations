"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Apple, Download, PlaySquare } from "lucide-react";
import { STORE_URLS } from "@/lib/constants";
import { useState } from "react";

export function AppDownloadMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-black/5"
          onClick={() => setIsOpen(true)}
        >
          <Download className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Get the ULOCAT App</SheetTitle>
        </SheetHeader>
        <div className="space-y-8 py-8">
          <p className="text-muted-foreground">
            Download our mobile app for a better translation experience on the go
          </p>
          
          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start gap-2"
              asChild
            >
              <a 
                href={STORE_URLS.APP_STORE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                <Apple className="h-5 w-5" />
                Download on App Store
              </a>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start gap-2"
              asChild
            >
              <a
                href={STORE_URLS.PLAY_STORE}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                <PlaySquare className="h-5 w-5" />
                Get it on Play Store
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
