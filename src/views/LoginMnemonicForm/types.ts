export interface ILoginMnemonicForm {
  mnemonic: string
}

export interface CompleteApiRequest {
  email: string;
  challenge: string;
  signatureB64: string;
}