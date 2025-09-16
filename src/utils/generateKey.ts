import * as ed from '@noble/ed25519';
import { generateMnemonic, mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { derivePath } from 'ed25519-hd-key';

export const generateKey = async (userSeed?: string) => {
  const mnemonic = generateMnemonic(wordlist, 128); // 12 words (128 bits). For 24 words use 256.
  const passphrase = userSeed || ''; // optional user-provided extra password (BIP-39 optional)

  const seed = mnemonicToSeedSync(mnemonic, passphrase); // Buffer/Uint8Array

  // Derive Ed25519 SLIP-0010 key at your fixed path
  const PATH = "m/44'/53550'/0'/0'/0'"; // BlockSign path
  const { key: privateKey } = derivePath(PATH, Buffer.from(seed).toString('hex')); // 32-byte private key

  const publicKey = await ed.getPublicKeyAsync(privateKey);

  const privHex = Buffer.from(privateKey).toString('hex');
  const pubHex  = Buffer.from(publicKey).toString('hex');

  return {
    privateKey: privHex,
    publicKey: pubHex,
    mnemonic,
  }
}