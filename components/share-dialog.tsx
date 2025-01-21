"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, Facebook, Twitter, Linkedin, Send, MessageCircle, Instagram } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

interface ShareButton {
  name: string;
  icon: React.ReactNode;
  color: string;
  getShareUrl: (url: string) => string;
}

const shareButtons: ShareButton[] = [
  {
    name: "WhatsApp",
    icon: <Send className="h-4 w-4 rotate-[-45deg]" />,
    color: "bg-[#25D366] hover:bg-[#128C7E]",
    getShareUrl: (url) => `https://wa.me/?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: <Send className="h-4 w-4" />,
    color: "bg-[#0088cc] hover:bg-[#0077b3]",
    getShareUrl: (url) => `https://t.me/share/url?url=${encodeURIComponent(url)}`,
  },
  {
    name: "LINE",
    icon: <MessageCircle className="h-4 w-4" />,
    color: "bg-[#00B900] hover:bg-[#009900]",
    getShareUrl: (url) => `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90",
    getShareUrl: (url) => `instagram://share?text=${encodeURIComponent(url)}`,
  },
  {
    name: "X (Twitter)",
    icon: <Twitter className="h-4 w-4" />,
    color: "bg-black hover:bg-gray-900",
    getShareUrl: (url) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    color: "bg-[#1877F2] hover:bg-[#166FE5]",
    getShareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    color: "bg-[#0A66C2] hover:bg-[#004182]",
    getShareUrl: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
];

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

  const handleShare = (shareButton: ShareButton) => {
    const shareWindowUrl = shareButton.getShareUrl(shareUrl);
    window.open(
      shareWindowUrl,
      `Share on ${shareButton.name}`,
      'width=600,height=400,location=0,menubar=0'
    );
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

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Share on social media</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {shareButtons.map((button) => (
                <Button
                  key={button.name}
                  onClick={() => handleShare(button)}
                  className={cn(
                    "w-full text-white transition-all duration-200 gap-2",
                    button.color
                  )}
                >
                  {button.icon}
                  <span className="text-sm">{button.name}</span>
                </Button>
              ))}
            </div>
            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>Note: Instagram and WeChat sharing may not work on all devices due to platform restrictions.</p>
              <p>For these platforms, you can copy the link and share it manually.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
