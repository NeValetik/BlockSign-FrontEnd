import { FC } from "react";

import DocumentCard, { DocumentCardProps } from "./components/DocumentCard";

interface DocumentsListProps {
  data: DocumentCardProps[];
  maxCards: number;
}

const DocumentsList: FC<DocumentsListProps> = ({ data, maxCards }) => {
  const processedData = data.slice(0, maxCards);

  if (!data.length) {
    return (
      <div className="w-full flex flex-col gap-16">
        <div className="flex flex-wrap gap-10">
          <div className="text-center text-sm text-gray-500">No documents found</div>
        </div>
      </div>
    )
  }
  return (
    <div className="w-full flex flex-col gap-16">
      <div className="flex flex-wrap gap-10">
        {processedData.map((item) => (
          <DocumentCard
            key={item.title}
            title={item.title}
            image={item.image}
            state={item.state}
          />
        ))}
      </div>
    </div>
  )
}

export default DocumentsList;