import { NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import { authenticateWithMnemonic, MnemonicAuthCredentials } from "./mnemonicAuth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      loginName?: string;
      token?: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      };
    };
    error?: string | null;
  }
}

interface CustomJWT extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string | null;
  user?: User;
}

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  loginName?: string;
  username?: string;
  token?: {
    accessToken: string;
    refreshToken: string; 
    expiresIn: number;
  };
}

const refreshAccessToken = async (token: CustomJWT): Promise<CustomJWT> => {
  try {
    const apiUrl = process.env.API_URL;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Auth-Type': 'nextauth',
    };

    if (token.refreshToken) {
      headers.cookie = `refresh_token=${token.refreshToken}`;
    } 

    const response = await fetch(`${apiUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Still include for fallback to cookie-based auth
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`Refresh failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Update the token with new access token and refresh token
    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken || token.refreshToken, // Use new refresh token if provided
      expiresAt: Date.now() + (14 * 60 * 1000), // 15 minutes from now
      error: null,
    };
  } catch (error) {
    console.error('Error during refreshAccessToken:', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authConfig:NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "mnemonic",
      name: 'Mnemonic',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        mnemonic: { label: "Mnemonic Phrase", type: "text", placeholder: "Enter your mnemonic phrase" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.mnemonic) {
          return null;
        }

        const authCredentials: MnemonicAuthCredentials = {
          email: credentials.email,
          mnemonic: credentials.mnemonic,
        };

        const authResult = await authenticateWithMnemonic(authCredentials);
        if (authResult) {
          const token = {
            accessToken: authResult.accessToken,
            refreshToken: authResult.refreshToken,
            expiresIn: 14 * 60 // 15 minutes in seconds
          }

          return {
            id: authResult.user.id,
            email: authResult.user.email,
            name: authResult.user.name,
            token
          };
        }
        
        return null;
      }
    }),
    CredentialsProvider({
      id: "email-only",
      name: 'Email Challenge',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }
        return {
          id: "temp",
          email: credentials.email,
          name: "Pending Mnemonic Auth",
        };
      }
    }), 
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const customToken = token as CustomJWT;
      
      if (user) {
        customToken.user = user as User;
        customToken.accessToken = (user as User)?.token?.accessToken;
        customToken.refreshToken = (user as User)?.token?.refreshToken;
        customToken.expiresAt = Date.now() + (14 * 60 * 1000); // 15 minutes from now instead of using expiresIn
        customToken.error = null;
      }
      
      if (customToken.expiresAt && Date.now() < customToken.expiresAt) {
        return customToken;
      }
      
      return refreshAccessToken(customToken);
    },
    async session({ session, token }) {
      const customToken = token as CustomJWT;
      const user = customToken.user;
      
      session.user = {
        id: user?.id,
        email: user?.email,
        image: user?.image,
        name: user?.name,
        loginName: user?.loginName,
        token: {
          accessToken: customToken.accessToken || '',
          refreshToken: customToken.refreshToken || '',
          expiresIn: 14 * 60// 15 minutes in seconds
        },
      };
      
      session.error = customToken.error;
      
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}