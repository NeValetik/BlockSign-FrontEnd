'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { IConfirmEmailForm } from "./types";
import { Form, FormControl, FormField, FormItem } from "@/components/FormWrapper";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/Form/InputOTP";
import { useMutation } from "@tanstack/react-query";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Form/Button";


const ConfirmEmailForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const defaultValues: IConfirmEmailForm = {
    code: "",
    email: email || "",
  }
  const form = useForm<IConfirmEmailForm>({ 
    defaultValues: defaultValues,
    resolver: zodResolver(schema)
  });
  const { push } = useRouter();
  const { handleSubmit, setError } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IConfirmEmailForm) => {
      const response = await fetchFromServer('/api/v1/registration/request/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response;
    },
  });

  const onSubmit = async (data: IConfirmEmailForm) => {
    await mutateAsync(data, {
      onSuccess: () => {
        push(`/register/identity?email=${email}`);
      },
      onError: () => {
        setError('code', { message: 'Invalid code' });
      }
    });
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col flex-grow gap-8 items-center"
      >
        <div
          className="flex flex-col flex-grow gap-1 text-center"
        >
          <span className="text-3xl font-medium">Confirm your email</span>
          <span className="max-w-[510px] text-muted-foreground text-pretty">
            To finish the first step registration write the code sent 
            to email <span className="text-brand">&lt;{email}&gt;</span>
          </span>
        </div>
        <FormField 
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP {...field} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          variant="brand"
          className="w-[210px]"
          type="submit"
          disabled={isPending}
        >
          {isPending ? 'Confirming...' : 'Confirm'}
        </Button>
      </form>
    </Form>
  )
}

export default ConfirmEmailForm;