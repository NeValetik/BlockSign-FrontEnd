'use client'

import { FC, useState } from "react";
import { DocumentState } from "../../types";
import { EllipsisVertical, FileText } from "lucide-react";

import DocumentStateTag from "../DocumentStateTag";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Form/DropDown";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/Form/Dropzone";

export interface Document {
  id: string;
  title: string;
  image: string;
  state: DocumentState;
  participants: string[];
}
export interface DocumentCardProps {
  document: Document;
  onApprove: (document: Document, file: File[]) => void;
  onReject: () => void;
  onView?: () => void;
}

const DocumentCard:FC<DocumentCardProps> = ({ 
  document, 
  onApprove,
  onReject,
  // onView
}) => {
  const [file, setFile] = useState<File[] | undefined>(undefined);
  const handleDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles);
  }
  return (
    <div
      className="p-4 border rounded-md flex flex-col gap-2 w-full max-w-[260px]"
    >
      <div
        className="flex items-center justify-between gap-2"
      >
        <FileText className="w-4 h-4"/>
        <span 
          className="text-sm font-medium line-clamp-1 leading-none"
        >
          {document.title}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <EllipsisVertical className="w-4 h-4"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem className="cursor-pointer" variant="default">
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer" 
              variant="default"
              onClick={() => {onApprove(document, file || [])}}
            >
              <span className="text-brand">Approve</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer" 
              variant="destructive"
              onClick={onReject}
            >
              <span>Reject</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full h-[250px] relative">
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
        )}
        {document.state === DocumentState.Signed && (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-medium text-brand">
              Validated
            </span>
          </div>
        )}
        <div className="absolute bottom-0 right-0">
          <DocumentStateTag state={document.state} />
        </div>
      </div>
    </div>
  )

}

export default DocumentCard;