'use client';

import { DocumentState } from "./components/DocumentsList/types";
import { useDocumentsContext } from "@/contexts/documentsContext";
import { Document } from "./components/DocumentsList/components/DocumentCard";

import DocumentsFilters from "./components/DocumentsFilters";
import DocumentsList from "./components/DocumentsList";

const PersonalDocumentsView = () => {
  const { documents } = useDocumentsContext();
  const processedData: Document[] | undefined = documents?.map((document) => ({
    id: document.id,
    title: document.title,
    image: '/static/file.svg',
    state: document.status as DocumentState,
    participants: document.participants?.map((participant) => { return participant.user.username } ) 
      .sort((a, b) => a.localeCompare(b)) || [],
  })) satisfies Document[] | undefined;
  return (
    <div className="flex flex-col gap-2">
      <DocumentsFilters />
      <div className="border rounded-md p-6">
        <DocumentsList data={processedData} maxCards={20} />
      </div>
    </div>
  )
}

export default PersonalDocumentsView;