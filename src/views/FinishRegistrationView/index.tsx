'use client'

import { fetchFromServer } from "@/utils/fetchFromServer";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC } from "react";

import MnemonicPhraseDisplay from "@/components/MnemonicPhraseDisplay";
import { toast } from "sonner";

interface FinishRegistrationViewProps {
  mnemonic: string;
  publicKey: string;
  signature: string;
  token: string
}

const FinishRegistrationView: FC<FinishRegistrationViewProps> = ({ mnemonic, publicKey, signature, token }) => {
  const { push } = useRouter();
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await fetchFromServer(`/api/v1/registration/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            publicKeyEd25519Hex: publicKey,
            signatureB64: signature,
          })
        }
      )
    }
  })
  const onClickContinue = async () => {
    await mutateAsync(undefined, { 
      onSuccess: () => {
        push("/account/profile");
      },
      onError: () => {
        toast.error("Failed to complete registration");
      }
    })
  }
  return (
    <div>
      <MnemonicPhraseDisplay 
        mnemonic={mnemonic}
        onContinue={onClickContinue}
        showContinueButton
      />
    </div>
  )

}

export default FinishRegistrationView;