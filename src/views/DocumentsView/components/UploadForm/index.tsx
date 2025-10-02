'use client'

import { useState, useEffect } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/Form/Dropzone";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { UploadFormFields } from "../../types";
import { InputText } from "@/components/Form/Input";
import { Label } from "@/components/Form/Label";
import { useMutation } from "@tanstack/react-query";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { getSignedKeyPayload } from "@/utils/getSignedKeyPayload";
import { sha256Hex } from "@/utils/sha256Hex";
import { getCookie } from "@/utils/cookie";
import { toast } from "sonner";
import { useTokenContext } from "@/contexts/tokenContext";

// import schema from "./schema";
import FormCollaboratorField from "@/components/Form/FormCollaboratorField";
import Button from "@/components/Form/Button";
import MnemonicDialog from "@/components/MnemonicDialog";

const UploadForm = () => {
  const [showMnemonicDialog, setShowMnemonicDialog] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const { token } = useTokenContext(); 

  const form = useForm<UploadFormFields>({
    // resolver: zodResolver(schema),
    defaultValues: {
      document: [],
      collaborators: [{ username: "" }],
      docTitle: "",
    }
  })

  const { setError, clearErrors, setValue } = form;

  // Check for private key cookie on component mount
  useEffect(() => {
    const existingPrivateKey = getCookie('privateKey');
    if (existingPrivateKey) {
      setPrivateKey(existingPrivateKey);
    }
  }, []);

  const handleDrop = (acceptedFiles: File[]) => {
    setValue('document', acceptedFiles);
    clearErrors('document')
  }

  const { mutateAsync: uploadDocument, isPending } = useMutation({
    mutationFn: async (data: UploadFormFields) => {
      const { document, collaborators, docTitle } = data;
      
      if (!privateKey) {
        throw new Error('Private key is required for signing');
      }
      
      // Get file hash
      const fileHash = await sha256Hex(document![0]);
      
      // Get participant usernames
      const participantsUsernames = collaborators
        ?.filter(c => c.username.trim())
        .map(c => c.username.trim()) || [];
      
       // Generate signature
       const { signature: creatorSignatureB64 } = await getSignedKeyPayload(
         document!,
         participantsUsernames,
         privateKey,
         docTitle
       );

      console.log(creatorSignatureB64);
      
       // Create FormData for file upload
       const formData = new FormData();
       formData.append('file', document![0]);
       formData.append('sha256Hex', fileHash);
       formData.append('docTitle', docTitle);
       formData.append('participantsUsernames', JSON.stringify(participantsUsernames));
       formData.append('creatorSignatureB64', creatorSignatureB64);
       
       console.log(token)
       const req = await fetchFromServer('/api/v1/user/documents', {
         method: 'POST',
         body: formData,
         headers: {
           'Authorization': `Bearer ${token}`,
         }
       });
      console.log(req);
      return req;
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to upload document");
    }
  })

  const onSubmit = async (data: UploadFormFields) => {
    // Check if private key exists, if not show mnemonic dialog
    console.log('privateKey', privateKey);
    if (!privateKey) {
      console.log('privateKey not found');
      setShowMnemonicDialog(true);
      return;
    }
    
    try {
      await uploadDocument(data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }

  const handlePrivateKeyGenerated = (newPrivateKey: string) => {
    setPrivateKey(newPrivateKey);
    // Retry the form submission after private key is generated
    form.handleSubmit(onSubmit)();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-12">
        <div
          className="flex flex-col gap-20"
        >
          <FormField
            control={form.control}
            name="docTitle"
            render={({ field }) => (
              <FormItem>
                <Label>Document Title</Label>
                <FormControl>
                  <InputText {...field} placeholder="Document title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <Label>Upload Document (PDF only)</Label>
                <FormControl>
                  <Dropzone
                    accept={{ 'application/pdf': [] }}
                    maxFiles={1}
                    maxSize={1024 * 1024 * 10}
                    minSize={1024}
                    onDrop={handleDrop}
                    onError={() => { setError('document', { message: 'Only PDF files are allowed' }); } }
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
            disabled={isPending}
          >
            {isPending ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </form>
      
      <MnemonicDialog
        isOpen={showMnemonicDialog}
        onClose={() => setShowMnemonicDialog(false)}
        onPrivateKeyGenerated={handlePrivateKeyGenerated}
      />
    </Form>
  );
}

export default UploadForm;