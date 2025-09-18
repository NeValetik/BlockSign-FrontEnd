"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "@/components/Form/Input";
import { schema } from "./schema";
import { useRouter, useSearchParams } from "next/navigation";
import { ILoginMnemonicForm } from "./types";
import { signIn } from "next-auth/react";
import { useState } from "react";

import Button from "@/components/Form/Button";

const DefaultValues: ILoginMnemonicForm = {
  mnemonic: "",
}

const LoginMnemonicForm = () => {
  const form = useForm<ILoginMnemonicForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  const { push, refresh } = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  
  // If no email parameter, redirect to login
  if (!email) {
    push("/login");
    return null;
  }
  
  const { handleSubmit, setError } = form;

  const onSubmit = async (data: ILoginMnemonicForm) => {
    setIsLoading(true);
    try {
      // Use NextAuth signIn with mnemonic provider
      const result = await signIn('mnemonic', {
        email: email,
        mnemonic: data.mnemonic,
        redirect: false,
      });

      if (result?.error) {
        setError('mnemonic', { message: 'Authentication failed. Please check your mnemonic phrase.' });
      } else if (result?.ok) {
        // Successful authentication, redirect to profile
        push("/account/profile");
        refresh();
      }
    } catch {
      setError('mnemonic', { message: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col flex-grow gap-12"
      >
        <h2 className="text-3xl font-medium text-center">
          Enter your mnemonic phrase
        </h2>
        <div className="flex flex-col gap-6">
          <FormField name="mnemonic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mnemonic phrase</FormLabel>
                <FormControl>
                  <InputText {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
         
          <Button type="submit" variant="brand" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginMnemonicForm;