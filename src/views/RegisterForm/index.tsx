"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputEmail, InputPassword } from "@/components/Form/Input";
import { Separator, SeparatorWithText } from "@/components/Form/Separator";
import { SiApple, SiFacebook, SiGoogle } from '@icons-pack/react-simple-icons';
import { schema } from "./schema";
import { IRegisterForm } from "./types";

import Checkbox from "@/components/Form/Checkbox";
import Button from "@/components/Form/Button";
import Link from "next/link";

const DefaultValues: IRegisterForm = {
  loginName: "",
  password: "",
  remember: false,
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
        <h2 className="text-3xl font-medium text-center">
          Register an account
        </h2>
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            size="sm"
          >
            <SiFacebook />
            <span>Sign in with Facebook</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <SiGoogle />
            <span>Sign in with Google</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <SiApple />
            <span>Sign in with Apple</span>
          </Button>

        </div>
        <div>
          <SeparatorWithText textClassName="text-muted-foreground uppercase text-base">
            <span>Or</span>
          </SeparatorWithText>
        </div>
        <div className="flex flex-col gap-6">
          <FormField name="loginName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login Name</FormLabel>
                <FormControl>
                  <InputEmail {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
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
              <Link href="/reset-password" className="underline text-brand text-base w-full flex justify-end">
                Forgot Password?
              </Link>
            </div>
            <FormField name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox {...field} />
                  </FormControl>
                  <FormLabel>Remember</FormLabel>
                </FormItem>
              )} 
            />
          </div>
          <Button type="submit" variant="brand">
            Login
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-4 items-center">
          <span className="font-medium text-2xl">Do not have an account?</span>
          <Button
            variant="outline"
            size="sm"
            className="
              w-full !border-brand text-brand 
              hover:text-brand-muted 
              hover:border-brand-muted
            "
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterForm;