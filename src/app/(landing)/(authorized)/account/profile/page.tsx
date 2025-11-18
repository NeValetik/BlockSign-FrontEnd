import { FC } from 'react';

import ProfileUpdateForm from '@/views/ProfileUpdateForm';

const ProfilePage: FC = () => {
  return (
    <div className="p-6 border rounded-md bg-muted/50">
      <ProfileUpdateForm />
    </div>
  );
};

export default ProfilePage;