"use client";

import { useState, useEffect } from "react";
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
  const { resolver, verifyMFALogin, prepareMFAVerification } = useAuth();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  useEffect(() => {
    if (resolver) {
      // Get the phone number from the hint if available
      const hint = resolver.hints[0];
      if (hint && hint.phoneNumber) {
        setPhoneNumber(hint.phoneNumber);
      }
      
      // Start verification process automatically
      handleStartVerification();
    }
  }, [resolver]);

  const handleStartVerification = async () => {
    if (!resolver) return;
    
    try {
      // Create a div for the invisible reCAPTCHA
      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'recaptcha-container';
      document.body.appendChild(recaptchaContainer);
      
      // Start verification process
      const verificationId = await prepareMFAVerification(phoneNumber);
      setVerificationId(verificationId);
      
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
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
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Verification code required",
        description: "Please enter the verification code sent to your phone",
      });
      return;
    }

    setIsVerifying(true);
    try {
      await verifyMFALogin(verificationCode);
      
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

  if (!resolver) {
    return null;
  }

  return (
    <Dialog open={!!resolver} onOpenChange={() => {}}>
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
              onChange={(e) => setVerificationCode(e.target.value)}
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