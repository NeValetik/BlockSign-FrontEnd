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

const ProfileUpdateForm: FC = () => {
  const { me } = useUserContext();

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
      fullName: me.profile.fullName,
      idnp: '',
      email: me.profile.email,
      avatar: me.profile.avatar,
      phone: {
        code: me.profile.phone.code,
        number: me.profile.phone.number,
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
          Make changes to your account here. Click save when you are done.
        </p>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Avatar</h3>
          <Avatar className="size-16">
            <AvatarImage src={me?.profile.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 text-white font-semibold text-lg">
              {getUserShortFromFullName(me?.profile.fullName)}
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Account name"
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
                <FormLabel>Idnp</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1273651672"
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
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
            Save changed
          </Button>
        </form>
      </Form>
    </>
  )
}

export default ProfileUpdateForm;