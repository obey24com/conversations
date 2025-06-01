"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./login-form";
import { SignUpForm } from "./signup-form";
import { ResetPasswordForm } from "./reset-password-form";

type AuthTab = "login" | "signup" | "reset-password";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: AuthTab;
}

export function AuthDialog({ isOpen, onClose, defaultTab = "login" }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value as AuthTab);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {activeTab === "login" && "Welcome Back"}
            {activeTab === "signup" && "Create Account"}
            {activeTab === "reset-password" && "Reset Password"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="mt-4">
            <LoginForm 
              onSuccess={onClose} 
              onForgotPassword={() => setActiveTab("reset-password")}
            />
          </TabsContent>
          
          <TabsContent value="signup" className="mt-4">
            <SignUpForm 
              onSuccess={onClose} 
            />
          </TabsContent>
          
          <TabsContent value="reset-password" className="mt-4">
            <ResetPasswordForm 
              onSuccess={() => {
                setActiveTab("login");
              }}
              onCancel={() => setActiveTab("login")}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 