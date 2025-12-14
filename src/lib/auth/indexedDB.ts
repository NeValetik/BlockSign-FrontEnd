'use client'

/**
 * IndexedDB utility for storing encrypted private keys
 * Uses IndexedDB to persist encrypted keys securely
 */

const DB_NAME = 'blocksign-keys';
const DB_VERSION = 1;
const STORE_NAME = 'encryptedKeys';

interface EncryptedKeyData {
  encryptedKey: ArrayBuffer;
  iv: Uint8Array;
  salt: Uint8Array;
  iterations: number;
  memory?: number; // For Argon2id
  parallelism?: number; // For Argon2id
  kdf: 'PBKDF2' | 'Argon2id';
  createdAt: number;
}

/**
 * Initialize IndexedDB database
 */
async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Store encrypted private key in IndexedDB
 */
export async function storeEncryptedKey(
  userId: string,
  encryptedData: Omit<EncryptedKeyData, 'createdAt'>
): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const data: EncryptedKeyData & { id: string } = {
      id: userId,
      ...encryptedData,
      createdAt: Date.now(),
    };

    const request = store.put(data);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to store encrypted key'));
    };
  });
}

/**
 * Retrieve encrypted private key from IndexedDB
 */
export async function getEncryptedKey(userId: string): Promise<EncryptedKeyData | null> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(userId);

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        const { id, createdAt, ...encryptedData } = result;
        resolve(encryptedData as EncryptedKeyData);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      reject(new Error('Failed to retrieve encrypted key'));
    };
  });
}

/**
 * Delete encrypted private key from IndexedDB
 */
export async function deleteEncryptedKey(userId: string): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(userId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to delete encrypted key'));
    };
  });
}

/**
 * Check if encrypted key exists for user
 */
export async function hasEncryptedKey(userId: string): Promise<boolean> {
  const key = await getEncryptedKey(userId);
  return key !== null;
}

