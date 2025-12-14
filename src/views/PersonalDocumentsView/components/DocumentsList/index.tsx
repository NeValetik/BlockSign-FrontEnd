import { FC, useEffect, useState, useRef, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";

import DocumentCard from "./components/DocumentCard";
import { useUserContext } from "@/contexts/userContext";
import { fetchFromServer, fetchFromServerBlob } from "@/utils/fetchFromServer";
import { useTokenContext } from "@/contexts/tokenContext";
import { getSignedKeyPayloadClient } from "@/utils/getSignedKeyPayloadClient";
import { Document } from "./components/DocumentCard";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import { useSession } from "@/hooks/useSession";
import { SessionUnlockDialog } from "@/components/SessionUnlockDialog";
import { sessionActive } from "@/lib/auth/sessionManager";

interface DocumentsListProps {
  data?: Document[];
  maxCards: number;
}

const DocumentsList: FC<DocumentsListProps> = ({ data, maxCards }) => {
  const processedData = data?.slice(0, maxCards);
  const { token } = useTokenContext();
  const { me } = useUserContext();
  const { isUnlocked } = useSession();
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const [signingDocumentId, setSigningDocumentId] = useState<string | null>(null);
  const [rejectingDocumentId, setRejectingDocumentId] = useState<string | null>(null);
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const queryClient = useQueryClient();
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

  // Create a key that changes when data changes to reset animations
  const dataKey = useMemo(() => {
    if (!processedData || processedData.length === 0) return 'empty';
    return processedData.map(doc => doc.id).join(',');
  }, [processedData]);

  const { mutateAsync: getDocumentUrl } = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await fetchFromServer(`/api/v1/user/documents/${documentId}/url`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });
  
  const { mutateAsync: signDocument } = useMutation({
    mutationFn: async ({ docId, signatureB64 }: { docId: string; signatureB64: string }) => {
      const response = await fetchFromServer(`/api/v1/user/documents/${docId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ signatureB64 }),
      });
      return response;
    },
    onMutate: async ({ docId }) => {
      setSigningDocumentId(docId);
    },
    onSuccess: async (result) => {
      setSigningDocumentId(null);
      toast.success(t('documents.sign.success'));
      if (result.status === 'SIGNED') {
        toast.success(t('documents.sign.allSigned'));
      }
      // Refresh the documents list
      await queryClient.invalidateQueries({ queryKey: ['documents'] });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      await queryClient.refetchQueries({ queryKey: ['documents'] })
      await queryClient.refetchQueries({ queryKey: ['me'] });
    },
    onError: (error) => {
      setSigningDocumentId(null);
      console.error('Error signing document:', error);
      toast.error(error?.message || t('documents.sign.failed'));
    },
  });

  const { mutateAsync: reject } = useMutation({
    mutationFn: async ({ docId, reason }: { docId: string; reason?: string }) => {
      const response = await fetchFromServer(`/api/v1/user/documents/${docId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      return response;
    },
    onMutate: async ({ docId }) => {
      setRejectingDocumentId(docId);
    },
    onSuccess: async (result) => {
      setRejectingDocumentId(null);
      toast.success(t('documents.reject.success'));
      if (result.status === 'REJECTED') {
        toast.success(t('documents.reject.allRejected'));
      }
      // Refresh the documents list
      await queryClient.invalidateQueries({ queryKey: ['documents'] });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      await queryClient.refetchQueries({ queryKey: ['documents'] });
      await queryClient.refetchQueries({ queryKey: ['me'] });
    },
    onError: (error) => {
      setRejectingDocumentId(null);
      console.error('Error rejecting document:', error);
      toast.error(error?.message || t('documents.reject.failed'));
    },
  });

  const handleSignDocument = async (
    document: Document,
    file: File[]
  ) => {
    // Check if session is active
    if (!sessionActive()) {
      toast.error(t('documents.sign.sessionLocked') || 'Session is locked. Please unlock to sign documents.');
      setShowUnlockDialog(true);
      return;
    }

    try {
      const { signature: signatureB64 } = await getSignedKeyPayloadClient(
        file,
        document.participants,
        document.title
      );
      signDocument({ docId: document.id, signatureB64: signatureB64 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign document';
      if (errorMessage.includes('Session is not active')) {
        toast.error(t('documents.sign.sessionLocked') || 'Session is locked. Please unlock to sign documents.');
        setShowUnlockDialog(true);
      } else {
        toast.error(errorMessage);
      }
    }
  }

  const handleApprove = () => async(document: Document) => {
    if (!sessionActive()) {
      toast.error(t('documents.sign.sessionLocked') || 'Session is locked. Please unlock to sign documents.');
      setShowUnlockDialog(true);
      return;
    }

    const { url } = await getDocumentUrl(document.id);
    // Use API route to proxy the blob fetch to avoid CSP violations
    const proxyUrl = `/api/proxy/blob?url=${encodeURIComponent(url)}`;
    const fileBlob = await fetch(proxyUrl).then(res => res.blob());
    if (fileBlob && fileBlob.size > 0) {
      const file = [new File([fileBlob], document.title, { type: fileBlob.type })];
      handleSignDocument(document, file);
    } else {
      toast.error(t('documents.view.failed'));
    }
  }
  const handleReject = (id: string) => (reason?: string) => {
    reject({ docId: id, reason: reason });
  }
  const handleView = (id: string ) => async () =>{
    const response = await getDocumentUrl(id);
    if (!!response.url){
      // Save the URL in state
      setDocumentUrls(prev => ({ ...prev, [id]: response.url }));
      
      // Clear any existing timeout for this document
      if (timeoutRefs.current[id]) {
        clearTimeout(timeoutRefs.current[id]);
      }
      
      // Set a timeout to invalidate the link after 10 minutes (600000 ms)
      timeoutRefs.current[id] = setTimeout(() => {
        setDocumentUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls[id];
          return newUrls;
        });
        delete timeoutRefs.current[id];
      }, 10 * 60 * 1000); // 10 minutes
      
      window.open(response.url, '_blank');
      toast.success(t('documents.view.success'));
    }
  }


  // Cleanup timeouts on unmount
  useEffect(() => {
    const timeouts = timeoutRefs.current;
    return () => {
      Object.values(timeouts).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);


  if (!data?.length) {
    return (
      <div className="w-full flex flex-col gap-16">
        <div className="flex flex-wrap gap-10">
          <div className="text-center text-sm text-gray-500">{t('documents.empty.title')}</div>
        </div>
      </div>
    )
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <>
      {/* Session Unlock Dialog */}
      {me?.id && (
        <SessionUnlockDialog
          open={showUnlockDialog}
          onOpenChange={setShowUnlockDialog}
          userId={me.id}
        />
      )}
      <div className="w-full flex flex-col gap-16">
        <motion.div 
          key={dataKey}
          className="flex flex-col gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-3xl font-semibold text-foreground mb-6">
            Personal Documents
          </p>
          {processedData?.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              layout
            >
              <DocumentCard
                document={item}
                isSigningDocument={signingDocumentId === item.id}
                isRejectingDocument={rejectingDocumentId === item.id}
                onApprove={handleApprove()}
                onReject={handleReject(item.id)}
                onView={handleView(item.id)}
                documentUrl={documentUrls[item.id]}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  )
}

export default DocumentsList;