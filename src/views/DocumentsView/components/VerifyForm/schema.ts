import z from "zod";

const schema = z.object({
  document: z.array(z.instanceof(File)),
  collaborators: z.array(z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  })),
})

export default schema;