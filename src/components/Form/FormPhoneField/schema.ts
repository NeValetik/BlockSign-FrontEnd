import z from "zod";

export const phoneSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  number: z.string().min(8, 'Number is required'),
})