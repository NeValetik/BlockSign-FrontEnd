"use client"

import { FC } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/Form/Button';

// Note: Metadata cannot be exported from client components
// Metadata is handled by the parent layout

const ProfileSettingsPage: FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const fieldVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div 
      className="p-6 border rounded-md flex flex-col gap-4 bg-muted/50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fieldVariants}>
        <h2 className="text-3xl font-semibold text-foreground mb-6">Protection</h2>
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
      </motion.div>
      <motion.div 
        className="flex flex-col gap-2"
        variants={fieldVariants}
      >
        <h3 className="text-base font-medium text-foreground">Multi-factor</h3>
        <motion.div 
          className="flex flex-col gap-2"
          variants={containerVariants}
        >
          <motion.div variants={fieldVariants}>
            <Button 
              variant="brand"
              size="default"
            >
              Confirm phone
            </Button>
          </motion.div>
          <motion.div variants={fieldVariants}>
            <Button 
              variant="brand"
              size="default"
            >
              Enable authenticator
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSettingsPage;
