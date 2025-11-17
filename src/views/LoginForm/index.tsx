"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputEmail } from "@/components/Form/Input";
import { Separator, SeparatorWithText } from "@/components/Form/Separator";
import { SiApple, SiGoogle } from '@icons-pack/react-simple-icons';
import { schema } from "./schema";
import { ILoginForm } from "./types";
import { useRouter } from "next/navigation";
import { getAuthChallenge } from "@/lib/auth/mnemonicAuth";
import { useState } from "react";

// import Checkbox from "@/components/Form/Checkbox";
import Button from "@/components/Form/Button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
// import Link from "next/link";

const DefaultValues: ILoginForm = {
  loginName: "",
}

const LoginForm = () => {
  const form = useForm<ILoginForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
  const { handleSubmit, setError } = form;

  const onSubmit = async (data: ILoginForm) => {
    setIsLoading(true);
    try {
      // Validate email and get challenge (optional step for UX)
      const challenge = await getAuthChallenge(data.loginName);
      
      if (!challenge) {
        setError('loginName', { message: t('auth.login.invalidEmail') });
        return;
      }
      
      // Redirect to mnemonic form with email parameter
      push(`/login/mnemonic?email=${encodeURIComponent(data.loginName)}`);
    } catch {
      setError('loginName', { message: t('auth.login.authFailed') });
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
          {t('auth.login.title')}
        </h2>
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="lg"
          >
            <SiGoogle className="size-5" />
            <span>{t('auth.login.social.google')}</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
          >
            <SiApple className="size-5" />
            <span>{t('auth.login.social.apple')}</span>
          </Button>

        </div>
        <div>
          <SeparatorWithText textClassName="text-muted-foreground uppercase text-base">
            <span>{t('auth.login.or')}</span>
          </SeparatorWithText>
        </div>
        <div className="flex flex-col gap-6">
          <FormField name="loginName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.login.email')}</FormLabel>
                <FormControl>
                  <InputEmail {...field} placeholder={t('auth.login.emailPlaceholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          {/* <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <FormField 
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputPassword {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <Link href="/reset-password" className="underline text-brand text-base w-full flex justify-end">
                Forgot Password?
              </Link>
            </div>
            <FormField name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox {...field} />
                  </FormControl>
                  <FormLabel>Remember</FormLabel>
                </FormItem>
              )} 
            />
          </div> */}
          <Button type="submit" variant="brand" disabled={isLoading} size="lg">
            {isLoading ? t('auth.login.checking') : t('auth.login.submit')}
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 items-center">
          <span className="font-medium text-2xl">{t('auth.login.noAccount')}{' '}</span>
          <Link
            href="/register" 
            className="flex flex-col w-full items-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="
                w-full !border-brand text-brand 
                hover:text-brand-muted 
                hover:border-brand-muted
              "
              type="button"
            >
              {t('auth.login.signUp')}
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm;