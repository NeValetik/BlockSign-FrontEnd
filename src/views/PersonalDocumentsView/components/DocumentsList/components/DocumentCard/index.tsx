'use client'

import { FC } from "react";
import { DocumentState } from "../../types";
import { FileText } from "lucide-react";
import { useUserContext } from "@/contexts/userContext";

// import DocumentStateTag from "../DocumentStateTag";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/Form/DropDown";
// import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/Form/Dropzone";
import Button from "@/components/Form/Button";
import DocumentStateTag from "../DocumentStateTag";

export interface Document {
  id: string;
  title: string;
  image: string;
  state: DocumentState;
  participants: string[];
  owner: string;
}
export interface DocumentCardProps {
  document: Document;
  onApprove: (document: Document) => void;
  onReject: () => void;
  onView?: () => void;
}

const DocumentCard:FC<DocumentCardProps> = ({ 
  document, 
  onApprove,
  onReject,
  onView
}) => {
  // const [ file ] = useState<File[] | undefined>(undefined);
  // const handleDrop = (acceptedFiles: File[]) => {
  //   setFile(acceptedFiles);
  // }

  const { me } = useUserContext();
  const isOwner = document.owner === me?.id;
  return (
    <div
      className="p-2 border rounded-md flex flex-col justify-between w-full"
    >
      <div
        className="flex items-center justify-between gap-2"
      >
        <button onClick={onView} className="flex items-center gap-2 cursor-pointer" disabled={!onView}>
          <FileText className="w-4 h-4"/>
          <span 
            className="text-sm font-medium line-clamp-1 leading-none"
            >
            {document.title}
          </span>
        </button>
      { ((document.state !== DocumentState.Signed) && !isOwner) && (
        <div className="flex gap-2">
          <Button 
            variant="brand"
            onClick={() => {onApprove(document)}}
          >
            Approve
          </Button>
          <Button 
            variant="destructive"
            onClick={onReject}
          >
            <span>Reject</span>
          </Button>
        </div>
      )}
      { ((document.state !== DocumentState.Pending) || isOwner) && (
          <div>
            <DocumentStateTag state={document.state} />
          </div>
        )
      }
    </div>
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
    </div>
  )

}

export default DocumentCard;