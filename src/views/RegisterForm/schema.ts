import { phoneSchema } from "@/components/Form/FormPhoneField/schema";
import z from "zod"

const minLengthErrorMessage = "Password must be at least 8 characters long";
const maxLengthErrorMessage = "Password must be less than 20 characters";
const uppercaseErrorMessage = "Password must contain at least 1 uppercase letter";
const lowercaseErrorMessage = "Password must contain at least 1 lowercase letter";
const numberErrorMessage = "Password must contain at least 1 number";
const specialCharacterErrorMessage = "Password must contain at least 1 special character";
const passwordMismatchErrorMessage = "Passwords do not match";

const passwordSchema = z
  .string()
  .min(8, { message: minLengthErrorMessage })
  .max(20, { message: maxLengthErrorMessage })
  .refine((password) => /[A-Z]/.test(password), {
    message: uppercaseErrorMessage,
  })
  .refine((password) => /[a-z]/.test(password), {
    message: lowercaseErrorMessage,
  })
  .refine((password) => /[0-9]/.test(password), { message: numberErrorMessage })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: specialCharacterErrorMessage,
  });

export const schema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.email({ message: "Invalid email" }),
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: passwordMismatchErrorMessage,
      path: ['confirmPassword'],
  });