import { FC, useEffect, useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";

import DocumentCard from "./components/DocumentCard";
import { useUserContext } from "@/contexts/userContext";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useTokenContext } from "@/contexts/tokenContext";
import { getSignedKeyPayload } from "@/utils/getSignedKeyPayload";
import { Document } from "./components/DocumentCard";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

interface DocumentsListProps {
  data?: Document[];
  maxCards: number;
}

const DocumentsList: FC<DocumentsListProps> = ({ data, maxCards }) => {
  const processedData = data?.slice(0, maxCards);
  const { token } = useTokenContext();
  const { me } = useUserContext();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const queryClient = useQueryClient();
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);

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
  const { mutateAsync: signDocument,  } = useMutation({
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
    onSuccess: (result) => {
      toast.success(t('documents.sign.success'));
      if (result.status === 'SIGNED') {
        toast.success(t('documents.sign.allSigned'));
      }
      // Refresh the documents list
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error) => {
      console.error('Error signing document:', error);
      toast.error(error?.message || t('documents.sign.failed'));
    },
  });

  const handleSignDocument = async (
    document: Document,
    file: File[]
  ) => {
    if (!privateKey) {
      toast.error(t('documents.sign.needPrivateKey'));
      return
    } 
    const {signature: signatureB64} = await getSignedKeyPayload(file, document.participants, privateKey, document.title);
    signDocument({ docId: document.id, signatureB64: signatureB64 });
  }

  const handleApprove = () => async(document: Document) => {
    if (!privateKey) {
      toast.error(t('documents.sign.needPrivateKey'));
    } else {
      const { url } = await getDocumentUrl(document.id);
      const fileBlob = await fetch(url).then(res => res.blob());
      if (fileBlob && fileBlob.size > 0) {
        const file = [new File([fileBlob], document.title, { type: fileBlob.type })];
        handleSignDocument(document, file);
      } else {
        toast.error(t('documents.view.failed'));
      }
    }
  }
  const handleReject = (id: string) => () => {
    console.log('Approve', id, me?.id);
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

  useEffect(()=>{
    const pk = localStorage.getItem("privateKey")
    if (pk) {
      setPrivateKey(pk)
    }
  }, [setPrivateKey])

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
      <div className="w-full flex flex-col gap-16">
        <motion.div 
          className="flex flex-col gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {processedData?.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              layout
            >
              <DocumentCard
                document={item}
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