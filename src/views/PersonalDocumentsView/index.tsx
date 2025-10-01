import { DocumentCardProps } from "./components/DocumentsList/components/DocumentCard";
import { DocumentState } from "./components/DocumentsList/types";

import DocumentsFilters from "./components/DocumentsFilters";
import DocumentsList from "./components/DocumentsList";

const data: DocumentCardProps[] = [
  {
    title: 'Contract Agreement',
    image: '/static/file.svg',
    state: DocumentState.Pending,
  },
  {
    title: 'Terms of Service',
    image: '/static/file.svg',
    state: DocumentState.Signed,
  },
  {
    title: 'Privacy Policy',
    image: '/static/file.svg',
    state: DocumentState.Rejected,
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