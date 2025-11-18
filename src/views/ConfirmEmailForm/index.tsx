'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { IConfirmEmailForm } from "./types";
import { Form, FormControl, FormField, FormItem } from "@/components/FormWrapper";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/Form/InputOTP";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Form/Card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Form/Button";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";


const ConfirmEmailForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
  
  const defaultValues: IConfirmEmailForm = {
    code: "",
    email: email || "",
  }
  const form = useForm<IConfirmEmailForm>({ 
    defaultValues: defaultValues,
    resolver: zodResolver(schema)
  });
  const { push } = useRouter();
  const { handleSubmit, setError } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IConfirmEmailForm) => {
      const response = await fetchFromServer('/api/v1/registration/request/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },
  });

  const onSubmit = async (data: IConfirmEmailForm) => {
    await mutateAsync(data, {
      onSuccess: () => {
        push(`/register/identity?email=${email}`);
      },
      onError: () => {
        setError('code', { message: t('auth.confirm.invalidCode') });
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
            <CardTitle className="text-center">{t('auth.confirm.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.confirm.subtitle')} <span className="text-brand">&lt;{email}&gt;</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-center">
                  <FormField 
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP {...field} maxLength={6}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  variant="brand"
                  className="w-full"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? t('auth.confirm.confirming') : t('auth.confirm.submit')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}

export default ConfirmEmailForm;