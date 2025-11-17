"use client"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/FormWrapper";
import { FC, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Form/Input";
import { AvatarImage } from "@/components/Avatar/components/AvatarImage";
import { useUserContext } from "@/contexts/userContext";
import { IProfileUpdateForm } from "./types";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

import Avatar from "@/components/Avatar";
import AvatarFallback from "@/components/Avatar/components/AvatarFallback";
import Button from "@/components/Form/Button";
import getUserShortFromFullName from "@/utils/getUserShortFromFullName";

const ProfileUpdateForm: FC = () => {
  const { me } = useUserContext();
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

  const defaultValues: IProfileUpdateForm = useMemo(() => {
    if (!me) return {
      fullName: '',
      username: '',
      email: '',
      avatar: '',
    }
    return {
      fullName: me.fullName,
      username: me.username,
      email: me.email,
      avatar: "",
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
                    disabled
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('profile.personal.username') || 'Username'}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('profile.personal.usernamePlaceholder') || 'Username'}
                    disabled
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
                    disabled
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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