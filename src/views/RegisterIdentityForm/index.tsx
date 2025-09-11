"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText, InputFile } from "@/components/Form/Input";
import { schema } from "./schema";
import { IRegisterIdentityForm } from "./types";
import { useRef } from "react";

import Button from "@/components/Form/Button";
import DatePicker from "@/components/Form/DatePicker";

const DefaultValues: IRegisterIdentityForm = {
  idnp: "",
  birthDate: "",
  selfie: undefined,
}

const RegisterIdentityForm = () => {
  const form = useForm<IRegisterIdentityForm>({ 
    defaultValues: DefaultValues,
    resolver: zodResolver(schema)
  });

  const { handleSubmit, setValue } = form;

  const onSubmit = (data: IRegisterIdentityForm) => {
    console.log(data);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("selfie", file);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
          <FormField name="idnp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IDNP</FormLabel>
                <FormControl>
                  <InputText 
                    {...field} 
                    placeholder="12366127364"
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
          <Button type="submit" variant="brand">
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default RegisterIdentityForm;