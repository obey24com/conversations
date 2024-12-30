"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

export function ShareDialog({ isOpen, onOpenChange, shareUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="share-dialog-description">
        <DialogTitle>Share Translation</DialogTitle>
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="font-mono text-sm select-all"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopy}
              className={cn(
                "transition-all duration-200",
                copied && "bg-green-50 border-green-200"
              )}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p id="share-dialog-description" className="text-sm text-muted-foreground">
            Share this link with others to show them your translation
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
