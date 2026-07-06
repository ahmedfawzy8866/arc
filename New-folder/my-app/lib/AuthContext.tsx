"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  setGuest: (value: boolean) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: false,
  loading: true,
  setGuest: () => {},
  signOut: async () => {},
});

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll', 'touchstart'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsGuest(false);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  }, []);

  const scheduleAutoSignOut = React.useCallback(() => {
    clearTimer();

    if (!auth.currentUser && !isGuest) {
      return;
    }

    timerRef.current = setTimeout(() => {
      void handleSignOut();
    }, INACTIVITY_TIMEOUT_MS);
  }, [isGuest, handleSignOut, clearTimer]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setIsGuest(false);
      setLoading(false);

      if (currentUser) {
        scheduleAutoSignOut();
      } else {
        clearTimer();
      }
    }, (error) => {
      console.error("Auth error:", error);
      setLoading(false);
      clearTimer();
    });

    return () => {
      unsubscribe();
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (!user && !isGuest) {
      return;
    }

    const handleActivity = () => scheduleAutoSignOut();
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: eventName !== 'keydown' });
    });

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
    };
  }, [user, isGuest]);


  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      loading,
      setGuest: setIsGuest,
      signOut: handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

