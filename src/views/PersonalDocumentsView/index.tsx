'use client';

import { DocumentState } from "./components/DocumentsList/types";
import { useDocumentsContext } from "@/contexts/documentsContext";
import { Document } from "./components/DocumentsList/components/DocumentCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/Dialog";
import { useState } from "react";

import DocumentsFilters from "./components/DocumentsFilters";
import DocumentsList from "./components/DocumentsList";
import Button from "@/components/Form/Button";
import UploadForm from "./components/UploadForm";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";

const PersonalDocumentsView = () => {
  const { documents } = useDocumentsContext();
  const [open, setOpen] = useState(false);
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
  const processedData: Document[] | undefined = documents?.map((document) => ({
    id: document.id,
    title: document.title,
    image: '/static/file.svg',
    state: document.status as DocumentState,
    participants: document.participants?.map((participant) => { return participant.user.username } ) 
      .sort((a, b) => a.localeCompare(b)) || [],
    owner: document.owner?.id || "",
    updatedAt: new Date(document.updatedAt || new Date()),
  })) satisfies Document[] | undefined;

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <DocumentsFilters />
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
        <DocumentsList data={processedData} maxCards={20} />
      </div>
      
    </div>
  )
}

export default PersonalDocumentsView;