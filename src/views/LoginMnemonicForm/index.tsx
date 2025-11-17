"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "@/components/Form/Input";
import { schema } from "./schema";
import { useRouter, useSearchParams } from "next/navigation";
import { ILoginMnemonicForm } from "./types";
import { signIn } from "next-auth/react";
import { useState } from "react";

import Button from "@/components/Form/Button";
import { getPkFromMnemonic } from "@/utils/getPkFromMnemonic";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

const DefaultValues: ILoginMnemonicForm = {
  mnemonic: "",
}

const LoginMnemonicForm = () => {
  const form = useForm<ILoginMnemonicForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  const { push, refresh } = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
  
  // If no email parameter, redirect to login
  if (!email) {
    push("/login");
    return null;
  }
  
  const { handleSubmit, setError } = form;

  const onSubmit = async (data: ILoginMnemonicForm) => {
    setIsLoading(true);
    try {
      // Use NextAuth signIn with mnemonic provider
      const result = await signIn('mnemonic', {
        email: email,
        mnemonic: data.mnemonic,
        redirect: false,
      });
      const privateKey = await getPkFromMnemonic(data.mnemonic);
      await localStorage.setItem('privateKey', privateKey);


      if (result?.error) {
        setError('mnemonic', { message: t('auth.mnemonic.failed') });
      } else if (result?.ok) {
        // Successful authentication, redirect to profile
        push("/account/profile");
        refresh();
      }
    } catch {
      setError('mnemonic', { message: t('auth.mnemonic.failedGeneric') });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col flex-grow gap-12"
      >
        <h2 className="text-3xl font-medium text-center">
          {t('auth.mnemonic.title')}
        </h2>
        <div className="flex flex-col gap-6">
          <FormField name="mnemonic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.mnemonic.label')}</FormLabel>
                <FormControl>
                  <InputText {...field} placeholder={t('auth.mnemonic.placeholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
         
          <Button type="submit" variant="brand" disabled={isLoading}>
            {isLoading ? t('auth.mnemonic.authenticating') : t('auth.mnemonic.submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginMnemonicForm;