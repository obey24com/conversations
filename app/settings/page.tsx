"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute, MFAEnrollment } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // In a real app, you would call an API to delete the user's account
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log out the user after account deletion
      await logout();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to delete account",
        description: error.message || "There was an error deleting your account",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-3xl py-10">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        
        <div className="grid gap-6">
          {/* Security Settings */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-sm text-gray-500">
              Manage your account security settings
            </p>
          </div>
          
          {/* Two-Factor Authentication */}
          <MFAEnrollment />

          {/* Notification Settings */}
          <div className="space-y-2 pt-6">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-gray-500">
              Manage how we contact you
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Preferences</CardTitle>
              <CardDescription>Manage your email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="text-xs text-gray-500">
                    Receive emails about your account activity and updates
                  </span>
                </Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <div className="space-y-2 pt-6">
            <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
            <p className="text-sm text-gray-500">
              Irreversible account actions
            </p>
          </div>
          
          <Card className="border-red-200">
            <CardHeader className="text-red-500">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Delete Account
              </CardTitle>
              <CardDescription>
                Actions here can&apos;t be undone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  Deleting your account will remove all of your information from our database. This cannot be undone.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 