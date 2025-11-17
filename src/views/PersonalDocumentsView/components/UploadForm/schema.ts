import z from "zod";

const schema = z.object({
  document: z.array(z.instanceof(File)).min(1, "Please upload a document"),
  collaborators: z.array(z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
  })).min(1, "Please add at least one collaborator"),
  docTitle: z.string().min(1, "Document title is required").max(200, "Title must be less than 200 characters"),
})

export default schema;