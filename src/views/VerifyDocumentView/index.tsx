'use client';

import { FC } from "react";
import { motion } from 'framer-motion';
import { useTranslation } from "@/lib/i18n/client";
import { useLocale } from "@/contexts/LocaleContext";
import VerifyForm from "./VerifyForm";

const VerifyDocumentView: FC = () => {
  const { locale } = useLocale();
  const { t } = useTranslation(locale, ['verify', 'common']);

  return (
    <div className="flex flex-col gap-12">
      {/* Header Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {t('verify:title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('verify:subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <VerifyForm />
      </motion.div>
    </div>
  );
}

export default VerifyDocumentView;