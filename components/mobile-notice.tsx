"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function MobileNotice() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768;
      setIsOpen(isMobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]" showClose={false}>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-lg font-semibold">Desktop Version</h2>
            <p className="text-sm text-muted-foreground">
              This version of ULOCAT is optimized for desktop and tablet devices.
            </p>
            <p className="text-sm text-muted-foreground">
              For the best mobile experience, please visit:
            </p>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => window.location.href = "https://ulocat.com"}
            >
              ulocat.com
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
