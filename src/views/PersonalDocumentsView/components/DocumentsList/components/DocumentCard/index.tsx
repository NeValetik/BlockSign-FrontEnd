import { FC } from "react";
import { DocumentState } from "../../types";
import { EllipsisVertical, FileText } from "lucide-react";

import Image from "next/image";
import DocumentStateTag from "../DocumentStateTag";

export interface DocumentCardProps {
  title: string;
  image: string;
  // link: string;
  state: DocumentState;
}

const DocumentCard:FC<DocumentCardProps> = ({ 
  title, 
  image, 
  // link,
  state
}) => {
  return (
    <div
      className="p-4 border rounded-md flex flex-col gap-2 w-full max-w-[260px]"
    >
      <div
        className="flex items-center justify-center gap-2"
      >
        <FileText className="w-4 h-4"/>
        <span 
          className="text-sm font-medium line-clamp-1 leading-none"
        >
          {title}
        </span>
        <EllipsisVertical className="w-4 h-4"/>
      </div>
      <div className="w-full h-[250px] relative">
        <Image 
          src={image} 
          alt={title} 
          width={250} 
          height={250} 
          className="w-full object-cover"
        />
        <div className="absolute bottom-0 right-0">
          <DocumentStateTag state={state} />
        </div>
      </div>
    </div>
  )

}

export default DocumentCard;