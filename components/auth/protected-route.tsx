"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { AuthDialog } from "./auth-dialog";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthDialog(true);
    }
  }, [user, loading]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4 text-center">
          <h1 className="mb-4 text-2xl font-bold">Authentication Required</h1>
          <p className="mb-6 max-w-md text-gray-600">
            You need to be logged in to access this page.
          </p>
          <button
            onClick={() => setShowAuthDialog(true)}
            className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Sign In
          </button>
        </div>

        <AuthDialog 
          isOpen={showAuthDialog} 
          onClose={() => {
            setShowAuthDialog(false);
            router.push("/");
          }} 
        />
      </>
    );
  }

  return <>{children}</>;
} 