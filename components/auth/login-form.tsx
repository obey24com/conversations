"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
  const { signIn, signInWithGoogle, resolver } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      
      // If we're here and no MFA resolver was created, login was successful
      if (!resolver) {
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        onSuccess();
      }
      // Otherwise, MFA verification will be handled by the MFAVerification component
    } catch (error: any) {
      // If this is an MFA error, we don't show an error toast
      // The MFAVerification component will handle the verification
      if (error.code === 'auth/multi-factor-auth-required') {
        // Do nothing, the MFAVerification component will take over
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "There was an error logging in",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "You have successfully logged in with Google",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google login failed",
        description: error.message || "There was an error logging in with Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <span className="mr-2 text-blue-500">G</span>
        Google
      </Button>

      <div className="text-center text-sm">
        <Button
          variant="link"
          className="p-0 text-xs text-gray-500 hover:text-gray-900"
          onClick={onForgotPassword}
          type="button"
        >
          Forgot password?
        </Button>
      </div>
    </div>
  );
} 