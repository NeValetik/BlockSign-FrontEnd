import { Metadata } from "next";
import { FC } from 'react';

import ProfileUpdateForm from '@/views/ProfileUpdateForm';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your BlockSign account profile and personal information.',
  robots: {
    index: false,
    follow: false,
  },
};

const ProfilePage: FC = () => {
  return (
    <div className="p-6 border rounded-md bg-muted/50">
      <ProfileUpdateForm />
    </div>
  );
};

export default ProfilePage;