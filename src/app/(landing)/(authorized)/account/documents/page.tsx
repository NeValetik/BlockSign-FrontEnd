'use client';

import { DocumentState } from '@/views/PersonalDocumentsView/components/DocumentsList/types';
import { FC } from 'react';

import DocumentsList from '@/views/PersonalDocumentsView/components/DocumentsList';
import { DocumentCardProps } from '@/views/PersonalDocumentsView/components/DocumentsList/components/DocumentCard';

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

const ProfileDocumentsPage: FC = () => {
  return (
    <div>
       <div className="border rounded-md p-6">
        <DocumentsList data={data} maxCards={20} />
      </div>
    </div>
  );
};

export default ProfileDocumentsPage;
