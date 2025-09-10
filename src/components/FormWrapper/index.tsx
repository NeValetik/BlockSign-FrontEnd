"use client"

import { FormProvider } from "react-hook-form"
import useFormField from "./hooks/useFormField"
import FormItem from "./components/FormItem"
import FormLabel from "./components/FormLabel"
import FormControl from "./components/FormControl"
import FormDescription from "./components/FormDescription"
import FormMessage from "./components/FormMessage"
import FormField from "./components/FormField"

// Form is just an alias for FormProvider from react-hook-form
export const Form = FormProvider

export {
  useFormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}