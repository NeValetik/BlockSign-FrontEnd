"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { InputEmail, InputPassword } from "@/components/Form/Input";
import { Separator, SeparatorWithText } from "@/components/Form/Separator";
import { SiApple, SiFacebook, SiGoogle } from '@icons-pack/react-simple-icons';
import { schema } from "./schema";
import { IResetPasswordForm } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/Form/Button";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

const DefaultValues: IResetPasswordForm = {
  code: "",
  password: "",
  confirmPassword: "",
}

const ResetPasswordForm = () => {
  const form = useForm<IResetPasswordForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  const { handleSubmit } = form;
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
  const onSubmit = (data: IResetPasswordForm) => {
    console.log(data);
  }
  return (
    <Form {...form}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col flex-grow gap-12"
      >
        <h2 className="text-3xl font-medium text-center">
          {t('auth.reset.title')}
        </h2>
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="sm"
          >
            <SiFacebook />
            <span>{t('auth.reset.social.facebook')}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <SiGoogle />
            <span>{t('auth.reset.social.google')}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <SiApple />
            <span>{t('auth.reset.social.apple')}</span>
          </Button>

        </div>
        <div>
          <SeparatorWithText textClassName="text-muted-foreground uppercase text-base">
            <span>{t('auth.reset.or')}</span>
          </SeparatorWithText>
        </div>
        <div className="flex flex-col gap-6">
          <FormField name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.reset.code')}</FormLabel>
                <FormControl>
                  <InputEmail {...field} placeholder={t('auth.reset.codePlaceholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField 
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.reset.password')}</FormLabel>
                <FormControl>
                  <InputPassword {...field} placeholder={t('auth.reset.passwordPlaceholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField 
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.reset.confirmPassword')}</FormLabel>
                <FormControl>
                  <InputPassword {...field} placeholder={t('auth.reset.confirmPasswordPlaceholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <Button type="submit" variant="brand">
            {t('auth.reset.submit')}
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 items-center">
          <span className="font-medium text-2xl">{t('auth.reset.rememberPassword')}</span>
          <Button
            variant="outline"
            size="sm"
            className="
              w-full !border-brand text-brand 
              hover:text-brand-muted 
              hover:border-brand-muted
            "
          >
            {t('auth.reset.backToLogin')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ResetPasswordForm;