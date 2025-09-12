'use client'

import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/Form/Dropzone";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";

import FormCollaboratorField from "@/components/Form/FormCollaboratorField";
import Button from "@/components/Form/Button";

interface Collaborator {
  name: string;
  email: string;
  phone: string;
}

interface UploadFormFields {
  document: File[] | undefined;
  collaborators: Collaborator[] | undefined;
};


const UploadForm = () => {
  const form = useForm<UploadFormFields>({
    defaultValues: {
      document: [],
      collaborators: [{ name: "", email: "", phone: "" }]
    }
  })

  const { setError, clearErrors, setValue } = form;

  const handleDrop = (acceptedFiles: File[]) => {
    setValue('document', acceptedFiles);
    clearErrors('document')
  }

  const onSubmit = (data: UploadFormFields) => { console.log(data); }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-12">
        <div
          className="flex flex-col gap-20"
        >
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Dropzone
                    accept={{ 'image/*': [] }}
                    maxFiles={10}
                    maxSize={1024 * 1024 * 10}
                    minSize={1024}
                    onDrop={handleDrop}
                    onError={() => { setError('document', { message: 'Document is of the wrong type' }); } }
                    src={field.value}
                  >
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </Dropzone>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormCollaboratorField name="collaborators" />
        </div>
        <div className="flex justify-center">
          <Button
            variant="brand"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default UploadForm;