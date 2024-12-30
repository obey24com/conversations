"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Apple, PlaySquare } from "lucide-react";
import { useState } from "react";
import { STORE_URLS } from "@/lib/constants";

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
        <div className="py-8 space-y-6">
          <Button
            variant="outline"
            className="w-full opacity-50 cursor-not-allowed"
            disabled
          >
            <Apple className="mr-2 h-5 w-5" />
            iOS App Coming Soon
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(STORE_URLS.PLAY_STORE, '_blank')}
          >
            <PlaySquare className="mr-2 h-5 w-5" />
            Download for Android
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            iOS version coming soon. Android version available now!
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
