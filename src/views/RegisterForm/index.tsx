"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputEmail, InputPassword, InputText } from "@/components/Form/Input";
import { SiApple, SiFacebook, SiGoogle } from '@icons-pack/react-simple-icons';
import { schema } from "./schema";
import { IRegisterForm } from "./types";

import Button from "@/components/Form/Button";
import FormPhoneField from "@/components/Form/FormPhoneField";
import Link from "next/link";

const DefaultValues: IRegisterForm = {
  fullName: "",
  email: "",
  phone: {
    code: "",
    number: "",
  },
  password: "",
  confirmPassword: "",
}

const RegisterForm = () => {
  const form = useForm<IRegisterForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });

  const { handleSubmit } = form;

  const onSubmit = (data: IRegisterForm) => {
    console.log(data);
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
            Create an account
          </h2>
          <span
            className="text-base text-center"
          >
            Already have an account?{' '}
            <Link href="/login">
              <span className="underline text-brand">Log in</span>
            </Link> 
          </span>
        </div>
        <div className="flex flex-col gap-6">
          <FormField name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <InputText {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormField name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <InputEmail {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormPhoneField name="phone" />
          <div className="flex flex-col gap-4">
            <FormField 
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            <FormField name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </div>
          <Button type="submit" variant="brand">
            Sign up
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <span className="font-medium text-2xl text-muted-foreground text-center">Or continue with?</span>
          <Button
            variant="outline"
            size="sm"
          >
            <SiFacebook />
            <span>Continue with Facebook</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <SiGoogle />
            <span>Continue with Google</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <SiApple />
            <span>Continue with Apple</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterForm;