'use client'

/**
 * Client-side version of getSignedKeyPayload that uses session manager
 * This ensures signing only works when session is active
 */

import { signMessage } from '@/lib/auth/sessionManager';
import { sha256Hex } from './sha256Hex';

export const getSignedKeyPayloadClient = async (
  document: File[],
  participantsUsernames: string[],
  docTitle: string
): Promise<{ signature: string; message: string }> => {
  const sortedParticipantsUsernames = participantsUsernames.sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' })
  );
  const sha256HexValue = await sha256Hex(document[0]);

  const payload = {
    sha256Hex: sha256HexValue,
    docTitle: docTitle,
    participantsUsernames: sortedParticipantsUsernames,
  };
  const message = JSON.stringify(payload);

  // Sign using session manager (requires active session)
  const signatureB64 = await signMessage(message);

  return { signature: signatureB64, message };
};

