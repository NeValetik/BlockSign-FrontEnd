import z from "zod";

const schema = z.object({
  document: z.array(z.instanceof(File)).min(1, "Please upload a document to verify"),
})

export default schema;