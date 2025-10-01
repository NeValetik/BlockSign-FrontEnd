"use client"

import { FC } from 'react';
import Button from '@/components/Form/Button';

const ProfileSettingsPage: FC = () => {
  return (
    <div className="p-6 border rounded-md flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">Protection</h2>
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-medium text-foreground">Password</h3>
          <div>
            <Button 
              variant="brand"
              size="default"
            >
              Change password
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-medium text-foreground">Multi-factor</h3>
        <div className="flex flex-col gap-2">
          <div>
            <Button 
              variant="brand"
              size="default"
            >
              Confirm phone
            </Button>
          </div>
          <div>
            <Button 
              variant="brand"
              size="default"
            >
              Enable authenticator
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
