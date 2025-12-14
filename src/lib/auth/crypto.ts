'use client'

/**
 * Cryptographic utilities using WebCrypto API
 * Implements AES-GCM encryption and PBKDF2 key derivation
 * Note: Argon2id requires a library (not native to WebCrypto), 
 * so we use PBKDF2 with high iteration count as a secure alternative
 */

const PBKDF2_ITERATIONS = 600000; // High iteration count for security (OWASP recommendation)
const AES_KEY_LENGTH = 256; // AES-256
const AES_ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12; // 96 bits for GCM
const SALT_LENGTH = 32; // 256 bits

export interface KDFParams {
  salt: Uint8Array;
  iterations: number;
  kdf: 'PBKDF2';
}

/**
 * Derive AES key from password using PBKDF2
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  iterations: number = PBKDF2_ITERATIONS
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Ensure salt has an ArrayBuffer buffer (not SharedArrayBuffer)
  const saltBuffer = new Uint8Array(salt);

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: iterations,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: AES_ALGORITHM,
      length: AES_KEY_LENGTH,
    },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate random salt for key derivation
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generate random IV for AES-GCM encryption
 */
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Encrypt private key using AES-GCM
 */
export async function encryptPrivateKey(
  privateKeyBytes: Uint8Array,
  password: string,
  salt?: Uint8Array,
  iterations?: number
): Promise<{
  encryptedKey: ArrayBuffer;
  iv: Uint8Array;
  salt: Uint8Array;
  iterations: number;
  kdf: 'PBKDF2';
}> {
  const keySalt = salt || generateSalt();
  const keyIterations = iterations || PBKDF2_ITERATIONS;
  
  // Derive encryption key from password
  const encryptionKey = await deriveKeyFromPassword(password, keySalt, keyIterations);
  
  // Generate IV
  const iv = generateIV();
  
  // Ensure IV has an ArrayBuffer buffer (not SharedArrayBuffer)
  const ivBuffer = new Uint8Array(iv);
  
  // Ensure privateKeyBytes has an ArrayBuffer buffer (not SharedArrayBuffer)
  const privateKeyBuffer = new Uint8Array(privateKeyBytes);
  
  // Encrypt the private key
  const encryptedKey = await crypto.subtle.encrypt(
    {
      name: AES_ALGORITHM,
      iv: ivBuffer,
      tagLength: 128, // 128-bit authentication tag
    },
    encryptionKey,
    privateKeyBuffer
  );

  return {
    encryptedKey,
    iv,
    salt: keySalt,
    iterations: keyIterations,
    kdf: 'PBKDF2',
  };
}

/**
 * Decrypt private key using AES-GCM
 */
export async function decryptPrivateKey(
  encryptedKey: ArrayBuffer,
  password: string,
  salt: Uint8Array,
  iv: Uint8Array,
  iterations: number
): Promise<Uint8Array> {
  // Derive decryption key from password
  const decryptionKey = await deriveKeyFromPassword(password, salt, iterations);
  
  // Ensure IV has an ArrayBuffer buffer (not SharedArrayBuffer)
  const ivBuffer = new Uint8Array(iv);
  
  // Decrypt the private key
  const decryptedKey = await crypto.subtle.decrypt(
    {
      name: AES_ALGORITHM,
      iv: ivBuffer,
      tagLength: 128,
    },
    decryptionKey,
    encryptedKey
  );

  return new Uint8Array(decryptedKey);
}

/**
 * Import Ed25519 private key into WebCrypto
 * Note: WebCrypto doesn't natively support Ed25519, so we'll use a workaround
 * by storing the raw bytes and using @noble/ed25519 for signing
 */
export async function importEd25519PrivateKey(
  privateKeyBytes: Uint8Array
): Promise<CryptoKey> {
  // WebCrypto doesn't support Ed25519 directly, so we'll store the raw bytes
  // wrapped in a format that allows us to extract them when needed
  // For now, we'll use a simple approach: store as raw key material
  
  // Since WebCrypto doesn't support Ed25519, we'll store the key bytes
  // and use @noble/ed25519 for actual signing operations
  // This function exists for API consistency but returns a wrapped key
  
  // Ensure privateKeyBytes has an ArrayBuffer buffer (not SharedArrayBuffer)
  const privateKeyBuffer = new Uint8Array(privateKeyBytes);
  
  return crypto.subtle.importKey(
    'raw',
    privateKeyBuffer,
    {
      name: 'HKDF', // Using HKDF as a container (not used for signing)
    },
    false,
    ['deriveBits']
  );
}

