import z from "zod";

export const schema = z.object({
  code: z.string().min(6, { message: "Code must be 6 characters long" }),
  password: z.string().min(8, { message: "Password must be 8 characters long" }),
  confirmPassword: z.string().min(8, { message: "Password must be 8 characters long" }),
});