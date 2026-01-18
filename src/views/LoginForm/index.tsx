"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputEmail } from "@/components/Form/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Form/Card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { schema } from "./schema";
import { ILoginForm } from "./types";
import { useRouter } from "next/navigation";
import { getAuthChallenge } from "@/lib/auth/mnemonicAuth";
import { useState } from "react";

import Button from "@/components/Form/Button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

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
    <main className="flex-1 flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>{t('auth.login.title')}</CardTitle>
            <CardDescription>
              {t('auth.login.noAccount')}{' '}
              <Link href="/register" className="text-primary hover:underline">
                {t('auth.login.signUp')}
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <FormField 
                    name="loginName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.login.email')}</FormLabel>
                        <FormControl>
                          <InputEmail 
                            id="email"
                            {...field} 
                            placeholder={t('auth.login.emailPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} variant="brand">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? t('auth.login.checking') : t('auth.login.submit')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}

export default LoginForm;