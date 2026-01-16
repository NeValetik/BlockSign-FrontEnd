'use client'

import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/Form/Dropzone";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/FormWrapper";
// import { VerifyFormFields } from "../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import schema from "./schema";

import Button from "@/components/Form/Button";
import { Label } from "@/components/Form/Label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useTokenContext } from "@/contexts/tokenContext";
import { VerifyFormFields } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, FileText, Calendar, User, Users, PenTool, Info, Link2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import { fetchFromClient } from "@/utils/fetchFromClient";


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
      signedAt: string;
    }>;
    blockchain: {
      txId: string;
      network: string;
      anchoredAt: string;
      explorerUrl: string;
    } | null;
  };
}

const VerifyForm = () => {
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const { token } = useTokenContext();
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['verify', 'common']);
  
  // Map locale keys to date locale strings
  const dateLocale = locale === 'en' ? 'en-US' : locale === 'ru' ? 'ru-RU' : 'ro-RO';
  
  const form = useForm<VerifyFormFields>({
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
    mutationFn: async (data: VerifyFormFields) => {
      const { document } = data;
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', document![0]);
      console.log("here")
      const response = await fetchFromClient('/api/v1/documents/verify', {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`  
        }
      });
      
      return response as VerificationResult;
    },
    onSuccess: (result) => {
      setVerificationResult(result);
      if (result.match) {
        toast.success(t('verify:toast.success'));
      } else {
        toast.warning(t('verify:toast.notFound'));
      }
    },
    onError: (error) => {
      toast.error(error?.message || t('verify:toast.error'));
    }
  });

  const onSubmit = async (data: VerifyFormFields) => {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-2">
              <Label className="text-base">{t('verify:form.uploadLabel')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('verify:form.uploadDescription')}
              </p>
            </div>
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Dropzone
                      accept={{ 'application/pdf': [] }}
                      maxFiles={1}
                      maxSize={1024 * 1024 * 500}
                      minSize={1024}
                      onDrop={handleDrop}
                      onError={() => { setError('document', { message: t('verify:form.pdfOnlyError') }); } }
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
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <Button
              variant="brand"
              type="submit"
              disabled={isPending}
              className="min-w-[200px]"
            >
              {isPending ? t('verify:form.verifying') : t('verify:form.verifyButton')}
            </Button>
          </motion.div>
        </form>
      </Form>
      <AnimatePresence>
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className="mt-8 p-6 border rounded-lg bg-card shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              {verificationResult.match ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <h3 className="text-xl font-semibold">{t('verify:results.title')}</h3>
            </div>
            
            <div className="space-y-6">
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="font-medium">{t('verify:results.status')}</span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 ${
                  verificationResult.match 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {verificationResult.match ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {t('verify:results.verified')}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      {t('verify:results.notFound')}
                    </>
                  )}
                </span>
              </motion.div>
              
              {/* File Hash */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('verify:results.hashLabel')}</span>
                </div>
                <code className="block px-3 py-2 bg-muted rounded text-sm break-all font-mono border border-border">
                  {verificationResult.sha256Hex}
                </code>
                <p className="text-xs text-muted-foreground">
                  {t('verify:results.hashDescription')}
                </p>
              </motion.div>

              {/* Document Details */}
              {verificationResult.match && verificationResult.document && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6 pt-4 border-t border-border"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Document Title */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{t('verify:document.title')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {verificationResult.document.title}
                      </p>
                    </div>
                    
                    {/* Created Date */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{t('verify:document.createdDate')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {new Date(verificationResult.document.createdAt).toLocaleDateString(dateLocale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Owner */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{t('verify:document.owner')}</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <p className="text-sm font-medium">{verificationResult.document.owner.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        @{verificationResult.document.owner.username} • {verificationResult.document.owner.email}
                      </p>
                    </div>
                  </div>

                  {/* Participants */}
                  {verificationResult.document.participants.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t('verify:document.participantsCount', { count: verificationResult.document.participants.length })}
                        </span>
                      </div>
                      <ul className="pl-6 space-y-2">
                        {verificationResult.document.participants.map((participant, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 + index * 0.05 }}
                            className="text-sm flex items-center gap-2"
                          >
                            <span className="font-medium">{participant.user.fullName}</span>
                            <span className="text-muted-foreground">
                              (@{participant.user.username})
                            </span>
                            {participant.required && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                                {t('verify:document.required')}
                              </span>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Signatures */}
                  {verificationResult.document.signatures.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <PenTool className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {t('verify:document.signaturesCount', { count: verificationResult.document.signatures.length })}
                        </span>
                      </div>
                      <ul className="pl-6 space-y-3">
                        {verificationResult.document.signatures.map((signature, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            className="text-sm p-3 bg-muted/50 rounded-lg border border-border"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <span className="font-medium">{signature.user.fullName}</span>
                                <span className="text-muted-foreground ml-2">
                                  (@{signature.user.username})
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(signature.signedAt).toLocaleDateString(dateLocale, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {t('verify:document.algorithm', { alg: 'SHA-256' })}
                            </div>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Blockchain Information */}
                  {verificationResult.document.blockchain && (
                    <div className="space-y-2 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{t('verify:document.blockchain')}</span>
                      </div>
                      <div className="pl-6 space-y-3">
                        <div className="p-3 bg-muted/50 rounded-lg border border-border space-y-2">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">{t('verify:document.blockchainNetwork')}</p>
                              <p className="text-sm font-medium">{verificationResult.document.blockchain.network}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">{t('verify:document.blockchainAnchoredAt')}</p>
                              <p className="text-sm font-medium">
                                {new Date(verificationResult.document.blockchain.anchoredAt).toLocaleDateString(dateLocale, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">{t('verify:document.blockchainTxId')}</p>
                            <code className="block px-2 py-1 bg-background rounded text-xs break-all font-mono border border-border">
                              {verificationResult.document.blockchain.txId}
                            </code>
                          </div>
                          {verificationResult.document.blockchain.explorerUrl && (
                            <div className="pt-2">
                              <a
                                href={verificationResult.document.blockchain.explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                              >
                                <Link2 className="h-3 w-3" />
                                {t('verify:document.viewOnExplorer')}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Not Found Message */}
              {!verificationResult.match && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 bg-muted/50 rounded-lg border border-border"
                >
                  <p className="text-sm text-muted-foreground">
                    {t('verify:notFound.title')}
                  </p>
                  <ul className="mt-2 ml-4 space-y-1 text-sm text-muted-foreground list-disc">
                    <li>{t('verify:notFound.reason1')}</li>
                    <li>{t('verify:notFound.reason2')}</li>
                    <li>{t('verify:notFound.reason3')}</li>
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!verificationResult?.match && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 rounded-lg bg-muted border border-border flex items-start gap-3"
        >
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">{t('verify:info.title')}</p>
            <p className="text-sm text-muted-foreground">
              {t('verify:info.description')}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default VerifyForm;