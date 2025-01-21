"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, Facebook, Twitter, Linkedin, Send, MessageCircle } from "lucide-react";
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
    icon: <Send className="h-4 w-4" />,
    color: "bg-[#25D366] hover:bg-[#128C7E]",
    getShareUrl: (url) => `whatsapp://send?text=${encodeURIComponent(url)}`,
  },
  {
    name: "Telegram",
    icon: <Send className="h-4 w-4" />,
    color: "bg-[#0088cc] hover:bg-[#0077b3]",
    getShareUrl: (url) => `tg://msg?text=${encodeURIComponent(url)}`,
  },
  {
    name: "LINE",
    icon: <MessageCircle className="h-4 w-4" />,
    color: "bg-[#00B900] hover:bg-[#009900]",
    getShareUrl: (url) => `line://msg/text/?${encodeURIComponent(url)}`,
  },
  {
    name: "X (Twitter)",
    icon: <Twitter className="h-4 w-4" />,
    color: "bg-black hover:bg-gray-900",
    getShareUrl: (url) => `twitter://post?message=${encodeURIComponent(url)}`,
  },
  {
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    color: "bg-[#1877F2] hover:bg-[#166FE5]",
    getShareUrl: (url) => `fb://share?link=${encodeURIComponent(url)}`,
  },
  {
    name: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    color: "bg-[#0A66C2] hover:bg-[#004182]",
    getShareUrl: (url) => `linkedin://shareArticle?mini=true&url=${encodeURIComponent(url)}`,
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
    try {
      // Try app URL scheme first
      window.location.href = shareButton.getShareUrl(shareUrl);
    } catch (error) {
      console.error('Failed to open app:', error);
      // Fallback to web URLs if app scheme fails
      const webUrls = {
        'WhatsApp': `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
        'Telegram': `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
        'LINE': `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`,
        'X (Twitter)': `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
        'Facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        'LinkedIn': `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      };
      
      if (webUrls[shareButton.name]) {
        window.open(
          webUrls[shareButton.name],
          `Share on ${shareButton.name}`,
          'width=600,height=400,location=0,menubar=0'
        );
      }
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

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-3">Share on social media</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {shareButtons.map((button) => (
                <Button
                  key={button.name}
                  onClick={() => handleShare(button)}
                  className={cn(
                    "h-10 w-10 p-0 text-white transition-all duration-200",
                    button.color
                  )}
                >
                  {button.icon}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
