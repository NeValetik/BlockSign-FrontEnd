import z from "zod";

export const schema = z.object({
  loginName: z.email(),
  // password: z.string().min(1, { message: "Password is required" }),
  // remember: z.boolean(),
})
