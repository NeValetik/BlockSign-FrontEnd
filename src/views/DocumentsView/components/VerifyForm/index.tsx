'use client'

import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/Form/Dropzone";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/FormWrapper";
// import { VerifyFormFields } from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import schema from "./schema";
import { z } from "zod";

import Button from "@/components/Form/Button";
import { Label } from "@/components/Form/Label";
import { useMutation } from "@tanstack/react-query";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { toast } from "sonner";
import { useState } from "react";


interface VerificationResult {
  match: boolean;
  sha256Hex: string;
  document?: {
    id: string;
    title: string;
    createdAt: string;
    status: string;
    owner: {
      id: string;
      email: string;
      fullName: string;
      username: string;
    };
    participants: Array<{
      user: {
        id: string;
        email: string;
        fullName: string;
        username: string;
      };
      required: boolean;
    }>;
    signatures: Array<{
      user: {
        id: string;
        username: string;
        fullName: string;
      };
      alg: string;
      signedAt: string;
    }>;
  };
}

const VerifyForm = () => {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  
  type FormData = z.infer<typeof schema>;
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      document: [],
    }
  })

  const { setError, clearErrors, setValue } = form;

  const handleDrop = (acceptedFiles: File[]) => {
    setValue('document', acceptedFiles);
    clearErrors('document');
    setVerificationResult(null); // Clear previous results
  }

  const { mutateAsync: verifyDocument, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const { document } = data;
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', document![0]);
      
      const response = await fetchFromServer('/api/v1/user/documents/verify', {
        method: 'POST',
        body: formData,
      });
      
      return response as VerificationResult;
    },
    onSuccess: (result) => {
      setVerificationResult(result);
      if (result.match) {
        toast.success("Document verified successfully!");
      } else {
        toast.warning("Document not found in the system");
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to verify document");
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await verifyDocument(data);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-12">
          <div className="flex flex-col gap-20">
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <Label>Upload Document to Verify (PDF only)</Label>
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
          </div>
          <div className="flex justify-center">
            <Button
              variant="brand"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Verifying..." : "Verify Document"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Verification Results */}
      {verificationResult && (
        <div className="mt-8 p-6 border rounded-lg bg-card">
          <h3 className="text-lg font-semibold mb-4">Verification Results</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                verificationResult.match 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {verificationResult.match ? 'VERIFIED' : 'NOT FOUND'}
              </span>
            </div>
            
            <div>
              <span className="font-medium">File Hash:</span>
              <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-sm">
                {verificationResult.sha256Hex}
              </code>
            </div>

            {verificationResult.match && verificationResult.document && (
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Document Title:</span>
                  <span className="ml-2">{verificationResult.document.title}</span>
                </div>
                
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">
                    {new Date(verificationResult.document.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Owner:</span>
                  <span className="ml-2">
                    {verificationResult.document.owner.fullName} ({verificationResult.document.owner.username})
                  </span>
                </div>

                <div>
                  <span className="font-medium">Participants:</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    {verificationResult.document.participants.map((participant, index) => (
                      <li key={index} className="text-sm">
                        {participant.user.fullName} ({participant.user.username})
                        {participant.required && <span className="text-blue-600 ml-1">*</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-medium">Signatures ({verificationResult.document.signatures.length}):</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    {verificationResult.document.signatures.map((signature, index) => (
                      <li key={index} className="text-sm">
                        {signature.user.fullName} ({signature.user.username}) - 
                        <span className="ml-1 text-gray-600">
                          {new Date(signature.signedAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyForm;