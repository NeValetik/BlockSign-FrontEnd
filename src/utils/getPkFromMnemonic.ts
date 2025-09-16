'use server'

import { mnemonicToSeedSync } from '@scure/bip39';
import { derivePath } from 'ed25519-hd-key';

export const getPkFromMnemonic = async (mnemonic: string, passphrase: string = '') => {
  // passphrase optional user-provided extra password (BIP-39 optional)

  const seed = await mnemonicToSeedSync(mnemonic, passphrase); // Buffer/Uint8Array

  const PATH = "m/44'/53550'/0'/0'/0'"; // BlockSign path (document this)
  const { key: privateKey } = await derivePath(PATH, Buffer.from(seed).toString('hex')); // 32-byte private key

  const privHex = Buffer.from(privateKey).toString('hex');
  return privHex;
}