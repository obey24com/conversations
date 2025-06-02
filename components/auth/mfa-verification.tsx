"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function MFAVerification() {
  const auth = useAuth();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Memoize handleStartVerification to avoid dependency issues
  const handleStartVerification = useCallback(async () => {
    if (!(auth as any).verifyMFALogin) return;
    
    try {
      // Create a div for the invisible reCAPTCHA
      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'recaptcha-container';
      document.body.appendChild(recaptchaContainer);
      
      // Start verification process - if this prepareMFAVerification is available
      if ((auth as any).prepareMFAVerification) {
        const verificationId = await (auth as any).prepareMFAVerification(phoneNumber);
        setVerificationId(verificationId);
        
        toast({
          title: "Verification code sent",
          description: "Please check your phone for the verification code",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send verification code",
        description: error.message || "There was an error sending the verification code",
      });
    } finally {
      // Clean up the reCAPTCHA container
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        document.body.removeChild(recaptchaContainer);
      }
    }
  }, [phoneNumber, toast, auth]);

  useEffect(() => {
    // If MFA verification methods exist and there's a multi-factor challenge
    const hasMultiFactorChallenge = (auth as any).verifyMFALogin !== undefined;
    
    if (hasMultiFactorChallenge) {
      // Try to get the phone number if available
      try {
        // Use existing phoneNumber state or empty string
        const userPhone = phoneNumber || "";
        if (userPhone) {
          setPhoneNumber(userPhone);
        }
      } catch (e) {
        // Ignore errors when trying to get phone number
      }
      
      // Start verification process automatically
      handleStartVerification();
    }
  }, [handleStartVerification, auth, phoneNumber]);

  const handleVerifyCode = async () => {
    if (!verificationCode || !(auth as any).verifyMFALogin) {
      toast({
        variant: "destructive",
        title: "Verification code required",
        description: "Please enter the verification code sent to your phone",
      });
      return;
    }

    setIsVerifying(true);
    try {
      await (auth as any).verifyMFALogin(verificationCode);
      
      toast({
        title: "Verification successful",
        description: "You have been successfully signed in",
      });
      
      // Reset form
      setVerificationCode("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message || "There was an error verifying the code",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Only show dialog if MFA verification is available
  const showMFADialog = (auth as any).verifyMFALogin !== undefined;
  
  if (!showMFADialog) {
    return null;
  }

  return (
    <Dialog open={showMFADialog} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Enter the verification code sent to your phone to complete sign-in.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label 
              htmlFor="verification-code" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Verification Code
            </label>
            <Input
              id="verification-code"
              placeholder="6-digit code"
              value={verificationCode}
              onChange={(e: any) => setVerificationCode(e.target.value)}
              maxLength={6}
            />
            <p className="text-xs text-gray-500">
              A verification code has been sent to {phoneNumber || "your phone"}.
            </p>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button
            variant="outline" 
            onClick={handleStartVerification}
            disabled={isVerifying}
            size="sm"
          >
            Resend Code
          </Button>
          <Button 
            onClick={handleVerifyCode}
            disabled={isVerifying || !verificationCode}
          >
            {isVerifying ? "Verifying..." : "Verify & Sign In"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 