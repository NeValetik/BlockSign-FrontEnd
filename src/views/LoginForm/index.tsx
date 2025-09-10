"use client"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputEmail, InputPassword } from "@/components/Form/Input";
import Checkbox from "@/components/Form/Checkbox";
import Button from "@/components/Form/Button";

interface ILoginForm {
  loginName: string;
  password: string;
  remember: boolean;
}

const DefaultValues: ILoginForm = {
  loginName: "",
  password: "",
  remember: false,
}

const schema = z.object({
  loginName: z.string().min(1, { message: "Login name is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  remember: z.boolean(),
})

const LoginForm = () => {

  const form = useForm<ILoginForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  const { handleSubmit } = form;
  const onSubmit = (data: ILoginForm) => {
    console.log(data);
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow gap-4">
        <FormField name="loginName"
         render={({ field }) => (
          <FormItem>
            <FormLabel>Login Name</FormLabel>
            <FormControl>
              <InputEmail {...field} />
            </FormControl>
          </FormItem>
        )} />
        <FormField 
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword {...field} />
              </FormControl>
            </FormItem>
          )} 
        />
        <FormField name="remember"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remember</FormLabel>
              <FormControl>
                <Checkbox {...field} />
              </FormControl>
            </FormItem>
          )} 
        />
        <Button type="submit" variant="brand">
          Login
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm;