'use client'

/**
 * In-memory session manager for private key unlocking
 * 
 * Security features:
 * - Stores decrypted private key ONLY in JavaScript memory
 * - Never writes decrypted key to disk, localStorage, or IndexedDB
 * - Automatic session expiration (default 15 minutes)
 * - Zero memory: overwrites raw bytes after key import
 * - Tab reload closes session
 */

import { getEncryptedKey, storeEncryptedKey } from './indexedDB';
import { encryptPrivateKey, decryptPrivateKey } from './crypto';
import * as ed from '@noble/ed25519';

// Session expiration time (default 15 minutes)
const DEFAULT_SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

interface SessionState {
  privateKeyBytes: Uint8Array | null;
  expirationTimer: NodeJS.Timeout | null;
  expiresAt: number | null;
}

// In-memory session state (never persisted)
const sessionState: SessionState = {
  privateKeyBytes: null,
  expirationTimer: null,
  expiresAt: null,
};

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Clear session state and zero out memory
 */
function clearSession(): void {
  // Zero out private key bytes if they exist
  if (sessionState.privateKeyBytes) {
    sessionState.privateKeyBytes.fill(0);
    sessionState.privateKeyBytes = null;
  }

  // Clear expiration timer
  if (sessionState.expirationTimer) {
    clearTimeout(sessionState.expirationTimer);
    sessionState.expirationTimer = null;
  }

  sessionState.expiresAt = null;
}

/**
 * Set up automatic session expiration
 */
function setupExpiration(timeoutMs: number): void {
  // Clear existing timer
  if (sessionState.expirationTimer) {
    clearTimeout(sessionState.expirationTimer);
  }

  const expiresAt = Date.now() + timeoutMs;
  sessionState.expiresAt = expiresAt;

  sessionState.expirationTimer = setTimeout(() => {
    clearSession();
  }, timeoutMs);
}

/**
 * Unlock session by decrypting private key from IndexedDB
 * 
 * @param password - User password for decryption
 * @param userId - User identifier for key lookup
 * @param timeoutMs - Session timeout in milliseconds (default: 15 minutes)
 */
export async function unlockSession(
  password: string,
  userId: string,
  timeoutMs: number = DEFAULT_SESSION_TIMEOUT
): Promise<void> {
  try {
    // Check if session is already active
    if (sessionState.privateKeyBytes !== null) {
      throw new Error('Session is already unlocked');
    }

    // Retrieve encrypted key from IndexedDB
    const encryptedData = await getEncryptedKey(userId);
    if (!encryptedData) {
      throw new Error('No encrypted key found. Please set up your key first.');
    }

    // Decrypt the private key
    const decryptedKeyBytes = await decryptPrivateKey(
      encryptedData.encryptedKey,
      password,
      encryptedData.salt,
      encryptedData.iv,
      encryptedData.iterations
    );

    // Store decrypted key ONLY in memory
    sessionState.privateKeyBytes = decryptedKeyBytes;

    // Set up automatic expiration
    setupExpiration(timeoutMs);

    // Note: We don't zero out decryptedKeyBytes here because it's the same reference
    // The key is stored in sessionState.privateKeyBytes
  } catch (error) {
    // Clear any partial state on error
    clearSession();
    throw error;
  }
}

/**
 * Store encrypted private key in IndexedDB
 * This should be called when setting up a new key or changing password
 * 
 * @param privateKeyHex - Private key as hex string
 * @param password - User password for encryption
 * @param userId - User identifier
 */
export async function storePrivateKey(
  privateKeyHex: string,
  password: string,
  userId: string
): Promise<void> {
  const privateKeyBytes = hexToBytes(privateKeyHex);
  
  try {
    // Encrypt the private key
    const encryptedData = await encryptPrivateKey(privateKeyBytes, password);

    // Store encrypted key in IndexedDB
    await storeEncryptedKey(userId, encryptedData);

    // Zero out the private key bytes
    privateKeyBytes.fill(0);
  } catch (error) {
    // Zero out on error
    privateKeyBytes.fill(0);
    throw error;
  }
}

export function getPrivateKeyHex(): string | null {
  if (sessionState.privateKeyBytes === null) {
    return null;
  }

  return bytesToHex(sessionState.privateKeyBytes);
}

/**
 * Set session key directly from private key hex (without storing encrypted key)
 * Used when PIN is not set up and user enters seed phrase directly
 * 
 * @param privateKeyHex - Private key as hex string
 * @param timeoutMs - Session timeout in milliseconds (default: 15 minutes)
 */
export function setSessionKeyDirect(
  privateKeyHex: string,
  timeoutMs: number = DEFAULT_SESSION_TIMEOUT
): void {
  // Clear existing session
  clearSession();
  
  // Convert hex to bytes and store in memory
  sessionState.privateKeyBytes = hexToBytes(privateKeyHex);
  
  // Set up automatic expiration
  setupExpiration(timeoutMs);
}

/**
 * Check if session is currently active
 */
export function sessionActive(): boolean {
  // Check if key exists and hasn't expired
  if (sessionState.privateKeyBytes === null) {
    return false;
  }

  if (sessionState.expiresAt !== null && Date.now() >= sessionState.expiresAt) {
    clearSession();
    return false;
  }

  return true;
}

/**
 * Sign data using the unlocked private key
 * 
 * @param data - Data to sign as ArrayBuffer
 * @returns Signature as ArrayBuffer
 */
export async function sign(data: ArrayBuffer): Promise<ArrayBuffer> {
  if (!sessionActive()) {
    throw new Error('Session is not active. Please unlock your session first.');
  }

  if (sessionState.privateKeyBytes === null) {
    throw new Error('Private key not available');
  }

  // Convert ArrayBuffer to Uint8Array for @noble/ed25519
  const dataBytes = new Uint8Array(data);

  // Sign using @noble/ed25519
  const signature = await ed.signAsync(dataBytes, sessionState.privateKeyBytes);

  // Return as ArrayBuffer (ensure it's ArrayBuffer, not SharedArrayBuffer)
  return new Uint8Array(signature).buffer;
}

/**
 * Sign data and return base64 signature (convenience method)
 * 
 * @param message - Message to sign (string or ArrayBuffer)
 * @returns Base64-encoded signature
 */
export async function signMessage(message: string | ArrayBuffer): Promise<string> {
  let data: ArrayBuffer;
  
  if (typeof message === 'string') {
    const encoder = new TextEncoder();
    data = encoder.encode(message).buffer;
  } else {
    data = message;
  }

  const signature = await sign(data);
  const signatureBytes = new Uint8Array(signature);
  
  // Convert to base64
  return btoa(String.fromCharCode(...signatureBytes));
}

/**
 * Lock session and clear in-memory key
 */
export function lockSession(): void {
  clearSession();
}

/**
 * Get remaining session time in milliseconds
 * Returns 0 if session is not active
 */
export function getRemainingSessionTime(): number {
  if (!sessionActive() || sessionState.expiresAt === null) {
    return 0;
  }

  return Math.max(0, sessionState.expiresAt - Date.now());
}

/**
 * Extend session expiration time
 * 
 * @param timeoutMs - Additional time in milliseconds
 */
export function extendSession(timeoutMs: number = DEFAULT_SESSION_TIMEOUT): void {
  if (!sessionActive()) {
    throw new Error('Session is not active');
  }

  setupExpiration(timeoutMs);
}

// Clear session on page unload (tab close/reload)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    lockSession();
  });

  // Also handle visibility change (tab switch) - optional security measure
  document.addEventListener('visibilitychange', () => {
    // Optionally lock session when tab becomes hidden
    // Uncomment if you want this behavior:
    // if (document.hidden) {
    //   lockSession();
    // }
  });
}

