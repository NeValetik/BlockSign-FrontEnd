import z from "zod"

export const schema = z.object({
  loginName: z.string().min(1, { message: "Login name is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  remember: z.boolean(),
})