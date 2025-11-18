"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputEmail } from "@/components/Form/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Form/Card";
import { SiApple, SiFacebook, SiGoogle } from '@icons-pack/react-simple-icons';
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { schema } from "./schema";
import { IRegisterForm } from "./types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchFromServer } from "@/utils/fetchFromServer";

import Button from "@/components/Form/Button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

const DefaultValues: IRegisterForm = {
  email: "",
  // fullName: "",
  // phone: {
  //   code: "",
  //   number: "",
  // },
  // password: "",
  // confirmPassword: "",
}

const RegisterForm = () => {
  const form = useForm<IRegisterForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });

  const { handleSubmit, setError } = form;
  const { push } = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IRegisterForm) => {
      const response = await fetchFromServer('/api/v1/registration/request/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },
  });

  const onSubmit = async (data: IRegisterForm) => {
    await mutateAsync(data, {
      onSuccess: () => {
        push(`/register/confirm-email?email=${data.email}`)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        // Handle specific error cases
        if (error?.status === 409) {
          setError('email', { message: t('auth.register.emailExists') });
        } else if (error?.status === 400) {
          setError('email', { message: t('auth.register.invalidEmail') });
        } else if (error?.status === 429) {
          setError('email', { message: t('auth.register.tooManyRequests') });
        } else {
          setError('email', { message: t('auth.register.failed') });
        }
      }
    });
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
            <CardTitle>{t('auth.register.title')}</CardTitle>
            <CardDescription>
              {t('auth.register.hasAccount')}{' '}
              <Link href="/login" className="text-primary hover:underline">
                {t('auth.register.signIn')}
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <FormField 
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.register.email')}</FormLabel>
                        <FormControl>
                          <InputEmail 
                            id="email"
                            {...field} 
                            placeholder={t('auth.register.emailPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending} variant="brand">
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? t('auth.register.sending') : t('auth.register.submit')}
                </Button>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('auth.register.or')}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
            >
              <SiFacebook />
              <span>{t('auth.register.social.facebook')}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full"
            >
              <SiGoogle />
              <span>{t('auth.register.social.google')}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full"
            >
              <SiApple />
              <span>{t('auth.register.social.apple')}</span>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}

export default RegisterForm;