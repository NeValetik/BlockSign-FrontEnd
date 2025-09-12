'use client';

import { usePathname } from 'next/navigation';
import { FC } from "react";
import { cn } from '@/utils/cn';

import Link from 'next/link';
import Container from '@/components/Container';
import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs';

interface TabConfig {
  label: string;
  href: string;
  value: string;
}

const tabs: TabConfig[] = [
  { label: 'Profile', href: '/account/profile', value: 'profile' },
  { label: 'Protection', href: '/account/protection', value: 'protection' },
  { label: 'Documents - pending', href: '/account/documents', value: 'documents' },
];

const ProfileLayout: FC<{ 
  children: React.ReactNode 
}> = ({ 
  children 
}) => {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === '/account/profile') return 'profile';
    if (pathname.startsWith('/account/protection')) return 'protection';
    if (pathname.startsWith('/account/documents')) return 'documents';
    return 'profile';
  };

  const activeTab = getActiveTab();

  return (
    <Container className="md:py-[96px] py-12 lg:px-[144px]">
      <div className="w-full">
          <Tabs defaultValue={activeTab}>
            <TabsList>
              {tabs.map((tab) => {
                return (
                  <TabsTrigger
                    key={tab.value}
                    href={tab.href}
                    isActiveValue={tab.value === activeTab}
                  >
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </Container>
  );
};

export default ProfileLayout;