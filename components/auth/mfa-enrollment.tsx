"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export function MFAEnrollment() {
  const auth = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  // Direct access now works with extended interface
  const mfaEnabled = auth.isMFAEnabled();

  const handleStartEnrollment = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
      });
      return;
    }

    setIsEnrolling(true);
    try {
      const recaptchaContainer = document.createElement('div');
      recaptchaContainer.id = 'recaptcha-container';
      document.body.appendChild(recaptchaContainer);

      const verificationId = await auth.enrollMFA(phoneNumber);
      setVerificationId(verificationId);
      setShowVerificationForm(true);

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
      setIsEnrolling(false);
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (recaptchaContainer) {
        document.body.removeChild(recaptchaContainer);
      }
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !verificationId) {
      toast({
        variant: "destructive",
        title: "Invalid verification code",
        description: "Please enter the verification code sent to your phone",
      });
      return;
    }

    setIsVerifying(true);
    try {
      await auth.verifyMFAEnrollment(verificationCode, verificationId);

      toast({
        title: "Two-factor authentication enabled",
        description: "Your account is now protected with two-factor authentication",
      });

      setPhoneNumber("");
      setVerificationCode("");
      setVerificationId(null);
      setShowVerificationForm(false);
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

  const handleDisableMFA = async () => {
    setIsUnenrolling(true);
    try {
      await auth.unenrollMFA();

      toast({
        title: "Two-factor authentication disabled",
        description: "Your account is no longer protected with two-factor authentication",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to disable two-factor authentication",
        description: error.message || "There was an error disabling two-factor authentication",
      });
    } finally {
      setIsUnenrolling(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            {mfaEnabled ? <ShieldCheck className="h-5 w-5 text-green-500" /> : <Shield className="h-5 w-5" />}
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </div>
        <div>
          <Switch
            id="mfa-enabled"
            checked={mfaEnabled}
            onCheckedChange={(checked: boolean) => {
              if (checked) {
                // Don't do anything - enrollment requires more steps
              } else {
                handleDisableMFA();
              }
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {mfaEnabled ? (
          <div className="flex items-center rounded-md border border-green-100 bg-green-50 p-3">
            <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
            <div className="text-sm text-green-700">
              Two-factor authentication is enabled. Your account is secure.
            </div>
          </div>
        ) : showVerificationForm ? (
          <div className="space-y-4">
            <div className="flex items-center rounded-md border border-blue-100 bg-blue-50 p-3">
              <Shield className="mr-2 h-5 w-5 text-blue-500" />
              <div className="text-sm text-blue-700">
                Enter the verification code sent to your phone.
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="6-digit code"
                value={verificationCode}
                onChange={(e: any) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className="flex justify-between space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVerificationForm(false);
                  setVerificationCode("");
                  setVerificationId(null);
                }}
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleVerifyCode}
                disabled={isVerifying || !verificationCode}
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center rounded-md border border-amber-100 bg-amber-50 p-3">
              <ShieldAlert className="mr-2 h-5 w-5 text-amber-500" />
              <div className="text-sm text-amber-700">
                Your account is not protected with two-factor authentication. We recommend enabling this feature for enhanced security.
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                placeholder="+1 555 123 4567"
                value={phoneNumber}
                onChange={(e: any) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                We&apos;ll send a verification code to this number when you sign in.
              </p>
            </div>
            <Button 
              onClick={handleStartEnrollment}
              disabled={isEnrolling || !phoneNumber}
              className="w-full"
            >
              {isEnrolling ? "Sending code..." : "Enable Two-Factor Authentication"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 