# Session Management System

## Overview

This implementation provides secure in-memory session unlocking for browser-based applications. Private keys are encrypted and stored in IndexedDB, then decrypted and kept only in JavaScript memory during active sessions.

## Security Features

- **Encrypted Storage**: Private keys are encrypted using AES-GCM before storage in IndexedDB
- **In-Memory Only**: Decrypted keys exist only in JavaScript memory, never written to disk
- **Zero Memory**: Raw key bytes are overwritten with zeros after key import
- **Session Expiration**: Automatic session locking after 15 minutes (configurable)
- **Tab Reload Protection**: Session is cleared on page unload
- **PBKDF2 Key Derivation**: Uses PBKDF2 with 600,000 iterations for password-based key derivation

## Architecture

### Core Modules

1. **`indexedDB.ts`**: IndexedDB utilities for storing/retrieving encrypted keys
2. **`crypto.ts`**: WebCrypto API utilities for encryption/decryption and key derivation
3. **`sessionManager.ts`**: Main session management logic with unlock/lock/sign functions
4. **`useSession.ts`**: React hook for easy session management in components

### Components

1. **`SessionUnlockDialog`**: Dialog component for password-based session unlocking
2. **`PasswordSetupDialog`**: Dialog component for initial password setup and key encryption

## Usage

### Basic Session Management

```typescript
import { unlockSession, lockSession, sessionActive, sign } from '@/lib/auth/sessionManager';

// Unlock session with password
await unlockSession(password, userId, timeoutMs?);

// Check if session is active
if (sessionActive()) {
  // Session is unlocked
}

// Sign data
const signature = await sign(dataArrayBuffer);

// Lock session
lockSession();
```

### Using React Hook

```typescript
import { useSession } from '@/hooks/useSession';

function MyComponent() {
  const { isUnlocked, unlock, lock, sign, signMessage } = useSession();

  const handleUnlock = async () => {
    await unlock(password, userId);
  };

  const handleSign = async () => {
    const signature = await signMessage('Hello, World!');
  };

  return (
    <div>
      {isUnlocked ? (
        <button onClick={lock}>Lock Session</button>
      ) : (
        <button onClick={handleUnlock}>Unlock Session</button>
      )}
    </div>
  );
}
```

### Storing Encrypted Key

```typescript
import { storePrivateKey } from '@/lib/auth/sessionManager';

// After deriving private key from mnemonic
const privateKeyHex = await getPkFromMnemonic(mnemonic);
await storePrivateKey(privateKeyHex, password, userId);
```

## API Reference

### `unlockSession(password: string, userId: string, timeoutMs?: number): Promise<void>`

Unlocks a session by decrypting the private key from IndexedDB.

- **password**: User password for decryption
- **userId**: User identifier for key lookup
- **timeoutMs**: Optional session timeout in milliseconds (default: 15 minutes)

### `lockSession(): void`

Locks the session and clears the in-memory private key.

### `sessionActive(): boolean`

Returns `true` if session is currently active and not expired.

### `sign(data: ArrayBuffer): Promise<ArrayBuffer>`

Signs data using the unlocked private key. Throws error if session is not active.

### `signMessage(message: string | ArrayBuffer): Promise<string>`

Convenience method that signs a message and returns base64-encoded signature.

### `storePrivateKey(privateKeyHex: string, password: string, userId: string): Promise<void>`

Encrypts and stores a private key in IndexedDB.

## Security Considerations

1. **Ed25519 Limitation**: WebCrypto API doesn't natively support Ed25519, so we use `@noble/ed25519` for signing while storing raw key bytes in memory.

2. **Memory Security**: 
   - Keys are stored as `Uint8Array` in memory
   - Memory is zeroed out when session locks
   - Keys are never serialized to JSON or stored in localStorage

3. **Password Requirements**: 
   - Minimum 8 characters recommended
   - Strong passwords improve security of encrypted storage

4. **Session Timeout**: 
   - Default: 15 minutes
   - Configurable per unlock call
   - Automatically locks on expiration

5. **Tab Reload**: Session is automatically cleared on page unload to prevent key persistence across page reloads.

## Integration Points

The session system is integrated into:

- **LoginMnemonicForm**: Sets up password and unlocks session after login
- **DocumentsList**: Checks session before signing documents
- **UploadForm**: Checks session before creating signed documents

## Migration from localStorage

The old system stored private keys in `localStorage`, which is insecure. The new system:

1. Encrypts keys before storage
2. Stores in IndexedDB (more secure than localStorage)
3. Keeps decrypted keys only in memory
4. Requires password to unlock

To migrate existing users, you may need to:
1. Prompt for password on first login after update
2. Encrypt existing localStorage key (if any) and store in IndexedDB
3. Clear localStorage after migration

