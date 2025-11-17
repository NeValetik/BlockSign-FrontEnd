'use client'

import { fetchFromServer } from "@/utils/fetchFromServer";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import MnemonicPhraseDisplay from "@/components/MnemonicPhraseDisplay";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

interface FinishRegistrationViewProps {
  mnemonic: string;
  publicKey: string;
  signature: string;
  token: string;
  email: string;
}

const FinishRegistrationView: FC<FinishRegistrationViewProps> = ({ email, mnemonic, publicKey, signature, token }) => {
  const { push, refresh } = useRouter();
  const [ isLoading, setIsLoading ] = useState(false);
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
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

  const handleLogin = async () => {
    try {
      // Use NextAuth signIn with mnemonic provider
      const result = await signIn('mnemonic', {
        email: email,
        mnemonic: mnemonic,
        redirect: false,
      });

      if (result?.ok) {
        // Successful authentication, redirect to profile
        push("/account/profile");
        refresh();
      } else {
        push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  }
  const onClickContinue = async () => {
    setIsLoading(true);
    await mutateAsync(undefined, { 
      onSuccess: async () => {
        await handleLogin();
        setIsLoading(false);
      },
      onError: () => {
        toast.error(t('finishRegistration.completeFailed'));
      }
    })
  }
  return (
    <div>
      <MnemonicPhraseDisplay 
        mnemonic={mnemonic}
        onContinue={onClickContinue}
        isLoading={isLoading}
        showContinueButton
      />
    </div>
  )

}

export default FinishRegistrationView;