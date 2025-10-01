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
          Reset your password
        </h2>
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="sm"
          >
            <SiFacebook />
            <span>Reset with Facebook</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <SiGoogle />
            <span>Reset with Google</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <SiApple />
            <span>Reset with Apple</span>
          </Button>

        </div>
        <div>
          <SeparatorWithText textClassName="text-muted-foreground uppercase text-base">
            <span>Or</span>
          </SeparatorWithText>
        </div>
        <div className="flex flex-col gap-6">
          <FormField name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <InputEmail {...field} placeholder="Enter verification code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField 
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <InputPassword {...field} placeholder="Enter new password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField 
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <InputPassword {...field} placeholder="Confirm new password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <Button type="submit" variant="brand">
            Reset Password
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 items-center">
          <span className="font-medium text-2xl">Remember your password?</span>
          <Button
            variant="outline"
            size="sm"
            className="
              w-full !border-brand text-brand 
              hover:text-brand-muted 
              hover:border-brand-muted
            "
          >
            Back to Login
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ResetPasswordForm;