import { DocumentCardProps } from "./components/DocumentsList/components/DocumentCard";
import { DocumentState } from "./components/DocumentsList/types";

import DocumentsFilters from "./components/DocumentsFilters";
import DocumentsList from "./components/DocumentsList";

const data: DocumentCardProps[] = [
  {
    title: 'Document 1',
    image: '/',
    state: DocumentState.Pending,
  },
  {
    title: 'Document 2',
    image: '/',
    state: DocumentState.Pending,
  },
  {
    title: 'Document 3',
    image: '/',
    state: DocumentState.Pending,
  },
];

const PersonalDocumentsView = () => {

  return (
    <div className="flex flex-col gap-2">
      <DocumentsFilters />
      <div className="border rounded-md p-6">
        <DocumentsList data={data} maxCards={20} />
      </div>
    </div>
  )
}

export default PersonalDocumentsView;