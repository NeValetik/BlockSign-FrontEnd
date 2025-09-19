"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText, InputFile } from "@/components/Form/Input";
import { schema } from "./schema";
import { IRegisterIdentityForm } from "./types";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useMutation } from "@tanstack/react-query";

import Button from "@/components/Form/Button";
import DatePicker from "@/components/Form/DatePicker";
import FormPhoneField from "@/components/Form/FormPhoneField";
import { Check } from "lucide-react";
import Link from "next/link";


const RegisterIdentityForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  // const { push } = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultValues: IRegisterIdentityForm = {
    idnp: "",
    email: email || "",
    fullName: "",
    phone: {
      code: "",
      number: "",
    },
    // birthDate: "",
    // selfie: undefined,
  }
  
  const form = useForm<IRegisterIdentityForm>({ 
    defaultValues: defaultValues,
    resolver: zodResolver(schema)
  });

  const { 
    handleSubmit, 
    // setValue,
    setError
  } = form;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IRegisterIdentityForm) => {
      const { phone, ...rest } = data;
      const body = {...rest, phone: `${phone.code}${phone.number}`}
      const response = await fetchFromServer('/api/v1/registration/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      return response;
    },
  });

  const onSubmit = async (data: IRegisterIdentityForm) => {
    const { idnp, email, fullName, phone } = data;
    await mutateAsync({ idnp, email, fullName, phone }, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: () => {
        setError('idnp', { message: 'Invalid IDNP' });
      }
    });
  }

  const handleFileChange = () => {
    // const file = event.target.files?.[0];
    // if (file) {
    //   setValue("selfie", file);
    // }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="bg-green-100 border border-green-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
              <Check className="text-white size-4" />
            </div>
            <div className="flex-1">
              <p className="text-brand-muted font-medium text-base leading-relaxed">
                Thank you for completing the registration form! Your request will be processed within 1 business day. 
                You will receive an additional message regarding account activation via email.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center max-w-md">
          <p className="text-foreground mb-4">
            In the meantime, we encourage you to explore the <Link href="/"><span className="text-brand font-medium">Landing</span></Link>
          </p>
          
          <p className="text-foreground">
            If you wish to verify your account status or have additional questions, please contact us using the contact details 
            in the <Link href="/"><span className="text-brand font-medium">Contact</span></Link> section.
          </p>
        </div>
      </div>
    )
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
            Confirm the identity
          </h2>
        </div>
        
        <div className="flex flex-col gap-6">
          <FormField name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <InputText {...field} placeholder="Enter your full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          <FormPhoneField name="phone" />
          <FormField name="idnp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IDNP</FormLabel>
                <FormControl>
                  <InputText 
                    {...field} 
                    placeholder="Enter your 13-digit IDNP"
                    maxLength={13}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <DatePicker {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
          
          <FormField name="selfie"
            render={() => (
              <FormItem>
                <FormLabel>Selfie</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <InputFile 
                        accept="image/jpeg,image/jpg,image/png,image/bmp,image/svg+xml,application/pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <Button 
                        type="button"
                        variant="brand" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Select file
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Accepts only jpeg, jpg, png, pdf, bmp, svg
                      </span>
                      
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm">
            The credentials are only used to verify the identity, then they are deleted
          </span>
          <Button type="submit" variant="brand" disabled={isPending}>
            {isPending ? "Confirming..." : "Confirm"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterIdentityForm;