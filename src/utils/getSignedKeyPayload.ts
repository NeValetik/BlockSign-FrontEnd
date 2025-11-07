import * as ed from '@noble/ed25519';
import { sha256Hex } from './sha256Hex';

export const getSignedKeyPayload = async (document: File[], participantsUsernames: string[], privHex: string, docTitle: string) => {
  const sortedParticipantsUsernames = participantsUsernames.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  const sha256HexValue = await sha256Hex(document[0]);

  const payload = {
      sha256Hex: sha256HexValue,
      docTitle: docTitle,
      participantsUsernames: sortedParticipantsUsernames,
  };
  const message = JSON.stringify(payload);

  const privateKey = Buffer.from(privHex, 'hex');
  const msgBytes   = Buffer.from(message, 'utf8');

  const signature = await ed.signAsync(msgBytes, privateKey);

  return { signature: Buffer.from(signature).toString('base64'), message };
}