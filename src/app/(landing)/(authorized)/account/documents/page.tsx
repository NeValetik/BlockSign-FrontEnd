'use client';

import { FC } from 'react';

import PersonalDocumentsView from '@/views/PersonalDocumentsView';

// Note: Metadata cannot be exported from client components
// Metadata is handled by the parent layout

const ProfileDocumentsPage: FC = () => {
  return (
    <div>
      <PersonalDocumentsView />
    </div>
  );
};

export default ProfileDocumentsPage;
