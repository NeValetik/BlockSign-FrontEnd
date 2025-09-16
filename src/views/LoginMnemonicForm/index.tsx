"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "@/components/Form/Input";
import { schema } from "./schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { getSignature } from "@/utils/getSignature";
import { setCookie } from "@/utils/cookie";
import { CompleteApiRequest, ILoginMnemonicForm } from "./types";
import { getPkFromMnemonic } from "@/utils/getPkFromMnemonic";

import Button from "@/components/Form/Button";

const DefaultValues: ILoginMnemonicForm = {
  mnemonic: "",
}

interface CompleteApiResponse {
  accessToken: string;
}

const LoginMnemonicForm = () => {
  const form = useForm<ILoginMnemonicForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const challenge = searchParams.get('challenge');
  const email = searchParams.get('email');
  if (!challenge || !email) {
    push("/login");
  }
  
  const { handleSubmit, setError } = form;

  const { mutateAsync: mutateCompleteAsync } = useMutation<CompleteApiResponse, Error, CompleteApiRequest>({
    mutationFn: async (data: CompleteApiRequest): Promise<CompleteApiResponse> => {
      const response = await fetchFromServer('/api/v1/auth/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response as CompleteApiResponse;
    },
  });

  const onSubmit = async (data: ILoginMnemonicForm) => {
    try {
      // Call the challenge API
      const pk = await getPkFromMnemonic(data.mnemonic);
      if (!challenge) {
        setError('mnemonic', { message: 'Invalid challenge' });
        return;
      }
      const {signature: signatureB64} = await getSignature(pk, challenge);
      
      // Call the complete API with typed response
      const completeResponse = await mutateCompleteAsync({
        email: email!,
        challenge: challenge,
        signatureB64,
      });
      
      setCookie('accessToken', completeResponse.accessToken);
      push("/account/profile");
    } catch {
      setError('mnemonic', { message: 'Authentication failed' });
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
         
          <Button type="submit" variant="brand">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginMnemonicForm;