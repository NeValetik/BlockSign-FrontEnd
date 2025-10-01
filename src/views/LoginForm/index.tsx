"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputEmail, InputPassword } from "@/components/Form/Input";
import { SeparatorWithText } from "@/components/Form/Separator";
import { SiApple, SiGoogle } from '@icons-pack/react-simple-icons';
import { schema } from "./schema";
import { ILoginForm } from "./types";

import Checkbox from "@/components/Form/Checkbox";
import Button from "@/components/Form/Button";
import Link from "next/link";
import { useClientTranslation } from "@/hooks/useLocale";

const DefaultValues: ILoginForm = {
  loginName: "",
  password: "",
  remember: false,
}

const LoginForm = () => {
  const { t } = useClientTranslation();
  const form = useForm<ILoginForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  
  const { handleSubmit } = form;

  const onSubmit = (data: ILoginForm) => {
    console.log(data);
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('auth.login.subtitle')}
          </p>
        </div>

        <Form {...form}>
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
          >
            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
              >
                <SiGoogle className="size-5" />
                <span>{t('auth.login.social.google')}</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
              >
                <SiApple className="size-5" />
                <span>{t('auth.login.social.apple')}</span>
              </Button>
            </div>

            <div className="relative">
              <SeparatorWithText textClassName="text-muted-foreground text-sm">
                <span>{t('auth.login.or')}</span>
              </SeparatorWithText>
            </div>

            <div className="space-y-4">
              <FormField 
                name="loginName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.login.email')}</FormLabel>
                    <FormControl>
                      <InputEmail {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              
              <FormField 
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.login.password')}</FormLabel>
                    <FormControl>
                      <InputPassword {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <div className="flex items-center justify-between">
                <FormField 
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox {...field} />
                      </FormControl>
                      <FormLabel className="text-sm">{t('auth.login.remember')}</FormLabel>
                    </FormItem>
                  )} 
                />
                <Link 
                  href="/reset-password" 
                  className="text-sm text-brand hover:text-brand/80 transition-colors"
                >
                  {t('auth.login.forgot')}
                </Link>
              </div>

              <Button 
                type="submit" 
                variant="brand" 
                size="lg"
                className="w-full h-12 text-base font-semibold"
              >
                {t('auth.login.submit')}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.login.noAccount')}{' '}
                <Link 
                  href="/register" 
                  className="text-brand hover:text-brand/80 font-semibold transition-colors"
                >
                  {t('auth.login.signUp')}
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default LoginForm;