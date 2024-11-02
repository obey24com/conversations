"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    // Enable Google Analytics
    if (typeof window !== 'undefined') {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
    // Disable Google Analytics
    if (typeof window !== 'undefined') {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
    }
  };

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-sm border-b shadow-sm",
      "transform transition-all duration-500 ease-in-out",
      "animate-in slide-in-from-top"
    )}>
      <div className="max-w-5xl mx-auto p-4 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={closeBanner}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="pr-8">
          <h3 className="font-semibold mb-2">Cookie Settings</h3>
          <p className="text-sm text-muted-foreground mb-4">
            To provide you with the best experience, we use technologies like cookies to store and/or access device information. Consenting to these technologies allows us to process data such as browsing behavior or unique IDs on this website. Not consenting or withdrawing consent may adversely affect certain features and functions.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button onClick={acceptCookies} className="min-w-[120px]">
                Accept
              </Button>
              <Button 
                onClick={declineCookies} 
                variant="outline" 
                className="min-w-[120px]"
              >
                Decline
              </Button>
            </div>
            <div className="flex gap-4 text-sm">
              <a 
                href="https://obey24.com/datenschutz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>
              <a 
                href="https://obey24.com/impressum/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Imprint
              </a>
              <a 
                href="https://obey24.com/agbs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
