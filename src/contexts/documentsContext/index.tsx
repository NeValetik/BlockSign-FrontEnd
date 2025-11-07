'use client';

import { createContext, useContext, useMemo } from "react";

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
}> = ({ children, documents }) => {
  const contextValue = useMemo(() => ({ documents }), [documents]);

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