"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText, InputFile } from "@/components/Form/Input";
import { schema } from "./schema";
import { IRegisterIdentityForm } from "./types";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";

import Button from "@/components/Form/Button";
import DatePicker from "@/components/Form/DatePicker";
import FormPhoneField from "@/components/Form/FormPhoneField";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";


const RegisterIdentityForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  // const { push } = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

  const defaultValues: IRegisterIdentityForm = {
    idnp: "",
    email: email || "",
    fullName: "",
    phone: {
      code: "",
      number: "",
    },
    username: "",
    // birthDate: "",
    // selfie: undefined,
  }
  
  const form = useForm<IRegisterIdentityForm>({ 
    defaultValues: defaultValues,
    resolver: zodResolver(schema)
  });

  const { 
    handleSubmit, 
    // setValue,
    setError
  } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IRegisterIdentityForm) => {
      const { phone, ...rest } = data;
      const body = {...rest, phone: `${phone.code}${phone.number}`}
      const response = await fetchFromServer('/api/v1/registration/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return response;
    },
  });

  const onSubmit = async (data: IRegisterIdentityForm) => {
    const { idnp, email, fullName, phone, username } = data;
    await mutateAsync({ idnp, email, fullName, phone, username }, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: () => {
        setError('idnp', { message: t('auth.identity.invalidIdnp') });
      }
    });
  }

  const handleFileChange = () => {
    // const file = event.target.files?.[0];
    // if (file) {
    //   setValue("selfie", file);
    // }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="bg-green-100 border border-green-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <Check className="text-white size-4" />
            </div>
            <div className="flex-1">
              <p className="text-brand-muted font-medium text-base leading-relaxed">
                {t('auth.identity.success.title')} {t('auth.identity.success.message')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center max-w-md">
          <p className="text-foreground mb-4">
            {t('auth.identity.success.explore')} <Link href="/"><span className="text-brand font-medium">{t('auth.identity.success.landing')}</span></Link>
          </p>
          
          <p className="text-foreground">
            {t('auth.identity.success.contact')} <Link href="/"><span className="text-brand font-medium">{t('auth.identity.success.contactSection')}</span></Link> {t('auth.identity.success.section')}
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <Form {...form}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col flex-grow gap-12"
      >
        <div
          className="flex flex-col gap-2"
        >
          <h2 className="text-3xl font-medium text-center">
            {t('auth.identity.title')}
          </h2>
        </div>
        
        <div className="flex flex-col gap-6">
          <FormField name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.identity.fullName')}</FormLabel>
                <FormControl>
                  <InputText {...field} placeholder={t('auth.identity.fullNamePlaceholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.identity.username')}</FormLabel>
                <FormControl>
                  <InputText {...field} placeholder={t('auth.identity.usernamePlaceholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormPhoneField name="phone" />
          <FormField name="idnp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.identity.idnp')}</FormLabel>
                <FormControl>
                  <InputText 
                    {...field} 
                    placeholder={t('auth.identity.idnpPlaceholder')}
                    maxLength={13}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.identity.birthDate')}</FormLabel>
                <FormControl>
                  <DatePicker {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField name="selfie"
            render={() => (
              <FormItem>
                <FormLabel>{t('auth.identity.selfie')}</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <InputFile 
                        accept="image/jpeg,image/jpg,image/png,image/bmp,image/svg+xml,application/pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <Button 
                        type="button"
                        variant="brand" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {t('auth.identity.selectFile')}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t('auth.identity.fileFormats')}
                      </span>
                      
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm">
            {t('auth.identity.credentialsNote')}
          </span>
          <Button type="submit" variant="brand" disabled={isPending}>
            {isPending ? t('auth.identity.confirming') : t('auth.identity.submit')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterIdentityForm;