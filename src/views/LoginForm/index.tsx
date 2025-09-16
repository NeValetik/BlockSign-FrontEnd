"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputEmail } from "@/components/Form/Input";
import { Separator, SeparatorWithText } from "@/components/Form/Separator";
import { SiApple, SiFacebook, SiGoogle } from '@icons-pack/react-simple-icons';
import { schema } from "./schema";
import { ILoginForm } from "./types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchFromServer } from "@/utils/fetchFromServer";

// import Checkbox from "@/components/Form/Checkbox";
import Button from "@/components/Form/Button";
// import Link from "next/link";

const DefaultValues: ILoginForm = {
  loginName: "",
  // password: "",
  // remember: false,
}

interface ChallengeApiResponse {
  challenge: string;
}

const LoginForm = () => {
  const form = useForm<ILoginForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  const { push } = useRouter();
  
  const { handleSubmit, setError } = form;

  

  const { mutateAsync } = useMutation<ChallengeApiResponse, Error, ILoginForm>({
    mutationFn: async (data: ILoginForm): Promise<ChallengeApiResponse> => {
      const { loginName: email } = data;
      const response = await fetchFromServer('/api/v1/auth/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      return response as ChallengeApiResponse;
    },
  });

  const onSubmit = async (data: ILoginForm) => {
    try {
      // Call the challenge API
      const challengeResponse = await mutateAsync(data);
      push(`/login/mnemonic?challenge=${challengeResponse.challenge}&email=${data.loginName}`);
    } catch {
      setError('loginName', { message: 'Authentication failed' });
    }
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col flex-grow gap-12"
      >
        <h2 className="text-3xl font-medium text-center">
          Login to your account
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
          {/* <div className="flex flex-col gap-4">
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
          </div> */}
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
            type="button"
            onClick={() => push("/register")}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm;