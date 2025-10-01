'use server'

import { generateKey } from "@/utils/generateKey";
import { getSignature } from "@/utils/getSignature";
import { FC } from "react";
import FinishRegistrationView from "@/views/FinishRegistrationView";

const FinishRegistration:FC<{ searchParams: { token: string, email: string }}> = async ( { searchParams } ) => {
  const token = await searchParams.token;
  const email = await searchParams.email;
  const { mnemonic, privateKey, publicKey } = await generateKey();
  const { signature: signatureB64}  = await getSignature(privateKey, token);

  return (
    <FinishRegistrationView 
      mnemonic={mnemonic} 
      publicKey={publicKey} 
      signature={signatureB64} 
      token={token} 
      email={email}
    />
  )
}

export default FinishRegistration;