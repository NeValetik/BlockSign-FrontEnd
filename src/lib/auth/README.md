# NextAuth Mnemonic Authentication Integration

This document explains how the mnemonic-based authentication has been integrated with NextAuth.

## Overview

The authentication system now supports:
1. **Traditional OAuth providers** (Google, GitHub) - unchanged
2. **Mnemonic-based authentication** - new integration with the existing challenge-response flow
3. **Access token persistence** - properly handled through NextAuth session management

## Architecture

### Files Modified/Created:

1. **`/src/lib/auth/mnemonicAuth.ts`** - Core authentication logic
2. **`/src/lib/auth/authConfig.ts`** - NextAuth configuration with mnemonic provider
3. **`/src/views/LoginForm/index.tsx`** - Updated to work with NextAuth
4. **`/src/views/LoginMnemonicForm/index.tsx`** - Updated to use NextAuth signIn

### Authentication Flow:

```
1. User enters email in LoginForm
2. System validates email and gets challenge from backend
3. User is redirected to LoginMnemonicForm with email parameter
4. User enters mnemonic phrase
5. NextAuth mnemonic provider:
   - Derives private key from mnemonic
   - Signs the challenge
   - Sends complete authentication request to backend
   - Receives access token
6. NextAuth stores token in session
7. User is redirected to profile/dashboard
```

## Usage Examples

### 1. Checking Authentication Status

```tsx
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Loading...</p>
  if (status === "unauthenticated") return <p>Not signed in</p>
  
  return (
    <div>
      <p>Signed in as {session?.user?.email}</p>
      <p>Access Token: {session?.accessToken}</p>
    </div>
  );
}
```

### 2. Protected Pages

```tsx
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return null;
  
  return <div>Protected content here</div>;
}
```

### 3. Server-Side Authentication

```tsx
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth/authConfig";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authConfig);
  
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  
  return {
    props: {
      session,
      accessToken: session.accessToken, // Your custom access token
    },
  };
}
```

### 4. Making API Calls with Access Token

```tsx
import { useSession } from "next-auth/react";

function useAuthenticatedFetch() {
  const { data: session } = useSession();
  
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    if (!session?.accessToken) {
      throw new Error("No access token available");
    }
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
  };
  
  return authenticatedFetch;
}
```

### 5. Sign Out

```tsx
import { signOut } from "next-auth/react";

function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/login" })}>
      Sign Out
    </button>
  );
}
```

## Provider Configuration

The NextAuth configuration includes two credential providers:

### 1. Mnemonic Provider (`id: "mnemonic"`)
- Handles the full authentication flow
- Accepts email and mnemonic phrase
- Returns user object with custom access token

### 2. Email Challenge Provider (`id: "email-only"`)
- Optional: for validating email format before mnemonic step
- Can be used for progressive authentication UI

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Migration Notes

### From Cookie-Based to NextAuth Session

**Before:**
```tsx
import { setCookie, getCookie } from "@/utils/cookie";

// Set token
setCookie('accessToken', token);

// Get token
const token = getCookie('accessToken');
```

**After:**
```tsx
import { useSession } from "next-auth/react";

// Get token from session
const { data: session } = useSession();
const token = session?.accessToken;
```

### URL Parameters

The mnemonic form no longer requires challenge parameter in URL:
- **Before:** `/login/mnemonic?challenge=xyz&email=user@example.com`
- **After:** `/login/mnemonic?email=user@example.com`

## Benefits of Integration

1. **Unified Session Management**: All authentication methods use the same session system
2. **Automatic Token Refresh**: NextAuth handles token lifecycle
3. **Server-Side Support**: Easy to check authentication on server-side
4. **TypeScript Support**: Full type safety for session data
5. **Security**: Built-in CSRF protection and secure cookie handling
6. **Flexibility**: Easy to add more authentication providers in the future

## Testing the Integration

1. Start your development server
2. Navigate to `/login`
3. Enter a valid email address
4. You'll be redirected to `/login/mnemonic?email=yourEmail`
5. Enter your mnemonic phrase
6. Upon successful authentication, you'll be redirected to `/account/profile`
7. The session will contain your access token available at `session.accessToken`
