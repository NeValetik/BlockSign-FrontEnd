'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FC, useLayoutEffect } from "react";
import { motion } from 'framer-motion';
import { useUserContext } from '@/contexts/userContext';

import Container from '@/components/Container';
import { Tabs, TabsList, TabsTrigger } from '@/components/Tabs';

interface TabConfig {
  label: string;
  href: string;
  value: string;
}

const tabs: TabConfig[] = [
  { label: 'Personal Documents', href: '/account/documents', value: 'documents' },
  { label: 'Profile', href: '/account/profile', value: 'profile' },
  { label: 'Protection', href: '/account/protection', value: 'protection' },
];

const ProfileLayout: FC<{ 
  children: React.ReactNode 
}> = ({ 
  children 
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { me } = useUserContext();
  const isAdmin = me?.role === 'ADMIN';

  // Redirect admin users to admin console
  useLayoutEffect(() => {
    if (isAdmin) {
      router.push('/adminconsole');
    }
  }, [isAdmin, router]);

  const getActiveTab = () => {
    if (pathname === '/account/profile') return 'profile';
    if (pathname.startsWith('/account/protection')) return 'protection';
    if (pathname.startsWith('/account/documents')) return 'documents';
    return 'profile';
  };

  const activeTab = getActiveTab();

// Don't render account pages for admin users
  if (isAdmin) {
    return null;
  }

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