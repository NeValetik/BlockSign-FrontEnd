'use client'

/**
 * React hook for session management
 * Provides easy access to session functions and state
 */

import { useState, useEffect, useCallback } from 'react';
import {
  unlockSession,
  lockSession,
  sessionActive,
  sign,
  signMessage,
  getRemainingSessionTime,
  extendSession,
  storePrivateKey,
  getPrivateKeyHex,
} from '@/lib/auth/sessionManager';

interface UseSessionReturn {
  isUnlocked: boolean;
  remainingTime: number;
  unlock: (password: string, userId: string, timeoutMs?: number) => Promise<void>;
  lock: () => void;
  sign: (data: ArrayBuffer) => Promise<ArrayBuffer>;
  signMessage: (message: string | ArrayBuffer) => Promise<string>;
  extend: (timeoutMs?: number) => void;
  storeKey: (privateKeyHex: string, password: string, userId: string) => Promise<void>;
  getPrivateKeyHex: () => Promise<string | null>;
}

/**
 * Hook for managing session state
 */
export function useSession(): UseSessionReturn {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Check session status periodically
  useEffect(() => {
    const checkSession = () => {
      const active = sessionActive();
      setIsUnlocked(active);
      if (active) {
        setRemainingTime(getRemainingSessionTime());
      } else {
        setRemainingTime(0);
      }
    };

    // Initial check
    checkSession();

    // Check every second
    const interval = setInterval(checkSession, 1000);

    return () => clearInterval(interval);
  }, []);

  const unlock = useCallback(async (
    password: string,
    userId: string,
    timeoutMs?: number
  ) => {
    await unlockSession(password, userId, timeoutMs);
    setIsUnlocked(true);
    setRemainingTime(getRemainingSessionTime());
  }, []);

  const lock = useCallback(() => {
    lockSession();
    setIsUnlocked(false);
    setRemainingTime(0);
  }, []);

  const signData = useCallback(async (data: ArrayBuffer) => {
    if (!sessionActive()) {
      throw new Error('Session is not active');
    }
    return sign(data);
  }, []);

  const signMsg = useCallback(async (message: string | ArrayBuffer) => {
    if (!sessionActive()) {
      throw new Error('Session is not active');
    }
    return signMessage(message);
  }, []);

  const extend = useCallback((timeoutMs?: number) => {
    if (!sessionActive()) {
      throw new Error('Session is not active');
    }
    extendSession(timeoutMs);
    setRemainingTime(getRemainingSessionTime());
  }, []);

  const storeKey = useCallback(async (
    privateKeyHex: string,
    password: string,
    userId: string
  ) => {
    await storePrivateKey(privateKeyHex, password, userId);
  }, []);

  const getPrivateKeyHex = useCallback(async () => {
    return getPrivateKeyHex();
  }, []);

  return {
    isUnlocked,
    remainingTime,
    unlock,
    lock,
    sign: signData,
    signMessage: signMsg,
    extend,
    storeKey,
    getPrivateKeyHex,
  };
}

