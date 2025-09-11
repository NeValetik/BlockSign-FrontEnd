'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema";
import { IConfirmEmailForm } from "./types";
import { Form, FormControl, FormField, FormItem } from "@/components/FormWrapper";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/Form/InputOTP";

import Button from "@/components/Form/Button";

const DefaultValues: IConfirmEmailForm = {
  code: "",
}

const ConfirmEmailForm = () => {
  const form = useForm<IConfirmEmailForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  
  const { handleSubmit } = form;

  const onSubmit = (data: IConfirmEmailForm) => {
    console.log(data);
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
            to email <span className="text-brand">&lt;email@example.com&gt;</span>
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
        >
          Confirm
        </Button>
      </form>
    </Form>
  )
}

export default ConfirmEmailForm;