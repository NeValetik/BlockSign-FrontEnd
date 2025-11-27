'use client'

import { useState, useEffect, FC } from "react";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/Form/Dropzone";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "@/components/Form/Input";
import { Label } from "@/components/Form/Label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { getSignedKeyPayload } from "@/utils/getSignedKeyPayload";
import { sha256Hex } from "@/utils/sha256Hex";
import { toast } from "sonner";
import { useTokenContext } from "@/contexts/tokenContext";
import { Collaborator } from "@/views/VerifyDocumentView/types";

// import schema from "./schema";
import FormCollaboratorField from "@/components/Form/FormCollaboratorField";
import Button from "@/components/Form/Button";
import MnemonicDialog from "@/components/MnemonicDialog";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

export interface UploadFormFields {
  document: File[];
  collaborators: Collaborator[];
  docTitle: string;
};

interface UploadFormProps {
  onClose: () => void;
}

const UploadForm: FC<UploadFormProps> = ({ onClose }) => {
  const [showMnemonicDialog, setShowMnemonicDialog] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const { token } = useTokenContext();
  const queryClient = useQueryClient();
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']); 

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
    const existingPrivateKey = localStorage.getItem('privateKey');
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
       
       const req = await fetchFromServer('/api/v1/user/documents', {
         method: 'POST',
         body: formData,
         headers: {
           'Authorization': `Bearer ${token}`,
         }
       });
      return req;
    },
    onSuccess: async () => {
      toast.success(t('documents.upload.success'));
      form.reset();
      // Refresh the documents list - invalidate and refetch immediately
      await queryClient.invalidateQueries({ queryKey: ['documents'] });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      // Explicitly refetch to ensure data is updated
      await queryClient.refetchQueries({ queryKey: ['me'] });
      await queryClient.refetchQueries({ queryKey: ['documents'] });
    },
    onError: async (error) => {
      toast.error(error?.message || t('documents.upload.failed'));
      await queryClient.refetchQueries({ queryKey: ['me'] });
      await queryClient.refetchQueries({ queryKey: ['documents'] });
    }
  })

  const onSubmit = async (data: UploadFormFields) => {
    // Check if private key exists, if not show mnemonic dialog
    if (!privateKey) {
      setShowMnemonicDialog(true);
      return;
    }
    
    try {
      await uploadDocument(data);
    } catch (error) {
      toast.error((error as Error).message || t('documents.upload.failed'));
    } finally {
      onClose();
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
                <Label>{t('documents.upload.title')}</Label>
                <FormControl>
                  <InputText {...field} placeholder={t('documents.upload.titlePlaceholder')} />
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
                <Label>{t('documents.upload.label')}</Label>
                <FormControl>
                  <Dropzone
                    accept={{ 'application/pdf': [] }}
                    maxFiles={1}
                    maxSize={1024 * 1024 * 500}
                    minSize={1024}
                    onDrop={handleDrop}
                    onError={() => { setError('document', { message: t('documents.upload.pdfOnly') }); } }
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
            {isPending ? t('documents.upload.uploading') : t('documents.upload')}
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