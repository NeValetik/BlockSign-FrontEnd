'use client';

import { DocumentState } from "./components/DocumentsList/types";
import { useDocumentsContext } from "@/contexts/documentsContext";
import { Document } from "./components/DocumentsList/components/DocumentCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { useEffect, useState } from "react";

import DocumentsFilters from "./components/DocumentsFilters";
import DocumentsList from "./components/DocumentsList";
import Button from "@/components/Form/Button";
import UploadForm from "./components/UploadForm";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import { useSearchParams } from "next/navigation";

const PersonalDocumentsView = () => {
  const { documents } = useDocumentsContext();
  const [open, setOpen] = useState(false);
  const [selectedStates, setSelectedStates] = useState<DocumentState[]>([]);
  const [search, setSearch] = useState<string | undefined | null>(null);
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
  const searchParams = useSearchParams();

  useEffect(()=>{
    const searchValue = searchParams.get("search");
    setSearch(searchValue);
  }, [searchParams]);
  
  // Sort documents by creation date (newest first), then map to Document format
  const processedData: Document[] | undefined = documents
    ?.slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => {
      // Sort by createdAt if available, otherwise use updatedAt
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.updatedAt || new Date()).getTime();
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.updatedAt || new Date()).getTime();
      return dateB - dateA; // Descending order (newest first)
    })
    .map((document) => ({
      id: document.id,
      title: document.title,
      image: '/static/file.svg',
      state: document.status as DocumentState,
      participants: document.participants?.map((participant) => { return participant.user.username } ) 
        .sort((a, b) => a.localeCompare(b)) || [],
      owner: document.owner?.id || "",
      updatedAt: new Date(document.updatedAt || new Date()),
    })) satisfies Document[] | undefined;

  // Filter documents based on selected states and search
  const filteredData = processedData?.filter((doc) => {
    const matchesState = selectedStates.length === 0 || selectedStates.includes(doc.state);
    const matchesSearch = !search || doc.title.toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesSearch;
  });

  console.log(processedData?.filter((doc) => (!!search && doc.title.includes(search))))
  console.log(filteredData)

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <DocumentsFilters 
          selectedStates={selectedStates}
          onStateChange={setSelectedStates}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="brand">
              <span>{t('documents.upload')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-auto max-h-[80vh]" >
            <UploadForm onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md p-6">
        <DocumentsList data={filteredData} maxCards={20} />
      </div>
      
    </div>
  )
}

export default PersonalDocumentsView;