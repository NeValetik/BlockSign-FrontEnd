'use server'

import { fetchFromServer } from "@/utils/fetchFromServer";
import { getSignature } from "@/utils/getSignature";
import { getPkFromMnemonic } from "@/utils/getPkFromMnemonic";
// import { setCookie } from "@/utils/cookie";

export interface MnemonicAuthCredentials {
  email: string;
  mnemonic: string;
}

export interface ChallengeResponse {
  challenge: string;
}

export interface CompleteAuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  refreshToken: string;
}

export interface CompleteAuthRequest {
  email: string;
  challenge: string;
  signatureB64: string;
}

/**
 * Authenticate user using mnemonic phrase
 * This function handles the full challenge-response authentication flow
 */
export async function authenticateWithMnemonic(
  credentials: MnemonicAuthCredentials
): Promise<CompleteAuthResponse | null> {
  try {
    const { email, mnemonic } = credentials;

    // Step 1: Get challenge from server
    const challengeResponse = await fetchFromServer('/api/v1/auth/challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }) as ChallengeResponse;

    if (!challengeResponse.challenge) {
      throw new Error('Failed to get challenge');
    }

    // Step 2: Generate private key from mnemonic
    const privateKey = await getPkFromMnemonic(mnemonic);

    // Step 3: Sign the challenge
    const { signature: signatureB64 } = await getSignature(
      privateKey, 
      challengeResponse.challenge
    );

    // Step 4: Complete authentication
    const completeRequest: CompleteAuthRequest = {
      email,
      challenge: challengeResponse.challenge,
      signatureB64,
    };

    const authResponse = await fetchFromServer('/api/v1/auth/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completeRequest),
    }) as { accessToken: string, refreshToken: string, user: { id: string, email: string, name: string } };

    // Return user data in NextAuth expected format
    return {
      accessToken: authResponse.accessToken,
      user: authResponse.user,
      refreshToken: authResponse.refreshToken,
    };

  } catch (error) {
    console.error('Mnemonic authentication failed:', error);
    return null;
  }
}

/**
 * Get challenge for email (used in two-step auth flow)
 */
export async function getAuthChallenge(email: string): Promise<string | null> {
  try {
    const response = await fetchFromServer('/api/v1/auth/challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }) as ChallengeResponse;

    return response.challenge;
  } catch (error) {
    console.error('Failed to get challenge:', error);
    return null;
  }
}
