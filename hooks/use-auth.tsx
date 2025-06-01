"use client";

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
  MultiFactorResolver,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { AuthUser } from '@/lib/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  enrollMFA: (phoneNumber: string) => Promise<string>;
  verifyMFAEnrollment: (verificationCode: string, verificationId: string) => Promise<void>;
  unenrollMFA: () => Promise<void>;
  isMFAEnabled: () => boolean;
  prepareMFAVerification: (phoneNumber: string) => Promise<string>;
  verifyMFALogin: (verificationCode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);
  
  // Create a RecaptchaVerifier instance
  const getRecaptchaVerifier = (containerId: string = 'recaptcha-container') => {
    if (typeof window === 'undefined') return null; // Skip on server-side
    
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {},
    });
  };

  // Listen for auth state changes
  useEffect(() => {
    // Skip auth state listener on server-side
    if (typeof window === 'undefined') return;
    
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const mfUser = multiFactor(user);
        // Convert Firebase user to our AuthUser type
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
          emailVerified: user.emailVerified,
          mfaEnabled: mfUser?.enrolledFactors?.length > 0,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile if displayName is provided
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      // Send verification email
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      throw err;
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // Check if this is a MFA error
      if (err.code === 'auth/multi-factor-auth-required') {
        // Get the resolver for the MFA challenge
        setResolver(err.resolver);
        throw err;
      } else {
        setError(err.message || 'Failed to sign in');
        throw err;
      }
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  // Send password reset email
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
      throw err;
    }
  };

  // Update user profile
  const updateUserProfile = async (displayName?: string, photoURL?: string) => {
    try {
      setError(null);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName || auth.currentUser.displayName,
          photoURL: photoURL || auth.currentUser.photoURL,
        });
        // Update the local user state
        if (user) {
          setUser({
            ...user,
            displayName: displayName || user.displayName,
            photoURL: photoURL || user.photoURL,
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: any) {
      setError(err.message || 'Failed to log out');
      throw err;
    }
  };

  // Send verification email
  const sendVerificationEmail = async () => {
    try {
      setError(null);
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send verification email');
      throw err;
    }
  };

  // Enroll in MFA with phone number
  const enrollMFA = async (phoneNumber: string): Promise<string> => {
    try {
      setError(null);
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      // Get the current user's multiFactor session
      const multiFactorUser = multiFactor(auth.currentUser);
      const session = await multiFactorUser.getSession();

      // Create a phone auth provider
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      
      // Send verification code to the phone
      const recaptchaVerifier = getRecaptchaVerifier();
      if (!recaptchaVerifier) {
        throw new Error('RecaptchaVerifier could not be created');
      }
      
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber, 
        recaptchaVerifier
      );

      // Return verification ID so it can be used to complete enrollment
      return verificationId;
    } catch (err: any) {
      setError(err.message || 'Failed to start MFA enrollment');
      throw err;
    }
  };

  // Verify and complete MFA enrollment
  const verifyMFAEnrollment = async (verificationCode: string, verificationId: string) => {
    try {
      setError(null);
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      // Get the current user's multiFactor object
      const multiFactorUser = multiFactor(auth.currentUser);
      
      // Create the phone auth credential using the verification ID and code
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      
      // Complete enrollment
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
      await multiFactorUser.enroll(multiFactorAssertion, "Phone number");
      
      // Update user state to reflect MFA status
      if (user) {
        setUser({
          ...user,
          mfaEnabled: true,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete MFA enrollment');
      throw err;
    }
  };

  // Unenroll from MFA
  const unenrollMFA = async () => {
    try {
      setError(null);
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      const multiFactorUser = multiFactor(auth.currentUser);
      const enrolledFactors = multiFactorUser.enrolledFactors;
      
      if (enrolledFactors.length > 0) {
        // Unenroll the first factor (usually there's only one for phone MFA)
        await multiFactorUser.unenroll(enrolledFactors[0]);
        
        // Update user state to reflect MFA status
        if (user) {
          setUser({
            ...user,
            mfaEnabled: false,
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unenroll from MFA');
      throw err;
    }
  };

  // Check if MFA is enabled
  const isMFAEnabled = (): boolean => {
    return user?.mfaEnabled || false;
  };

  // Handle MFA verification during login
  const prepareMFAVerification = async (phoneNumber: string): Promise<string> => {
    try {
      setError(null);
      if (!resolver) {
        throw new Error('No MFA resolver available');
      }

      // Get the available second factors
      const hints = resolver.hints;
      
      // Send verification code
      const recaptchaVerifier = getRecaptchaVerifier();
      if (!recaptchaVerifier) {
        throw new Error('RecaptchaVerifier could not be created');
      }
      
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      
      // Verify the phone number
      const verificationId = await phoneAuthProvider.verifyPhoneNumber({
        multiFactorHint: hints[0],
        session: resolver.session
      }, recaptchaVerifier);
      
      return verificationId;
    } catch (err: any) {
      setError(err.message || 'Failed to prepare MFA verification');
      throw err;
    }
  };

  // Complete MFA verification
  const verifyMFALogin = async (verificationCode: string) => {
    try {
      setError(null);
      if (!resolver) {
        throw new Error('No MFA resolver available');
      }
      
      // Create credential with the verification ID from preparePhoneVerification
      const credential = PhoneAuthProvider.credential(
        resolver.hints[0].uid, 
        verificationCode
      );
      
      // Complete sign-in
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
      await resolver.resolveSignIn(multiFactorAssertion);
      
      // Reset the resolver after successful verification
      setResolver(null);
    } catch (err: any) {
      setError(err.message || 'Failed to verify MFA code');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    updateUserProfile,
    logout,
    sendVerificationEmail,
    enrollMFA,
    verifyMFAEnrollment,
    unenrollMFA,
    isMFAEnabled,
    prepareMFAVerification,
    verifyMFALogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 