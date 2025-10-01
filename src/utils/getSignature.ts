'use server'
// Usage: node scripts/sign.mjs <PRIVATE_KEY_HEX> "message-to-sign"

import * as ed from '@noble/ed25519';

export const getSignature = async (privHex: string, message: string): Promise<
  {
    message: string, 
    signature: string
  }
> => {

  const privateKey = Buffer.from(privHex, 'hex');
  const msgBytes   = Buffer.from(message, 'utf8');

  const signature = await ed.signAsync(msgBytes, privateKey);

  return {
    message,
    signature: Buffer.from(signature).toString('base64')
  }
}  
