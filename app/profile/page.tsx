"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, updateUserProfile, sendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) return;
    
    setIsUpdating(true);
    try {
      await updateUserProfile(displayName);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "There was an error updating your profile",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    setIsSendingVerification(true);
    try {
      await sendVerificationEmail();
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to send verification email",
        description: error.message || "There was an error sending the verification email",
      });
    } finally {
      setIsSendingVerification(false);
    }
  };

  // Create initials from user's display name or email
  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-3xl py-10">
        <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Display Name
                </label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  readOnly
                />
                {user && !user.emailVerified && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-yellow-600">Email not verified</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSendVerificationEmail}
                      disabled={isSendingVerification}
                    >
                      {isSendingVerification ? "Sending..." : "Verify Email"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isUpdating || !displayName.trim()}
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </CardFooter>
          </Card>

          {/* Add more sections here as needed, like password change, linked accounts, etc. */}
        </div>
      </div>
    </ProtectedRoute>
  );
} 