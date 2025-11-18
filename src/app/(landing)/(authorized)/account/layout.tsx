'use client';

import { usePathname } from 'next/navigation';
import { FC } from "react";
import { motion } from 'framer-motion';

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
  { label: 'Personal Documents', href: '/account/documents', value: 'documents' },
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue={activeTab}>
            <TabsList>
              {tabs.map((tab) => {
                return (
                  <TabsTrigger
                    key={tab.value}
                    href={tab.href}
                    isActiveValue={tab.value === activeTab}
                    className="px-12"
                  >
                    {tab.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6"
        >
          {children}
        </motion.div>
      </div>
    </Container>
  );
};

export default ProfileLayout;