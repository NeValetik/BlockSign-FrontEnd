import z from "zod";

const schema = z.object({
  document: z.array(z.instanceof(File)),
})

export default schema;