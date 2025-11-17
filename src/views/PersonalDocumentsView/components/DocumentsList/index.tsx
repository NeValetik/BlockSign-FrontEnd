import { FC, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import DocumentCard from "./components/DocumentCard";
import { useUserContext } from "@/contexts/userContext";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useTokenContext } from "@/contexts/tokenContext";
import { getSignedKeyPayload } from "@/utils/getSignedKeyPayload";
import { Document } from "./components/DocumentCard";

interface DocumentsListProps {
  data?: Document[];
  maxCards: number;
}

const DocumentsList: FC<DocumentsListProps> = ({ data, maxCards }) => {
  const processedData = data?.slice(0, maxCards);
  const { token } = useTokenContext();
  const { me } = useUserContext();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
      toast.success('Document signed successfully!');
      if (result.status === 'SIGNED') {
        toast.success('All parties have signed the document!');
      }
      // Refresh the documents list
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error) => {
      console.error('Error signing document:', error);
      toast.error(error?.message || 'Failed to sign document');
    },
  });

  const handleSignDocument = async (
    document: Document,
    file: File[]
  ) => {
    if (!privateKey) {
      toast.error('Please generate a private key to sign the document');
      return
    } 
    const {signature: signatureB64} = await getSignedKeyPayload(file, document.participants, privateKey, document.title);
    signDocument({ docId: document.id, signatureB64: signatureB64 });
  }

  const handleApprove = () => async(document: Document) => {
    if (!privateKey) {
      toast.error('Please generate a private key to sign the document');
    } else {
      const { url } = await getDocumentUrl(document.id);
      const fileBlob = await fetch(url).then(res => res.blob());
      if (fileBlob && fileBlob.size > 0) {
        const file = [new File([fileBlob], document.title, { type: fileBlob.type })];
        handleSignDocument(document, file);
      } else {
        toast.error('Failed to get document file');
      }
    }
  }
  const handleReject = (id: string) => () => {
    console.log('Approve', id, me?.id);
  }
  const handleView = (id: string ) => async () =>{
    const response = await getDocumentUrl(id);
    if (!!response.url){
      window.open(response.url, '_blank');
      toast.success('Document opened successfully!');
    }
  }

  useEffect(()=>{
    const pk = localStorage.getItem("privateKey")
    if (pk) {
      setPrivateKey(pk)
    }
  }, [setPrivateKey])


  if (!data?.length) {
    return (
      <div className="w-full flex flex-col gap-16">
        <div className="flex flex-wrap gap-10">
          <div className="text-center text-sm text-gray-500">No documents found</div>
        </div>
      </div>
    )
  }
  return (
    <>
      <div className="w-full flex flex-col gap-16">
        <div className="flex flex-wrap gap-2">
          {processedData?.map((item) => (
            <DocumentCard
              key={item.id}
              document={item}
              onApprove={handleApprove()}
              onReject={handleReject(item.id)}
              onView={handleView(item.id)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default DocumentsList;