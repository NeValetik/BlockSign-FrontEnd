'use client'

import { FC, useState } from "react";
import { DocumentState } from "../../types";
import { FileText, Loader2 } from "lucide-react";
import { useUserContext } from "@/contexts/userContext";
import { motion } from "framer-motion";

// import DocumentStateTag from "../DocumentStateTag";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Form/DropDown";
// import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/Form/Dropzone";
import Button from "@/components/Form/Button";
import DocumentStateTag from "../DocumentStateTag";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import RejectSignModal from "../RejectSignModal";

export interface Document {
  id: string;
  title: string;
  image: string;
  state: DocumentState;
  participants: string[];
  owner: string;
  updatedAt: Date;
  signatures: string[] 
}
export interface DocumentCardProps {
  document: Document;
  onApprove: (document: Document) => void;
  onReject: (reason?: string) => void;
  onView?: () => void;
  documentUrl?: string;
  isSigningDocument: boolean;
  isRejectingDocument?: boolean;
  isSignedByMe?: boolean;
}

const DocumentCard:FC<DocumentCardProps> = ({ 
  document, 
  onApprove,
  onReject,
  onView,
  documentUrl,
  isSigningDocument,
  isRejectingDocument,
  isSignedByMe,
}) => {
  const { me } = useUserContext();
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['common']);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const isOwner = document.owner === me?.id;
  const availableTill = new Date(document.updatedAt.getTime() + 1000 * 60 * 60 * 24 * 7);
  const isAvailable = new Date().getTime() - availableTill.getTime() < 0;
  const dateLocale = locale === 'en' ? 'en-US' : locale === 'ru' ? 'ru-RU' : 'ro-RO';
  return (
    <motion.div
      className="p-2 border rounded-md flex flex-col justify-between w-full"
      layout
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="flex items-center justify-between gap-2"
      >
        {documentUrl && isAvailable && (
          <Link
            href={documentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <FileText className="h-8 w-8 text-brand"/>
            <div className="flex flex-col items-start gap-2">
              <span 
                className="text-sm font-medium line-clamp-1 leading-none"
              >
                {document.title}
              </span>
              <span className="text-sm font-medium line-clamp-1 leading-none">
                {t('documents.availableTill')} {availableTill.toLocaleDateString(dateLocale)}
              </span>
            </div>
          </Link>
        )}
        {!documentUrl && isAvailable && (
          <button onClick={onView} className="flex items-center gap-2 cursor-pointer" disabled={!onView}>
            <FileText className="h-8 w-8 text-brand"/>
            <div className="flex flex-col items-start gap-2">
              <span 
                className="text-sm font-medium line-clamp-1 leading-none truncate"
              >
                {document.title}
              </span>
              <span className="text-sm font-medium line-clamp-1 leading-none">
                {t('documents.availableTill')} {availableTill.toLocaleDateString(dateLocale)}
              </span>
            </div>
          </button>
        )}
        {!isAvailable && (
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-brand"/>
            <div className="flex flex-col items-start gap-2">
              <span 
                className="text-sm font-medium line-clamp-1 leading-none truncate"
              >
                {document.title}
              </span>
              <span className="text-sm font-medium line-clamp-1 leading-none">
                {t('documents.status.expired')}
              </span>
            </div>
          </div>
        )}
        { ((document.state !== DocumentState.Signed && document.state !== DocumentState.Rejected) && !isSignedByMe) && (
          <div className="flex gap-2">
            <Button 
              variant="brand"
              onClick={() => {onApprove(document)}}
              disabled={isSigningDocument}
            >
              {isSigningDocument ? <Loader2 className="w-4 h-4 animate-spin" /> : t('documents.actions.approve')}
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setIsRejectModalOpen(true)}
              disabled={isSigningDocument || isRejectingDocument}
            >
              {isRejectingDocument ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{t('documents.actions.reject')}</span>}
            </Button>
          </div>
        )}
        { ((document.state !== DocumentState.Pending) || isSignedByMe) && (
          <div>
            <DocumentStateTag state={document.state} />
          </div>
        )}
      </div>
      <RejectSignModal
        open={isRejectModalOpen}
        onOpenChange={setIsRejectModalOpen}
        onReject={onReject}
        isRejecting={isRejectingDocument}
      />
      {/* <div className="w-full  relative">
        {document.state !== DocumentState.Signed && (
          <Dropzone
            accept={{ 'application/pdf': [] }}
            maxFiles={1}
            maxSize={1024 * 1024 * 10}
            minSize={1024}
            onDrop={handleDrop}
            src={file}
          >
            <DropzoneEmptyState text="Upload the designated file"/>
            <DropzoneContent />
          </Dropzone>
        )} */}
        {/* <div className="absolute bottom-0 right-0">
          <DocumentStateTag state={document.state} />
        </div> */}
      {/* </div> */}
    </motion.div>
  )

}

export default DocumentCard;