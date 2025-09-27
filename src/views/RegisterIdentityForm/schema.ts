import { phoneSchema } from "@/components/Form/FormPhoneField/schema";
import z from "zod"

const idnpErrorMessage = "IDNP must be exactly 13 digits";
// const birthDateErrorMessage = "Birth date is required";
// const selfieErrorMessage = "Selfie photo is required";

export const schema = z.object({
  email: z.email(),
  idnp: z
    .string()
    .min(1, { message: "IDNP is required" })
    .regex(/^\d{13}$/, { message: idnpErrorMessage }),
  fullName: z.string().min(1, { message: "Full name is required" }),
  phone: phoneSchema,
  username: z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9._-]+$/, "Username must contain only letters, numbers, dots, and dashes" )
    .transform(val => val.toLowerCase()),
  // birthDate: z
  //   .string()
  //   .min(1, { message: birthDateErrorMessage }),
  // selfie: z
  //   .any()
  //   .refine((file) => file instanceof File, { message: selfieErrorMessage })
  //   .refine((file) => {
  //     if (!(file instanceof File)) return false;
  //     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/svg+xml', 'application/pdf'];
  //     return allowedTypes.includes(file.type);
  //   }, { message: "File must be jpeg, jpg, png, pdf, bmp, or svg format" })
  //   .refine((file) => {
  //     if (!(file instanceof File)) return false;
  //     const maxSize = 10 * 1024 * 1024; // 10MB
  //     return file.size <= maxSize;
  //   }, { message: "File size must be less than 10MB" })
});
