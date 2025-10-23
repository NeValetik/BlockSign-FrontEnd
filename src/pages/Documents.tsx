import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDropzone } from 'react-dropzone';
import { Upload, FileCheck, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

const Documents = () => {
  const { t } = useTranslation();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'verified' | 'not-found' | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleVerify(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  const handleVerify = async (file: File) => {
    setVerifying(true);
    setVerificationResult(null);
    
    // Simulate blockchain verification
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Randomly verify or not (for demo)
    const isVerified = Math.random() > 0.5;
    setVerificationResult(isVerified ? 'verified' : 'not-found');
    setVerifying(false);
    
    if (isVerified) {
      toast.success(t('documents.verified'));
    } else {
      toast.error(t('documents.notFound'));
    }
  };

  const handleCreateDocument = async (file: File) => {
    toast.success('Document created and pending signature');
    // Would add to pending documents
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-8">{t('documents.upload')}</h1>

            <Tabs defaultValue="verify" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="verify">{t('documents.verify')}</TabsTrigger>
                <TabsTrigger value="create">{t('documents.create')}</TabsTrigger>
              </TabsList>

              <TabsContent value="verify" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div
                      {...getRootProps()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                      )}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">
                        {t('documents.dragDrop')}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('documents.or')}
                      </p>
                      <Button variant="secondary">{t('documents.browse')}</Button>
                    </div>

                    {verifying && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-4 bg-muted rounded-lg flex items-center justify-center space-x-3"
                      >
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span>{t('documents.verifying')}</span>
                      </motion.div>
                    )}

                    {verificationResult === 'verified' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 bg-primary/10 border border-primary rounded-lg flex items-center space-x-3"
                      >
                        <FileCheck className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{t('documents.verified')}</p>
                          <p className="text-sm text-muted-foreground">
                            Hash: 0x1234...5678
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {verificationResult === 'not-found' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center space-x-3"
                      >
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="font-medium">{t('documents.notFound')}</p>
                          <p className="text-sm text-muted-foreground">
                            This document has not been verified on the blockchain
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div
                      {...getRootProps()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                      )}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">
                        Upload document to create blockchain record
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('documents.or')}
                      </p>
                      <Button variant="secondary">{t('documents.browse')}</Button>
                    </div>

                    <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                      <p>
                        Documents will be hashed and stored on the blockchain.
                        You'll be able to sign them in your dashboard.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documents;
