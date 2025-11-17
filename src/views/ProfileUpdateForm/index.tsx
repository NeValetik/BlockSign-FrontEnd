"use client"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/FormWrapper";
import { FC, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Form/Input";
import { AvatarImage } from "@/components/Avatar/components/AvatarImage";
import { useUserContext } from "@/contexts/userContext";
import { IProfileUpdateForm } from "./types";

import Avatar from "@/components/Avatar";
import AvatarFallback from "@/components/Avatar/components/AvatarFallback";
import FormPhoneField from "@/components/Form/FormPhoneField";
import Button from "@/components/Form/Button";
import getUserShortFromFullName from "@/utils/getUserShortFromFullName";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

const ProfileUpdateForm: FC = () => {
  const { me } = useUserContext();
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

  const defaultValues: IProfileUpdateForm = useMemo(() => {
    if (!me) return {
      fullName: '',
      idnp: '',
      email: '',
      avatar: '',
      phone: {
        code: '+373',
        number: ''
      },
    }
    return {
      fullName: me.fullName,
      idnp: '',
      email: me.email,
      avatar: "",
      phone: {
        code: '+373',
        number: '',
      },
    }
  }, [ me ]);

  const form = useForm<IProfileUpdateForm>({
    defaultValues: defaultValues,
    resolver: undefined,
  });

  const { control, handleSubmit } = form; 

  const onSubmit = (data: IProfileUpdateForm) => {
    console.log(data);
  }

  return (
    <>
      <div>
        <p className="text-sm text-muted-foreground mb-6">
          {t('profile.description')}
        </p>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">{t('profile.avatar')}</h3>
          <Avatar className="size-16">
            <AvatarImage src={""} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 text-white font-semibold text-lg">
              {getUserShortFromFullName(me?.fullName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('profile.personal.name')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('profile.personal.namePlaceholder')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="idnp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('profile.personal.idnp')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('profile.personal.idnpPlaceholder')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('profile.personal.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t('profile.personal.emailPlaceholder')}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormPhoneField name="phone" />
          <Button 
            variant="brand"
            type="submit" 
          >
            {t('profile.personal.save')}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default ProfileUpdateForm;