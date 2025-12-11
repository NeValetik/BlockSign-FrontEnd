'use client';

import { createContext, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFromServer } from "@/utils/fetchFromServer";
import { useTokenContext } from "@/contexts/tokenContext";

export interface DocumentsContextProps {
  documents: {
    id: string;
    title: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    mimeType?: string;
    sizeBytes?: number;
    myRole?: string;
    progress?: { totalRequired: number; totalSigned: number };
    owner?: {
      id: string;
      username: string;
      fullName: string;
    };
    participants?: {
      user: {
        id: string;
        username: string;
        fullName: string;
      };
      required: boolean;
      decision: string;
      decidedAt: Date;
    }[];
    signatures?: {
      user: {
        id: string;
        username: string;
        fullName: string;
      };
      alg: string;
      signedAt: Date;
    }[];
  }[] | null;
}

const DocumentsContext = createContext<DocumentsContextProps>({ documents: null });

export const DocumentsContextProvider: React.FC<{
  documents: DocumentsContextProps['documents'];
  children: React.ReactNode;
}> = ({ children, documents: initialDocuments }) => {
  const { token } = useTokenContext();
  
  // Fetch documents using React Query so it can be refetched when invalidated
  const { data: documents } = useQuery({
    queryKey: ['documents', token],
    queryFn: async () => {
      if (!token) return null;
      try {
        const response = await fetchFromServer(`/api/v1/user/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        return response.documents || null;
      } catch (error) {
        console.error('Error fetching documents:', error);
        return null;
      }
    },
    enabled: !!token,
    initialData: initialDocuments,
    staleTime: 0, // Always consider stale to allow refetching
  });

  const contextValue = useMemo(() => ({ documents: documents ?? null }), [documents]);

  return (
    <DocumentsContext.Provider value={contextValue}>
      {children}
    </DocumentsContext.Provider>
  );
};

export const useDocumentsContext = () => {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocumentsContext must be used within a DocumentsContextProvider');
  }
  return context;
};